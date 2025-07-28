import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    // Get all users with their basic information
    const users = await executeQuery(
      'SELECT id, username, name, email, mobile, role, credits, created_at FROM users ORDER BY created_at DESC',
      []
    ) as any[];

    return NextResponse.json({
      success: true,
      users: users
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 