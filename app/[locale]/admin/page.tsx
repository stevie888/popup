"use client";

import { useAuth } from "@/components/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { 
  FaUsers, 
  FaUmbrella, 
  FaChartLine, 
  FaCog, 
  FaSignOutAlt, 
  FaUser, 
  FaCoins, 
  FaMapMarkerAlt, 
  FaBell, 
  FaSearch,
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaDownload,
  FaCalendarAlt,
  FaClock,
  FaCheckCircle,
  FaExclamationTriangle
} from "react-icons/fa";

interface DashboardStats {
  users: {
    totalUsers: number;
    adminUsers: number;
    regularUsers: number;
    newUsersThisMonth: number;
  };
  umbrellas: {
    totalUmbrellas: number;
    availableUmbrellas: number;
    outOfStockUmbrellas: number;
    rentedUmbrellas: number;
  };
  rentals: {
    totalRentals: number;
    activeRentals: number;
    completedRentals: number;
    cancelledRentals: number;
    revenueThisMonth: number;
  };
  stations: {
    totalStations: number;
    activeStations: number;
    offlineStations: number;
  };
}

interface RecentActivity {
  users: any[];
  umbrellas: any[];
  rentals: any[];
  notifications: any[];
}

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'umbrellas' | 'stations' | 'reports'>('overview');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

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
      // Mock data for demonstration
      const mockStats: DashboardStats = {
        users: {
          totalUsers: 1250,
          adminUsers: 5,
          regularUsers: 1245,
          newUsersThisMonth: 45
        },
        umbrellas: {
          totalUmbrellas: 500,
          availableUmbrellas: 320,
          outOfStockUmbrellas: 30,
          rentedUmbrellas: 150
        },
        rentals: {
          totalRentals: 2847,
          activeRentals: 150,
          completedRentals: 2647,
          cancelledRentals: 50,
          revenueThisMonth: 12500
        },
        stations: {
          totalStations: 25,
          activeStations: 23,
          offlineStations: 2
        }
      };

      const mockActivity: RecentActivity = {
        users: [
          { id: 1, name: 'John Doe', email: 'john@example.com', role: 'user', joinedAt: '2024-01-15' },
          { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'user', joinedAt: '2024-01-14' },
          { id: 3, name: 'Mike Johnson', email: 'mike@example.com', role: 'user', joinedAt: '2024-01-13' }
        ],
        rentals: [
          { id: 1, username: 'John Doe', description: 'Station 1 - Blue Umbrella', status: 'active', rentedAt: '2024-01-15 10:30' },
          { id: 2, username: 'Jane Smith', description: 'Station 3 - Red Umbrella', status: 'completed', rentedAt: '2024-01-14 15:45' },
          { id: 3, username: 'Mike Johnson', description: 'Station 2 - Green Umbrella', status: 'active', rentedAt: '2024-01-13 09:20' }
        ],
        umbrellas: [
          { id: 1, location: 'Station 1', status: 'available', lastUpdated: '2024-01-15 12:00' },
          { id: 2, location: 'Station 2', status: 'rented', lastUpdated: '2024-01-15 11:30' },
          { id: 3, location: 'Station 3', status: 'available', lastUpdated: '2024-01-15 10:15' }
        ],
        notifications: [
          { id: 1, type: 'warning', message: 'Station 5 is running low on umbrellas', time: '2 hours ago' },
          { id: 2, type: 'info', message: 'New user registration: Sarah Wilson', time: '4 hours ago' },
          { id: 3, type: 'success', message: 'Monthly revenue target achieved', time: '1 day ago' }
        ]
      };

      setStats(mockStats);
      setRecentActivity(mockActivity);
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

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-yellow-500 p-2 rounded-lg">
                <FaUmbrella className="text-white text-xl" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-600">Welcome back, {user.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {/* Search */}
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
                />
              </div>
              
              {/* Notifications */}
              <button className="relative p-2 text-gray-600 hover:text-gray-800">
                <FaBell size={20} />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  3
                </span>
              </button>

              {/* Profile */}
              <button
                onClick={() => router.push("/en/profile")}
                className="p-2 text-gray-600 hover:text-gray-800"
              >
                <FaUser size={20} />
              </button>

              {/* Logout */}
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
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-3 px-6 text-sm font-medium rounded-t-lg transition-colors ${
                activeTab === 'overview'
                  ? 'bg-yellow-500 text-white'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <FaChartLine className="inline mr-2" />
              Overview
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`py-3 px-6 text-sm font-medium rounded-t-lg transition-colors ${
                activeTab === 'users'
                  ? 'bg-yellow-500 text-white'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <FaUsers className="inline mr-2" />
              Users
            </button>
            <button
              onClick={() => setActiveTab('umbrellas')}
              className={`py-3 px-6 text-sm font-medium rounded-t-lg transition-colors ${
                activeTab === 'umbrellas'
                  ? 'bg-yellow-500 text-white'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <FaUmbrella className="inline mr-2" />
              Umbrellas
            </button>
            <button
              onClick={() => setActiveTab('stations')}
              className={`py-3 px-6 text-sm font-medium rounded-t-lg transition-colors ${
                activeTab === 'stations'
                  ? 'bg-yellow-500 text-white'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <FaMapMarkerAlt className="inline mr-2" />
              Stations
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`py-3 px-6 text-sm font-medium rounded-t-lg transition-colors ${
                activeTab === 'reports'
                  ? 'bg-yellow-500 text-white'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <FaCog className="inline mr-2" />
              Reports
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Users</p>
                    <p className="text-3xl font-bold text-gray-900">{stats?.users.totalUsers || 0}</p>
                    <p className="text-xs text-green-600 mt-1">
                      +{stats?.users.newUsersThisMonth || 0} this month
                    </p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <FaUsers className="text-blue-600 text-2xl" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Available Umbrellas</p>
                    <p className="text-3xl font-bold text-gray-900">{stats?.umbrellas.availableUmbrellas || 0}</p>
                    <p className="text-xs text-blue-600 mt-1">
                      {stats?.umbrellas.totalUmbrellas || 0} total
                    </p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-lg">
                    <FaUmbrella className="text-green-600 text-2xl" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Active Rentals</p>
                    <p className="text-3xl font-bold text-gray-900">{stats?.rentals.activeRentals || 0}</p>
                    <p className="text-xs text-yellow-600 mt-1">
                      ${stats?.rentals.revenueThisMonth || 0} this month
                    </p>
                  </div>
                  <div className="bg-yellow-100 p-3 rounded-lg">
                    <FaCoins className="text-yellow-600 text-2xl" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Active Stations</p>
                    <p className="text-3xl font-bold text-gray-900">{stats?.stations.activeStations || 0}</p>
                    <p className="text-xs text-gray-600 mt-1">
                      {stats?.stations.totalStations || 0} total
                    </p>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <FaMapMarkerAlt className="text-purple-600 text-2xl" />
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold mb-4">Recent Users</h3>
                <div className="space-y-3">
                  {recentActivity?.users.map((user: any) => (
                    <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        user.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {user.role}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold mb-4">Recent Rentals</h3>
                <div className="space-y-3">
                  {recentActivity?.rentals.map((rental: any) => (
                    <div key={rental.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{rental.username}</p>
                        <p className="text-sm text-gray-600">{rental.description}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
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
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">User Management</h2>
              <button className="flex items-center space-x-2 px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors">
                <FaPlus size={14} />
                <span>Add User</span>
              </button>
            </div>
            <p className="text-gray-600">User management features coming soon...</p>
          </div>
        )}

        {activeTab === 'umbrellas' && (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Umbrella Management</h2>
              <button className="flex items-center space-x-2 px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors">
                <FaPlus size={14} />
                <span>Add Umbrella</span>
              </button>
            </div>
            <p className="text-gray-600">Umbrella management features coming soon...</p>
          </div>
        )}

        {activeTab === 'stations' && (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Station Management</h2>
              <button className="flex items-center space-x-2 px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors">
                <FaPlus size={14} />
                <span>Add Station</span>
              </button>
            </div>
            <p className="text-gray-600">Station management features coming soon...</p>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Reports & Analytics</h2>
              <button className="flex items-center space-x-2 px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors">
                <FaDownload size={14} />
                <span>Export Report</span>
              </button>
            </div>
            <p className="text-gray-600">Reports and analytics features coming soon...</p>
          </div>
        )}
      </div>
    </div>
  );
} 