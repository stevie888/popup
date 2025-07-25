import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/database';

// GET - Get user's credit transactions
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'User ID is required'
      }, { status: 400 });
    }

    const transactions = await executeQuery(`
      SELECT 
        id,
        user_id,
        type,
        amount,
        description,
        method,
        created_at as timestamp
      FROM credit_transactions
      WHERE user_id = ?
      ORDER BY created_at DESC
      LIMIT 50
    `, [userId]) as any[];

    return NextResponse.json({
      success: true,
      transactions: transactions.map(transaction => ({
        id: transaction.id,
        userId: transaction.user_id,
        type: transaction.type,
        amount: transaction.amount,
        description: transaction.description,
        method: transaction.method,
        timestamp: transaction.timestamp
      }))
    });
  } catch (error) {
    console.error('Error fetching credit transactions:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch credit transactions'
    }, { status: 500 });
  }
}

// POST - Create credit transaction (for rental deductions)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, type, amount, description, method } = body;

    if (!userId || !type || !amount || !description) {
      return NextResponse.json({
        success: false,
        error: 'All fields are required'
      }, { status: 400 });
    }

    const result = await executeQuery(`
      INSERT INTO credit_transactions (user_id, type, amount, description, method)
      VALUES (?, ?, ?, ?, ?)
    `, [userId, type, amount, description, method || null]) as any;

    return NextResponse.json({
      success: true,
      transactionId: result.insertId,
      message: 'Transaction recorded successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating credit transaction:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create credit transaction'
    }, { status: 500 });
  }
}

// OPTIONS - Handle CORS preflight
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
} 