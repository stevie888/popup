import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, credits } = body;

    // Validate input
    if (!userId || !credits) {
      return NextResponse.json(
        { error: 'User ID and credits amount are required' },
        { status: 400 }
      );
    }

    if (typeof credits !== 'number' || credits <= 0) {
      return NextResponse.json(
        { error: 'Credits must be a positive number' },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUsers = await executeQuery(
      'SELECT id, username, name, credits FROM users WHERE id = ?',
      [userId]
    ) as any[];

    if (existingUsers.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const user = existingUsers[0];

    // Update user credits
    const newCredits = user.credits + credits;
    await executeQuery(
      'UPDATE users SET credits = ? WHERE id = ?',
      [newCredits, userId]
    );

    // Get updated user data
    const updatedUsers = await executeQuery(
      'SELECT id, username, name, credits, role, email, mobile, createdAt FROM users WHERE id = ?',
      [userId]
    ) as any[];

    const updatedUser = updatedUsers[0];

    return NextResponse.json({
      success: true,
      user: updatedUser,
      creditsAdded: credits,
      previousCredits: user.credits,
      newCredits: newCredits,
      message: `Successfully added ${credits} credits to ${user.name}`
    }, { status: 200 });

  } catch (error) {
    console.error('Add credits error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 