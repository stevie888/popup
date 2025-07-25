import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { identifier } = body; // username, email, or mobile

    if (!identifier) {
      return NextResponse.json(
        { error: 'Identifier is required' },
        { status: 400 }
      );
    }

    // Clean the identifier (remove dashes and spaces for mobile numbers)
    const cleanIdentifier = identifier.replace(/[\s-]/g, '');

    // Check if user exists by username, email, or mobile
    const users = await executeQuery(
      'SELECT id, username, email, name, mobile, role FROM users WHERE username = ? OR email = ? OR mobile = ?',
      [identifier, identifier, identifier]
    ) as any[];

    // If no exact match found, try with cleaned mobile number
    if (users.length === 0 && /^\d+$/.test(cleanIdentifier)) {
      // Try to find by cleaned mobile number (removing dashes from database values)
      const allUsers = await executeQuery(
        'SELECT id, username, email, name, mobile, role FROM users',
        []
      ) as any[];

      const matchedUser = allUsers.find(user => {
        const cleanUserMobile = user.mobile?.replace(/[\s-]/g, '') || '';
        const cleanUserUsername = user.username?.replace(/[\s-]/g, '') || '';
        return cleanUserMobile === cleanIdentifier || cleanUserUsername === cleanIdentifier;
      });

      if (matchedUser) {
        return NextResponse.json({
          exists: true,
          user: {
            id: matchedUser.id,
            username: matchedUser.username,
            email: matchedUser.email,
            name: matchedUser.name,
            mobile: matchedUser.mobile,
            role: matchedUser.role
          },
          message: 'User found'
        });
      }
    }

    if (users.length === 0) {
      return NextResponse.json({
        exists: false,
        message: 'User not found'
      });
    }

    const user = users[0];
    
    return NextResponse.json({
      exists: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
        mobile: user.mobile,
        role: user.role
      },
      message: 'User found'
    });

  } catch (error) {
    console.error('Check user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 