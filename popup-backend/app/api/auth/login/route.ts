import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/database';

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    // Validate input
    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { 
          status: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          },
        }
      );
    }

    // Clean the username (remove spaces, dashes, etc.)
    const cleanUsername = username.replace(/[\s\-\(\)]/g, '');

    // Find user by username, email, or mobile
    let users = await executeQuery(
      'SELECT * FROM users WHERE username = ? OR email = ? OR mobile = ?',
      [cleanUsername, cleanUsername, cleanUsername]
    ) as any[];

    // If no exact match found, try with cleaned mobile number
    if (users.length === 0) {
      // Try to find by cleaned mobile number (removing dashes from database values)
      const allUsers = await executeQuery(
        'SELECT * FROM users',
        []
      ) as any[];

      const matchedUser = allUsers.find(user => {
        const cleanUserMobile = user.mobile?.replace(/[\s\-\(\)]/g, '') || '';
        const cleanUserUsername = user.username?.replace(/[\s\-\(\)]/g, '') || '';
        const cleanUserEmail = user.email?.replace(/[\s\-\(\)]/g, '') || '';
        return cleanUserMobile === cleanUsername || 
               cleanUserUsername === cleanUsername || 
               cleanUserEmail === cleanUsername;
      });

      if (matchedUser) {
        users = [matchedUser];
      }
    }

    if (users.length === 0) {
      return NextResponse.json(
        { error: 'User not found. Please sign up first.' },
        { 
          status: 404,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          },
        }
      );
    }

    const user = users[0];

    // Check password (in a real app, you'd hash passwords)
    if (user.password !== password) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { 
          status: 401,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          },
        }
      );
    }

    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = user;
    
    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
      message: 'Login successful'
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      }
    );
  }
} 