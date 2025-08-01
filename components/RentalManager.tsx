"use client";
import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { Button } from './ui/button';
import QRScanner from './QRScanner';
import { FaQrcode, FaUmbrella, FaClock, FaMapMarkerAlt, FaCheck, FaTimes } from 'react-icons/fa';

interface Rental {
  id: string;
  umbrellaId: string;
  stationId: string;
  startTime: string;
  endTime?: string;
  status: 'active' | 'completed' | 'cancelled';
  creditsUsed: number;
  totalAmount?: number;
}

export default function RentalManager() {
  const { user } = useAuth();
  const [showScanner, setShowScanner] = useState(false);
  const [activeRental, setActiveRental] = useState<Rental | null>(null);
  const [rentalHistory, setRentalHistory] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user && user.id) {
      fetchActiveRental();
      fetchRentalHistory();
    }
  }, [user]);

  const fetchActiveRental = async () => {
    if (!user?.id) return;
    
    try {
      const response = await fetch(`http://localhost:3001/api/rentals?userId=${user.id}&status=active`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.success && data.rentals.length > 0) {
        setActiveRental(data.rentals[0]);
      }
    } catch (error) {
      console.error('Error fetching active rental:', error);
    }
  };

  const fetchRentalHistory = async () => {
    if (!user?.id) return;
    
    try {
      const response = await fetch(`http://localhost:3001/api/rentals?userId=${user.id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.success) {
        setRentalHistory(data.rentals);
      }
    } catch (error) {
      console.error('Error fetching rental history:', error);
    }
  };

  const handleQRScan = async (qrData: string) => {
    if (!user?.id) {
      setError('Please log in to rent umbrellas');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const parsedData = JSON.parse(qrData);
      
      if (parsedData.type === 'umbrella_rental') {
        if (activeRental) {
          // Return umbrella
          await returnUmbrella(parsedData.stationId);
        } else {
          // Rent umbrella
          await rentUmbrella(parsedData.stationId, parsedData.umbrellaId);
        }
      } else {
        setError('Invalid QR code format');
      }
    } catch (error) {
      setError('Failed to process QR code');
    } finally {
      setLoading(false);
      setShowScanner(false);
    }
  };

  const rentUmbrella = async (stationId: string, umbrellaId: string) => {
    if (!user?.id) {
      setError('Please log in to rent umbrellas');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/api/rentals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          umbrellaId,
          stationId,
          startTime: new Date().toISOString(),
          creditsUsed: 50
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        setActiveRental(data.rental);
        fetchRentalHistory();
      } else {
        setError(data.error || 'Failed to rent umbrella');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    }
  };

  const returnUmbrella = async (stationId: string) => {
    if (!activeRental || !user?.id) return;

    try {
      const response = await fetch(`http://localhost:3001/api/rentals/${activeRental.id}/return`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          endTime: new Date().toISOString(),
          stationId
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        setActiveRental(null);
        fetchRentalHistory();
      } else {
        setError(data.error || 'Failed to return umbrella');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    }
  };

  const getRentalDuration = (startTime: string, endTime?: string) => {
    const start = new Date(startTime);
    const end = endTime ? new Date(endTime) : new Date();
    const diffMs = end.getTime() - start.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${diffHours}h ${diffMinutes}m`;
  };

  // Show login message if no user
  if (!user) {
    return (
      <div className="max-w-md mx-auto p-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-800 mb-2">Welcome to PopUp</h3>
          <p className="text-sm text-blue-600 mb-3">
            Please log in to rent umbrellas and view your rental history.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-4">
      {/* Active Rental */}
      {activeRental && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-yellow-800">Active Rental</h3>
            <FaUmbrella className="text-yellow-600" />
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex items-center">
              <FaClock className="mr-2 text-yellow-600" />
              <span>Duration: {getRentalDuration(activeRental.startTime)}</span>
            </div>
            <div className="flex items-center">
              <FaMapMarkerAlt className="mr-2 text-yellow-600" />
              <span>Station: {activeRental.stationId}</span>
            </div>
            <div className="flex items-center">
              <span className="text-yellow-600 font-medium">
                Credits used: {activeRental.creditsUsed}
              </span>
            </div>
          </div>
          <Button
            onClick={() => setShowScanner(true)}
            className="w-full mt-3 bg-yellow-500 hover:bg-yellow-600 text-white"
          >
            <FaQrcode className="mr-2" />
            Return Umbrella
          </Button>
        </div>
      )}

      {/* Rent New Umbrella */}
      {!activeRental && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
          <h3 className="font-semibold text-green-800 mb-2">Rent Umbrella</h3>
          <p className="text-sm text-green-600 mb-3">
            Scan QR code at any umbrella station to rent
          </p>
          <Button
            onClick={() => setShowScanner(true)}
            className="w-full bg-green-500 hover:bg-green-600 text-white"
            disabled={loading}
          >
            <FaQrcode className="mr-2" />
            {loading ? 'Processing...' : 'Scan QR Code'}
          </Button>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Rental History */}
      {rentalHistory.length > 0 && (
        <div className="bg-white border rounded-lg p-4">
          <h3 className="font-semibold mb-3">Recent Rentals</h3>
          <div className="space-y-3">
            {rentalHistory.slice(0, 5).map((rental) => (
              <div key={rental.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div>
                  <div className="font-medium">Station {rental.stationId}</div>
                  <div className="text-sm text-gray-600">
                    {getRentalDuration(rental.startTime, rental.endTime)}
                  </div>
                </div>
                <div className="flex items-center">
                  {rental.status === 'completed' ? (
                    <FaCheck className="text-green-500" />
                  ) : (
                    <FaTimes className="text-red-500" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* QR Scanner */}
      <QRScanner
        isOpen={showScanner}
        onClose={() => setShowScanner(false)}
        onScan={handleQRScan}
      />
    </div>
  );
} 