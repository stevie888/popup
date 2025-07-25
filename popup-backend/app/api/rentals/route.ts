import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/database';

// GET - Get rentals for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const status = searchParams.get('status');

    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'User ID is required'
      }, { status: 400 });
    }

    let query = `
      SELECT 
        rh.id,
        rh.user_id,
        rh.umbrella_id,
        rh.station_id,
        rh.rented_at,
        rh.returned_at,
        rh.status,
        rh.credits_used,
        u.name as user_name,
        s.name as station_name
      FROM rental_history rh
      LEFT JOIN users u ON rh.user_id = u.id
      LEFT JOIN stations s ON rh.station_id = s.id
      WHERE rh.user_id = ?
    `;
    const params = [userId];

    if (status) {
      query += ' AND rh.status = ?';
      params.push(status);
    }

    query += ' ORDER BY rh.rented_at DESC';

    const rentals = await executeQuery(query, params) as any[];

    return NextResponse.json({
      success: true,
      rentals: rentals.map(rental => ({
        id: rental.id,
        userId: rental.user_id,
        umbrellaId: rental.umbrella_id,
        stationId: rental.station_id,
        stationName: rental.station_name,
        startTime: rental.rented_at,
        endTime: rental.returned_at,
        status: rental.status,
        creditsUsed: rental.credits_used,
        userName: rental.user_name
      }))
    });
  } catch (error) {
    console.error('Error fetching rentals:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch rentals'
    }, { status: 500 });
  }
}

// POST - Create new rental
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, umbrellaId, stationId, startTime, creditsUsed } = body;

    if (!userId || !umbrellaId || !stationId || !startTime) {
      return NextResponse.json({
        success: false,
        error: 'All fields are required'
      }, { status: 400 });
    }

    // Check if user has enough credits
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

    const userCredits = users[0].credits || 0;
    const requiredCredits = creditsUsed || 50;

    if (userCredits < requiredCredits) {
      return NextResponse.json({
        success: false,
        error: `Insufficient credits. You have ${userCredits} credits, but need ${requiredCredits} credits.`
      }, { status: 400 });
    }

    // Check if umbrella is available
    const umbrellas = await executeQuery(
      'SELECT status FROM umbrellas WHERE id = ?',
      [umbrellaId]
    ) as any[];

    if (umbrellas.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Umbrella not found'
      }, { status: 404 });
    }

    if (umbrellas[0].status !== 'available') {
      return NextResponse.json({
        success: false,
        error: 'Umbrella is not available'
      }, { status: 400 });
    }

    // Start transaction
    await executeQuery('START TRANSACTION');

    try {
      // Create rental record
      const rentalResult = await executeQuery(`
        INSERT INTO rental_history (user_id, umbrella_id, station_id, rented_at, status, credits_used)
        VALUES (?, ?, ?, ?, 'active', ?)
      `, [userId, umbrellaId, stationId, startTime, requiredCredits]) as any;

      // Update umbrella status
      await executeQuery(
        'UPDATE umbrellas SET status = ? WHERE id = ?',
        ['rented', umbrellaId]
      );

      // Deduct credits from user
      await executeQuery(
        'UPDATE users SET credits = credits - ?, total_rentals = total_rentals + 1 WHERE id = ?',
        [requiredCredits, userId]
      );

      // Update station available umbrellas
      await executeQuery(
        'UPDATE stations SET available_umbrellas = available_umbrellas - 1 WHERE id = ?',
        [stationId]
      );

      await executeQuery('COMMIT');

      // Get the created rental
      const newRentals = await executeQuery(
        'SELECT * FROM rental_history WHERE id = ?',
        [rentalResult.insertId]
      ) as any[];

      return NextResponse.json({
        success: true,
        rental: {
          id: newRentals[0].id,
          userId: newRentals[0].user_id,
          umbrellaId: newRentals[0].umbrella_id,
          stationId: newRentals[0].station_id,
          startTime: newRentals[0].rented_at,
          status: newRentals[0].status,
          creditsUsed: newRentals[0].credits_used
        },
        message: 'Umbrella rented successfully'
      }, { status: 201 });

    } catch (error) {
      await executeQuery('ROLLBACK');
      throw error;
    }

  } catch (error) {
    console.error('Error creating rental:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create rental'
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