import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, email, password, name, mobile } = body;

    // Validate input
    if (!username || !email || !password || !name || !mobile) {
      return NextResponse.json(
        { error: 'All fields are required' },
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

    // Validate username format
    if (username.length < 3) {
      return NextResponse.json(
        { error: 'Username must be at least 3 characters long' },
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

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return NextResponse.json(
        { error: 'Username can only contain letters, numbers, and underscores' },
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

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
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

    // Validate mobile number format
    const cleanMobile = mobile.replace(/\D/g, '');
    if (cleanMobile.length !== 10 || !/^9[0-9]{9}$/.test(cleanMobile)) {
      return NextResponse.json(
        { error: 'Please enter a valid 10-digit mobile number starting with 9' },
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

    // Check if username, email, or mobile already exists
    const existingUsers = await executeQuery(
      'SELECT id FROM users WHERE username = ? OR email = ? OR mobile = ?',
      [username, email, mobile]
    ) as any[];

    if (existingUsers.length > 0) {
      return NextResponse.json(
        { error: 'Username, email, or mobile number already exists' },
        { 
          status: 409,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          },
        }
      );
    }

    // Create user
    const userId = Date.now().toString();
    await executeQuery(
      'INSERT INTO users (id, username, email, password, name, mobile, role, credits) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [userId, username, email, password, name, mobile, 'user', 200]
    );

    // Get the created user
    const newUsers = await executeQuery(
      'SELECT id, username, email, name, mobile, role, credits, createdAt FROM users WHERE id = ?',
      [userId]
    ) as any[];

    const newUser = newUsers[0];
    
    return NextResponse.json({
      success: true,
      user: newUser,
      message: 'User registered successfully'
    }, { 
      status: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });

  } catch (error) {
    console.error('Signup error:', error);
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