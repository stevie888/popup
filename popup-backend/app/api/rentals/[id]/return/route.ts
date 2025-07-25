import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/database';

// POST - Return umbrella
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const rentalId = params.id;
    const body = await request.json();
    const { endTime, stationId } = body;

    if (!rentalId || !endTime) {
      return NextResponse.json({
        success: false,
        error: 'Rental ID and end time are required'
      }, { status: 400 });
    }

    // Get rental details
    const rentals = await executeQuery(
      'SELECT * FROM rental_history WHERE id = ? AND status = "active"',
      [rentalId]
    ) as any[];

    if (rentals.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Active rental not found'
      }, { status: 404 });
    }

    const rental = rentals[0];

    // Start transaction
    await executeQuery('START TRANSACTION');

    try {
      // Update rental status
      await executeQuery(`
        UPDATE rental_history 
        SET returned_at = ?, status = 'completed'
        WHERE id = ?
      `, [endTime, rentalId]);

      // Update umbrella status
      await executeQuery(
        'UPDATE umbrellas SET status = ? WHERE id = ?',
        ['available', rental.umbrella_id]
      );

      // Update station available umbrellas
      await executeQuery(
        'UPDATE stations SET available_umbrellas = available_umbrellas + 1 WHERE id = ?',
        [stationId || rental.station_id]
      );

      await executeQuery('COMMIT');

      return NextResponse.json({
        success: true,
        message: 'Umbrella returned successfully'
      });

    } catch (error) {
      await executeQuery('ROLLBACK');
      throw error;
    }

  } catch (error) {
    console.error('Error returning umbrella:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to return umbrella'
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