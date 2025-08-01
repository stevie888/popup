"use client";
import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { FaMapMarkerAlt, FaUmbrella, FaClock, FaCheck, FaTimes } from 'react-icons/fa';

interface Station {
  id: string;
  name: string;
  location: string;
  latitude: number;
  longitude: number;
  availableUmbrellas: number;
  totalUmbrellas: number;
  status: 'available' | 'out_of_stock' | 'maintenance';
  distance?: number;
}

export default function StationMap() {
  const [stations, setStations] = useState<Station[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);

  useEffect(() => {
    getUserLocation();
    fetchStations();
  }, []);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          setError('Unable to get your location. Please enable location services.');
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
    }
  };

  const fetchStations = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch('http://localhost:3001/api/stations');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        let stationsWithDistance = data.stations;
        
        // Calculate distances if user location is available
        if (userLocation) {
          stationsWithDistance = data.stations.map((station: Station) => ({
            ...station,
            distance: calculateDistance(
              userLocation.lat,
              userLocation.lng,
              station.latitude,
              station.longitude
            )
          }));
          
          // Sort by distance
          stationsWithDistance.sort((a: Station, b: Station) => 
            (a.distance || 0) - (b.distance || 0)
          );
        }
        
        setStations(stationsWithDistance);
      } else {
        setError(data.error || 'Failed to load stations');
      }
    } catch (error) {
      console.error('Error fetching stations:', error);
      setError('Failed to load stations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distance in kilometers
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'text-green-600';
      case 'out_of_stock': return 'text-red-600';
      case 'maintenance': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available': return <FaCheck className="text-green-500" />;
      case 'out_of_stock': return <FaTimes className="text-red-500" />;
      case 'maintenance': return <FaClock className="text-yellow-500" />;
      default: return <FaTimes className="text-gray-500" />;
    }
  };

  const formatDistance = (distance?: number) => {
    if (!distance) return 'Unknown';
    if (distance < 1) return `${Math.round(distance * 1000)}m`;
    return `${distance.toFixed(1)}km`;
  };

  return (
    <div className="max-w-md mx-auto p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Nearby Stations</h2>
        <Button
          onClick={fetchStations}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 text-white"
        >
          <FaMapMarkerAlt className="mr-2" />
          Refresh
        </Button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading stations...</p>
        </div>
      )}

      {/* Stations List */}
      {!loading && stations.length > 0 && (
        <div className="space-y-3">
          {stations.map((station) => (
            <div
              key={station.id}
              className={`bg-white border rounded-lg p-4 cursor-pointer transition-colors ${
                selectedStation?.id === station.id ? 'border-yellow-400 bg-yellow-50' : 'hover:bg-gray-50'
              }`}
              onClick={() => setSelectedStation(station)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-1">
                    <FaMapMarkerAlt className="text-red-500 mr-2" />
                    <h3 className="font-semibold">{station.name}</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{station.location}</p>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <FaUmbrella className="text-blue-500 mr-1" />
                      <span>{station.availableUmbrellas}/{station.totalUmbrellas} available</span>
                    </div>
                    <div className="flex items-center">
                      {getStatusIcon(station.status)}
                      <span className={`ml-1 ${getStatusColor(station.status)}`}>
                        {station.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                  
                  {station.distance && (
                    <div className="text-xs text-gray-500 mt-1">
                      {formatDistance(station.distance)} away
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No Stations */}
      {!loading && stations.length === 0 && (
        <div className="text-center py-8">
          <FaMapMarkerAlt className="text-gray-400 mx-auto mb-4" size={48} />
          <p className="text-gray-600">No stations found nearby</p>
        </div>
      )}

      {/* Selected Station Details */}
      {selectedStation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">{selectedStation.name}</h3>
              <button
                onClick={() => setSelectedStation(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes size={20} />
              </button>
            </div>
            
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Location</p>
                <p className="font-medium">{selectedStation.location}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <div className="flex items-center">
                  {getStatusIcon(selectedStation.status)}
                  <span className={`ml-2 ${getStatusColor(selectedStation.status)}`}>
                    {selectedStation.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-600">Available Umbrellas</p>
                <p className="font-medium">
                  {selectedStation.availableUmbrellas} of {selectedStation.totalUmbrellas}
                </p>
              </div>
              
              {selectedStation.distance && (
                <div>
                  <p className="text-sm text-gray-600">Distance</p>
                  <p className="font-medium">{formatDistance(selectedStation.distance)}</p>
                </div>
              )}
            </div>
            
            <div className="mt-6 flex gap-2">
              <Button
                onClick={() => setSelectedStation(null)}
                className="flex-1 bg-gray-500 hover:bg-gray-600"
              >
                Close
              </Button>
              <Button
                onClick={() => {
                  // TODO: Navigate to station or open directions
                  setSelectedStation(null);
                }}
                className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black"
              >
                Get Directions
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 