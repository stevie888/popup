import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  return NextResponse.json({
    success: true,
    message: 'Hello from backend!',
    timestamp: new Date().toISOString()
  });
} 