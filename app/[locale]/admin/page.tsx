"use client";

import { useAuth } from "@/components/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaUsers, FaUmbrella, FaChartLine, FaCog, FaSignOutAlt, FaGlobe, FaUser, FaCoins, FaMapMarkerAlt } from "react-icons/fa";

interface DashboardStats {
  users: {
    totalUsers: number;
    adminUsers: number;
    regularUsers: number;
  };
  umbrellas: {
    totalUmbrellas: number;
    availableUmbrellas: number;
    outOfStockUmbrellas: number;
  };
  rentals: {
    totalRentals: number;
    activeRentals: number;
    completedRentals: number;
    cancelledRentals: number;
  };
}

interface RecentActivity {
  users: any[];
  umbrellas: any[];
  rentals: any[];
}

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'ne'>('en');
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'umbrellas' | 'stations' | 'reports'>('overview');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push("/en/login");
      return;
    }

    if (user.role !== 'admin') {
      router.push("/en/dashboard");
      return;
    }

    fetchDashboardData();
  }, [user, router]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/dashboard');
      const data = await response.json();
      
      if (data.success) {
        setStats(data.stats);
        setRecentActivity(data.recent);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/en/login");
  };

  const handleLanguageChange = (language: 'en' | 'ne') => {
    setCurrentLanguage(language);
  };

  if (!user || user.role !== 'admin') {
    return <div>Access Denied</div>;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">
            {currentLanguage === 'en' ? 'Loading dashboard...' : 'ड्यासबोर्ड लोड हुँदै...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold">
                {currentLanguage === 'en' ? 'Admin Dashboard' : 'एडमिन ड्यासबोर्ड'}
              </h1>
              <p className="text-sm text-gray-600">
                {currentLanguage === 'en' ? 'Welcome, ' : 'स्वागत छ, '}{user.name}
              </p>
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
                onClick={() => router.push("/profile")}
                className="p-2 text-gray-600 hover:text-gray-800"
              >
                <FaUser size={20} />
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

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex space-x-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-3 px-4 text-sm font-medium rounded-t-lg transition-colors ${
                activeTab === 'overview'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <FaChartLine className="inline mr-2" />
              {currentLanguage === 'en' ? 'Overview' : 'अवलोकन'}
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`py-3 px-4 text-sm font-medium rounded-t-lg transition-colors ${
                activeTab === 'users'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <FaUsers className="inline mr-2" />
              {currentLanguage === 'en' ? 'Users' : 'प्रयोगकर्ताहरू'}
            </button>
            <button
              onClick={() => setActiveTab('umbrellas')}
              className={`py-3 px-4 text-sm font-medium rounded-t-lg transition-colors ${
                activeTab === 'umbrellas'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <FaUmbrella className="inline mr-2" />
              {currentLanguage === 'en' ? 'Umbrellas' : 'छाताहरू'}
            </button>
            <button
              onClick={() => setActiveTab('stations')}
              className={`py-3 px-4 text-sm font-medium rounded-t-lg transition-colors ${
                activeTab === 'stations'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <FaMapMarkerAlt className="inline mr-2" />
              {currentLanguage === 'en' ? 'Stations' : 'स्टेशनहरू'}
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`py-3 px-4 text-sm font-medium rounded-t-lg transition-colors ${
                activeTab === 'reports'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <FaCog className="inline mr-2" />
              {currentLanguage === 'en' ? 'Reports' : 'रिपोर्टहरू'}
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto p-4">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <FaUsers className="text-blue-500 text-2xl mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">
                      {currentLanguage === 'en' ? 'Total Users' : 'कुल प्रयोगकर्ता'}
                    </p>
                    <p className="text-2xl font-bold">{stats?.users.totalUsers || 0}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <FaUmbrella className="text-green-500 text-2xl mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">
                      {currentLanguage === 'en' ? 'Available Umbrellas' : 'उपलब्ध छाताहरू'}
                    </p>
                    <p className="text-2xl font-bold">{stats?.umbrellas.availableUmbrellas || 0}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <FaCoins className="text-yellow-500 text-2xl mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">
                      {currentLanguage === 'en' ? 'Active Rentals' : 'सक्रिय भाडा'}
                    </p>
                    <p className="text-2xl font-bold">{stats?.rentals.activeRentals || 0}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">
                  {currentLanguage === 'en' ? 'Recent Users' : 'हालका प्रयोगकर्ताहरू'}
                </h3>
                <div className="space-y-2">
                  {recentActivity?.users.map((user: any) => (
                    <div key={user.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded ${
                        user.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {user.role}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">
                  {currentLanguage === 'en' ? 'Recent Rentals' : 'हालका भाडाहरू'}
                </h3>
                <div className="space-y-2">
                  {recentActivity?.rentals.map((rental: any) => (
                    <div key={rental.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div>
                        <p className="font-medium">{rental.username}</p>
                        <p className="text-sm text-gray-600">{rental.description}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded ${
                        rental.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {rental.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">
              {currentLanguage === 'en' ? 'User Management' : 'प्रयोगकर्ता व्यवस्थापन'}
            </h2>
            <p className="text-gray-600">
              {currentLanguage === 'en' ? 'User management features coming soon...' : 'प्रयोगकर्ता व्यवस्थापन सुविधाहरू जल्दै आउँछन्...'}
            </p>
          </div>
        )}

        {activeTab === 'umbrellas' && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">
              {currentLanguage === 'en' ? 'Umbrella Management' : 'छाता व्यवस्थापन'}
            </h2>
            <p className="text-gray-600">
              {currentLanguage === 'en' ? 'Umbrella management features coming soon...' : 'छाता व्यवस्थापन सुविधाहरू जल्दै आउँछन्...'}
            </p>
          </div>
        )}

        {activeTab === 'stations' && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">
              {currentLanguage === 'en' ? 'Station Management' : 'स्टेशन व्यवस्थापन'}
            </h2>
            <p className="text-gray-600">
              {currentLanguage === 'en' ? 'Station management features coming soon...' : 'स्टेशन व्यवस्थापन सुविधाहरू जल्दै आउँछन्...'}
            </p>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">
              {currentLanguage === 'en' ? 'Reports & Analytics' : 'रिपोर्ट र विश्लेषण'}
            </h2>
            <p className="text-gray-600">
              {currentLanguage === 'en' ? 'Reports and analytics features coming soon...' : 'रिपोर्ट र विश्लेषण सुविधाहरू जल्दै आउँछन्...'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 