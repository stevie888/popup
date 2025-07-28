import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/database';

interface UmbrellaData {
  id: string;
  station_id: string;
  station_name: string;
  status: string;
  created_at: string;
}

// GET - Get all umbrellas with station information
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    let query = `
      SELECT 
        u.id,
        u.station_id,
        s.name as station_name,
        u.status,
        u.created_at
      FROM umbrellas u
      LEFT JOIN stations s ON u.station_id = s.id
    `;
    const params: any[] = [];

    // Build WHERE clause dynamically
    const conditions = [];
    if (status) {
      conditions.push('u.status = ?');
      params.push(status);
    }
    if (search) {
      conditions.push('(s.name LIKE ? OR s.location LIKE ?)');
      params.push(`%${search}%`, `%${search}%`);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY u.created_at DESC';

    const umbrellas = await executeQuery(query, params) as UmbrellaData[];

    // Get statistics
    const statsQuery = `
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN u.status = 'available' THEN 1 ELSE 0 END) as available,
        SUM(CASE WHEN u.status = 'rented' THEN 1 ELSE 0 END) as rented
      FROM umbrellas u
    `;
    const stats = await executeQuery(statsQuery) as any[];

    return NextResponse.json({
      success: true,
      umbrellas,
      count: umbrellas.length,
      stats: stats[0]
    });

  } catch (error) {
    console.error('Get umbrellas error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create new umbrella (admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { stationId, quantity = 1, status = 'available' } = body;

    // Validate input
    if (!stationId) {
      return NextResponse.json(
        { error: 'Station ID is required' },
        { status: 400 }
      );
    }

    if (status !== 'available' && status !== 'rented' && status !== 'maintenance' && status !== 'lost') {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    // Check if station exists
    const station = await executeQuery(
      'SELECT id, name, location FROM stations WHERE id = ?',
      [stationId]
    ) as any[];

    if (station.length === 0) {
      return NextResponse.json(
        { error: 'Station not found' },
        { status: 404 }
      );
    }

    const stationInfo = station[0];
    const createdUmbrellas = [];

    // Create multiple umbrellas based on quantity
    for (let i = 0; i < quantity; i++) {
      const umbrellaId = `umbrella_${Date.now()}_${i}`;
      
      await executeQuery(
        'INSERT INTO umbrellas (id, station_id, status) VALUES (?, ?, ?)',
        [umbrellaId, stationId, status]
      );

      createdUmbrellas.push({
        id: umbrellaId,
        station_id: stationId,
        station_name: stationInfo.name,
        status: status,
        created_at: new Date().toISOString()
      });
    }

    // Update station umbrella count
    await executeQuery(
      'UPDATE stations SET total_umbrellas = total_umbrellas + ?, available_umbrellas = available_umbrellas + ? WHERE id = ?',
      [quantity, status === 'available' ? quantity : 0, stationId]
    );

    return NextResponse.json({
      success: true,
      umbrellas: createdUmbrellas,
      message: `Successfully added ${quantity} umbrella(s) to ${stationInfo.name}`
    }, { status: 201 });

  } catch (error) {
    console.error('Create umbrella error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 