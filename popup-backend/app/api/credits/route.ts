import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/database';

// GET - Get user's credit balance
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

    const users = await executeQuery(
      'SELECT credits FROM users WHERE id = ?',
      [userId]
    ) as any[];

    if (users.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'User not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      balance: users[0].credits || 0
    });
  } catch (error) {
    console.error('Error fetching credit balance:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch credit balance'
    }, { status: 500 });
  }
}

// POST - Top up credits
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, amount, method } = body;

    if (!userId || !amount || amount <= 0) {
      return NextResponse.json({
        success: false,
        error: 'Valid user ID and amount are required'
      }, { status: 400 });
    }

    // Get current balance
    const users = await executeQuery(
      'SELECT credits FROM users WHERE id = ?',
      [userId]
    ) as any[];

    if (users.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'User not found'
      }, { status: 404 });
    }

    const currentBalance = users[0].credits || 0;
    const newBalance = currentBalance + amount;

    // Update user's credits
    await executeQuery(
      'UPDATE users SET credits = ? WHERE id = ?',
      [newBalance, userId]
    );

    // Record transaction
    await executeQuery(`
      INSERT INTO credit_transactions (user_id, type, amount, description, method)
      VALUES (?, 'topup', ?, ?, ?)
    `, [userId, amount, `Top up ${amount} credits via ${method}`, method]);

    return NextResponse.json({
      success: true,
      newBalance,
      message: `Successfully added ${amount} credits`
    });
  } catch (error) {
    console.error('Error topping up credits:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to top up credits'
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