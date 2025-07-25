import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/database';

// GET - Get all stations
export async function GET(request: NextRequest) {
  try {
    const stations = await executeQuery(`
      SELECT 
        id,
        name,
        location,
        latitude,
        longitude,
        status,
        total_umbrellas,
        available_umbrellas
      FROM stations
      ORDER BY name
    `) as any[];

    return NextResponse.json({
      success: true,
      stations: stations.map(station => ({
        id: station.id,
        name: station.name,
        location: station.location,
        latitude: parseFloat(station.latitude),
        longitude: parseFloat(station.longitude),
        status: station.status,
        totalUmbrellas: station.total_umbrellas,
        availableUmbrellas: station.available_umbrellas
      }))
    });
  } catch (error) {
    console.error('Error fetching stations:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch stations'
    }, { status: 500 });
  }
}

// POST - Create new station
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, location, latitude, longitude, totalUmbrellas } = body;

    if (!name || !location || !latitude || !longitude) {
      return NextResponse.json({
        success: false,
        error: 'All fields are required'
      }, { status: 400 });
    }

    const result = await executeQuery(`
      INSERT INTO stations (name, location, latitude, longitude, total_umbrellas, available_umbrellas, status)
      VALUES (?, ?, ?, ?, ?, ?, 'available')
    `, [name, location, latitude, longitude, totalUmbrellas, totalUmbrellas]);

    return NextResponse.json({
      success: true,
      message: 'Station created successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating station:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create station'
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