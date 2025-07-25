import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/database';

// GET - Generate QR code data for a station
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const stationId = searchParams.get('id');

    if (!stationId) {
      return NextResponse.json(
        { error: 'Station ID is required' },
        { status: 400 }
      );
    }

    // Get station data
    const stations = await executeQuery(
      'SELECT * FROM umbrellas WHERE id = ?',
      [stationId]
    ) as any[];

    if (stations.length === 0) {
      return NextResponse.json(
        { error: 'Station not found' },
        { status: 404 }
      );
    }

    const station = stations[0];

    // Create QR code data
    const qrData = {
      stationId: station.id,
      stationName: station.description,
      location: station.location,
      type: 'umbrella_station',
      timestamp: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      qrData: qrData,
      qrText: JSON.stringify(qrData)
    });

  } catch (error) {
    console.error('QR generation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Process scanned QR code
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { qrData } = body;

    if (!qrData) {
      return NextResponse.json(
        { error: 'QR data is required' },
        { status: 400 }
      );
    }

    let stationId;
    let stationData;

    // Parse QR data
    try {
      const parsed = JSON.parse(qrData);
      stationId = parsed.stationId || parsed.station;
    } catch {
      // If not JSON, try to extract station ID from text
      const stationMatch = qrData.match(/station[:\s]*(\d+)/i);
      if (stationMatch) {
        stationId = stationMatch[1];
      } else {
        return NextResponse.json(
          { error: 'Invalid QR code format' },
          { status: 400 }
        );
      }
    }

    // Get station data
    const stations = await executeQuery(
      'SELECT * FROM umbrellas WHERE id = ?',
      [stationId]
    ) as any[];

    if (stations.length === 0) {
      return NextResponse.json(
        { error: 'Station not found' },
        { status: 404 }
      );
    }

    stationData = stations[0];

    return NextResponse.json({
      success: true,
      station: stationData,
      message: 'QR code processed successfully'
    });

  } catch (error) {
    console.error('QR processing error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 