"use client";

import { useAuth } from "@/components/AuthContext";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaEdit, 
  FaSave, 
  FaArrowLeft, 
  FaSignOutAlt,
  FaUmbrella,
  FaCoins,
  FaCalendarAlt,
  FaShieldAlt,
  FaCog,
  FaBell,
  FaCreditCard,
  FaHistory,
  FaMapMarkerAlt
} from "react-icons/fa";

export default function ProfilePage() {
  const { user, logout, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    mobile: ''
  });

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/en/login");
      return;
    } else if (!loading && isAuthenticated && user) {
      setEditForm({
        name: user.name || '',
        email: user.email || '',
        mobile: user.mobile || ''
      });
    }
  }, [loading, isAuthenticated, user, router]);

  const handleLogout = () => {
    logout();
    router.push("/en/login");
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    console.log('Saving profile:', editForm);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditForm({
      name: user?.name || '',
      email: user?.email || '',
      mobile: user?.mobile || ''
    });
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

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
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push("/en/dashboard")}
                className="p-2 text-gray-600 hover:text-gray-800 rounded-md hover:bg-gray-100"
              >
                <FaArrowLeft size={20} />
              </button>
              <div className="flex items-center space-x-3">
                <div className="bg-yellow-500 p-2 rounded-lg">
                  <FaUmbrella className="text-white text-xl" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
                  <p className="text-sm text-gray-600">Manage your account information</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {/* Settings */}
              <button className="p-2 text-gray-600 hover:text-gray-800 rounded-md hover:bg-gray-100">
                <FaCog size={20} />
              </button>
              
              {/* Notifications */}
              <button className="p-2 text-gray-600 hover:text-gray-800 rounded-md hover:bg-gray-100">
                <FaBell size={20} />
              </button>
              
              {/* Logout */}
              <button
                onClick={handleLogout}
                className="p-2 text-gray-600 hover:text-red-600 rounded-md hover:bg-gray-100"
              >
                <FaSignOutAlt size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center">
                      <FaUser className="text-white text-2xl" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">{user.name}</h2>
                      <p className="text-gray-600">{user.email}</p>
                    </div>
                  </div>
                  {!isEditing && (
                    <button
                      onClick={handleEdit}
                      className="flex items-center space-x-2 px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors"
                    >
                      <FaEdit size={16} />
                      <span>Edit Profile</span>
                    </button>
                  )}
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-6">
                  {/* Name */}
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FaUser className="text-blue-600" size={18} />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editForm.name}
                          onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
                        />
                      ) : (
                        <p className="text-gray-900 text-lg">{user.name}</p>
                      )}
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <FaEnvelope className="text-green-600" size={18} />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      {isEditing ? (
                        <input
                          type="email"
                          value={editForm.email}
                          onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
                        />
                      ) : (
                        <p className="text-gray-900 text-lg">{user.email}</p>
                      )}
                    </div>
                  </div>

                  {/* Mobile */}
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <FaPhone className="text-purple-600" size={18} />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      {isEditing ? (
                        <input
                          type="tel"
                          value={editForm.mobile}
                          onChange={(e) => setEditForm({...editForm, mobile: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
                        />
                      ) : (
                        <p className="text-gray-900 text-lg">{user.mobile}</p>
                      )}
                    </div>
                  </div>

                  {/* Role */}
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                      <FaShieldAlt className="text-orange-600" size={18} />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Account Type
                      </label>
                      <p className="text-gray-900 text-lg capitalize">{user.role}</p>
                    </div>
                  </div>

                  {/* Credits */}
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <FaCoins className="text-yellow-600" size={18} />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Available Credits
                      </label>
                      <p className="text-gray-900 text-lg font-semibold">{user.credits || 0} credits</p>
                    </div>
                  </div>

                  {/* Edit Actions */}
                  {isEditing && (
                    <div className="flex space-x-3 pt-6 border-t border-gray-100">
                      <button
                        onClick={handleSave}
                        className="flex items-center space-x-2 px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                      >
                        <FaSave size={16} />
                        <span>Save Changes</span>
                      </button>
                      <button
                        onClick={handleCancel}
                        className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FaUmbrella className="text-blue-500" />
                    <span className="text-sm text-gray-600">Total Rentals</span>
                  </div>
                  <span className="font-semibold">{user.total_rentals || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FaCalendarAlt className="text-green-500" />
                    <span className="text-sm text-gray-600">Member Since</span>
                  </div>
                  <span className="font-semibold">Jan 2024</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FaMapMarkerAlt className="text-purple-500" />
                    <span className="text-sm text-gray-600">Favorite Station</span>
                  </div>
                  <span className="font-semibold">Station 1</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => router.push("/en/wallet")}
                  className="w-full flex items-center space-x-3 p-3 text-left rounded-md hover:bg-gray-50 transition-colors"
                >
                  <FaCreditCard className="text-blue-500" />
                  <span className="text-sm font-medium">View Wallet</span>
                </button>
                <button
                  onClick={() => router.push("/en/history")}
                  className="w-full flex items-center space-x-3 p-3 text-left rounded-md hover:bg-gray-50 transition-colors"
                >
                  <FaHistory className="text-green-500" />
                  <span className="text-sm font-medium">Rental History</span>
                </button>
                <button
                  onClick={() => router.push("/en/scan")}
                  className="w-full flex items-center space-x-3 p-3 text-left rounded-md hover:bg-gray-50 transition-colors"
                >
                  <FaUmbrella className="text-yellow-500" />
                  <span className="text-sm font-medium">Rent Umbrella</span>
                </button>
              </div>
            </div>

            {/* Account Security */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold mb-4">Account Security</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center space-x-3 p-3 text-left rounded-md hover:bg-gray-50 transition-colors">
                  <FaShieldAlt className="text-orange-500" />
                  <span className="text-sm font-medium">Change Password</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 text-left rounded-md hover:bg-gray-50 transition-colors">
                  <FaBell className="text-purple-500" />
                  <span className="text-sm font-medium">Notification Settings</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 