"use client";

import { useAuth } from "@/components/AuthContext";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { FaHistory, FaUmbrella, FaCalendar, FaClock, FaMapMarkerAlt, FaGlobe, FaSignOutAlt, FaArrowLeft, FaCheckCircle, FaTimesCircle, FaSpinner, FaCoins, FaUser } from "react-icons/fa";

interface RentalHistory {
  id: string;
  umbrellaId: string;
  umbrellaDescription: string;
  station: string;
  startTime: string;
  endTime?: string;
  duration: string;
  cost: number;
  status: 'active' | 'completed' | 'cancelled';
}

export default function HistoryPage() {
  const { user, logout, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'ne'>('en');
  const [rentalHistory, setRentalHistory] = useState<RentalHistory[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'completed' | 'cancelled'>('all');

  console.log('📜 HistoryPage: Rendering with user:', user ? user.name : 'null');
  console.log('📜 HistoryPage: Loading:', loading, 'Authenticated:', isAuthenticated);

  useEffect(() => {
    console.log('📜 HistoryPage: useEffect triggered');
    console.log('📜 HistoryPage: Loading:', loading, 'Authenticated:', isAuthenticated, 'User:', user ? user.name : 'null');
    
    if (!loading && !isAuthenticated) {
      console.log('📜 HistoryPage: Not authenticated, redirecting to login');
      router.push("/en/login");
      return;
    } else if (!loading && isAuthenticated && user) {
      console.log('📜 HistoryPage: User authenticated:', user.name);
    }

    // Load history only if authenticated
    if (isAuthenticated && user) {
      // Mock rental history data - in real app, this would come from API
      const mockHistory: RentalHistory[] = [
        {
          id: '1',
          umbrellaId: 'UMB001',
          umbrellaDescription: 'Blue Umbrella - Large',
          station: 'Central Station',
          startTime: '2024-01-15T10:30:00Z',
          endTime: '2024-01-15T14:30:00Z',
          duration: '4 hours',
          cost: 20,
          status: 'completed'
        },
        {
          id: '2',
          umbrellaId: 'UMB002',
          umbrellaDescription: 'Red Umbrella - Medium',
          station: 'University Station',
          startTime: '2024-01-16T09:00:00Z',
          endTime: '2024-01-16T11:00:00Z',
          duration: '2 hours',
          cost: 10,
          status: 'completed'
        },
        {
          id: '3',
          umbrellaId: 'UMB003',
          umbrellaDescription: 'Green Umbrella - Small',
          station: 'Mall Station',
          startTime: '2024-01-17T15:00:00Z',
          duration: '1 hour',
          cost: 5,
          status: 'active'
        }
      ];

      setRentalHistory(mockHistory);
      setLoadingHistory(false);
    }
  }, [loading, isAuthenticated, user, router]);

  const handleLogout = () => {
    logout();
    router.push("/en/login");
  };

  const handleLanguageChange = (language: 'en' | 'ne') => {
    setCurrentLanguage(language);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <FaSpinner className="text-blue-500" size={16} />;
      case 'completed':
        return <FaCheckCircle className="text-green-500" size={16} />;
      case 'cancelled':
        return <FaTimesCircle className="text-red-500" size={16} />;
      default:
        return <FaUmbrella className="text-gray-500" size={16} />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return currentLanguage === 'en' ? 'Active' : 'सक्रिय';
      case 'completed':
        return currentLanguage === 'en' ? 'Completed' : 'पूरा';
      case 'cancelled':
        return currentLanguage === 'en' ? 'Cancelled' : 'रद्द';
      default:
        return status;
    }
  };

  const filteredHistory = rentalHistory.filter(rental => {
    if (activeFilter === 'all') return true;
    return rental.status === activeFilter;
  });

  if (!user) {
    return <div>Loading...</div>;
  }

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-semibold">Loading...</div>
        </div>
      </div>
    );
  }

  // Show loading if not authenticated
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-semibold">Redirecting to login...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push("/en/dashboard")}
                className="p-2 text-gray-600 hover:text-gray-800"
              >
                <FaArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-xl font-semibold">
                  {currentLanguage === 'en' ? 'Rental History' : 'भाडा इतिहास'}
                </h1>
                <p className="text-sm text-gray-600">
                  {currentLanguage === 'en' ? 'View your past and current rentals' : 'आफ्ना पुराना र हालका भाडाहरू हेर्नुहोस्'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {/* Language Switcher */}
              <button
                onClick={() => handleLanguageChange(currentLanguage === 'en' ? 'ne' : 'en')}
                className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                title={currentLanguage === 'en' ? 'Switch to Nepali' : 'Switch to English'}
              >
                <FaGlobe size={18} />
                <span className="ml-1 text-xs">
                  {currentLanguage === 'en' ? 'EN' : 'ने'}
                </span>
              </button>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-600 hover:text-red-600"
              >
                <FaSignOutAlt size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-4">
        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold mb-4">
              <FaHistory className="inline mr-2" />
              {currentLanguage === 'en' ? 'Filter Rentals' : 'भाडाहरू फिल्टर गर्नुहोस्'}
            </h2>
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeFilter === 'all'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {currentLanguage === 'en' ? 'All' : 'सबै'}
              </button>
              <button
                onClick={() => setActiveFilter('active')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeFilter === 'active'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {currentLanguage === 'en' ? 'Active' : 'सक्रिय'}
              </button>
              <button
                onClick={() => setActiveFilter('completed')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeFilter === 'completed'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {currentLanguage === 'en' ? 'Completed' : 'पूरा'}
              </button>
              <button
                onClick={() => setActiveFilter('cancelled')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeFilter === 'cancelled'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {currentLanguage === 'en' ? 'Cancelled' : 'रद्द'}
              </button>
            </div>
          </div>
        </div>

        {/* Rental History List */}
        <div className="bg-white rounded-lg shadow">
          {loadingHistory ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">
                {currentLanguage === 'en' ? 'Loading rental history...' : 'भाडा इतिहास लोड हुँदै...'}
              </p>
            </div>
          ) : filteredHistory.length === 0 ? (
            <div className="p-8 text-center">
              <FaHistory className="text-gray-400 text-4xl mx-auto mb-4" />
              <p className="text-gray-600">
                {currentLanguage === 'en' ? 'No rentals found' : 'कुनै भाडा फेला परेनन्'}
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {filteredHistory.map((rental) => (
                <div key={rental.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        {getStatusIcon(rental.status)}
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {rental.umbrellaDescription}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {rental.umbrellaId}
                          </p>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded ${
                          rental.status === 'active' ? 'bg-blue-100 text-blue-800' :
                          rental.status === 'completed' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {getStatusText(rental.status)}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <FaMapMarkerAlt className="text-gray-400" size={14} />
                          <span className="text-gray-600">
                            {currentLanguage === 'en' ? 'Station: ' : 'स्टेशन: '}{rental.station}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <FaClock className="text-gray-400" size={14} />
                          <span className="text-gray-600">
                            {currentLanguage === 'en' ? 'Duration: ' : 'अवधि: '}{rental.duration}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <FaCalendar className="text-gray-400" size={14} />
                          <span className="text-gray-600">
                            {currentLanguage === 'en' ? 'Start: ' : 'सुरु: '}{new Date(rental.startTime).toLocaleString()}
                          </span>
                        </div>
                        {rental.endTime && (
                          <div className="flex items-center space-x-2">
                            <FaCalendar className="text-gray-400" size={14} />
                            <span className="text-gray-600">
                              {currentLanguage === 'en' ? 'End: ' : 'समाप्त: '}{new Date(rental.endTime).toLocaleString()}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="text-right ml-4">
                      <p className="text-2xl font-bold text-blue-600">
                        {rental.cost} {currentLanguage === 'en' ? 'credits' : 'क्रेडिट'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {currentLanguage === 'en' ? 'Total Cost' : 'कुल लागत'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-6 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">
            {currentLanguage === 'en' ? 'Quick Actions' : 'छिटो कार्यहरू'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => router.push("/en/dashboard")}
              className="flex items-center justify-center space-x-2 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FaUmbrella className="text-blue-500" size={20} />
              <span className="font-medium">
                {currentLanguage === 'en' ? 'Rent Umbrella' : 'छाता भाडा लिनुहोस्'}
              </span>
            </button>
            <button
              onClick={() => router.push("/en/wallet")}
              className="flex items-center justify-center space-x-2 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FaCoins className="text-yellow-500" size={20} />
              <span className="font-medium">
                {currentLanguage === 'en' ? 'View Wallet' : 'बटुवा हेर्नुहोस्'}
              </span>
            </button>
            <button
              onClick={() => router.push("/en/profile")}
              className="flex items-center justify-center space-x-2 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FaUser className="text-green-500" size={20} />
              <span className="font-medium">
                {currentLanguage === 'en' ? 'View Profile' : 'प्रोफाइल हेर्नुहोस्'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 