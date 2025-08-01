"use client";

import { useAuth } from "@/components/AuthContext";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { FaUser, FaEnvelope, FaPhone, FaEdit, FaSave, FaArrowLeft, FaGlobe, FaSignOutAlt } from "react-icons/fa";

export default function ProfilePage() {
  const { user, logout, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'ne'>('en');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    mobile: ''
  });

  console.log('👤 ProfilePage: Rendering with user:', user ? user.name : 'null');
  console.log('👤 ProfilePage: Loading:', loading, 'Authenticated:', isAuthenticated);

  useEffect(() => {
    console.log('👤 ProfilePage: useEffect triggered');
    console.log('👤 ProfilePage: Loading:', loading, 'Authenticated:', isAuthenticated, 'User:', user ? user.name : 'null');
    
    if (!loading && !isAuthenticated) {
      console.log('👤 ProfilePage: Not authenticated, redirecting to login');
      router.push("/en/login");
      return;
    } else if (!loading && isAuthenticated && user) {
      console.log('👤 ProfilePage: User authenticated:', user.name);
      // Initialize edit form with current user data
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

  const handleLanguageChange = (language: 'en' | 'ne') => {
    setCurrentLanguage(language);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    // Here you would typically call an API to update the profile
    console.log('Saving profile:', editForm);
    setIsEditing(false);
    // In a real app, you'd update the user context here
  };

  const handleCancel = () => {
    setEditForm({
      name: user?.name || '',
      email: user?.email || '',
      mobile: user?.mobile || ''
    });
    setIsEditing(false);
  };

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
                  {currentLanguage === 'en' ? 'Profile' : 'प्रोफाइल'}
                </h1>
                <p className="text-sm text-gray-600">
                  {currentLanguage === 'en' ? 'Manage your account information' : 'आफ्नो खाता जानकारी व्यवस्थापन गर्नुहोस्'}
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
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">
                <FaUser className="inline mr-2" />
                {currentLanguage === 'en' ? 'Personal Information' : 'व्यक्तिगत जानकारी'}
              </h2>
              {!isEditing && (
                <button
                  onClick={handleEdit}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                  <FaEdit size={16} />
                  <span>{currentLanguage === 'en' ? 'Edit' : 'सम्पादन गर्नुहोस्'}</span>
                </button>
              )}
            </div>
          </div>

          <div className="p-6">
            <div className="space-y-4">
              {/* Name */}
              <div className="flex items-center space-x-3">
                <FaUser className="text-gray-400" size={20} />
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {currentLanguage === 'en' ? 'Name' : 'नाम'}
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{user.name}</p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center space-x-3">
                <FaEnvelope className="text-gray-400" size={20} />
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {currentLanguage === 'en' ? 'Email' : 'इमेल'}
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{user.email}</p>
                  )}
                </div>
              </div>

              {/* Mobile */}
              <div className="flex items-center space-x-3">
                <FaPhone className="text-gray-400" size={20} />
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {currentLanguage === 'en' ? 'Mobile' : 'मोबाइल'}
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editForm.mobile}
                      onChange={(e) => setEditForm({...editForm, mobile: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{user.mobile}</p>
                  )}
                </div>
              </div>

              {/* Role */}
              <div className="flex items-center space-x-3">
                <FaUser className="text-gray-400" size={20} />
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {currentLanguage === 'en' ? 'Role' : 'भूमिका'}
                  </label>
                  <p className="text-gray-900 capitalize">{user.role}</p>
                </div>
              </div>

              {/* Credits */}
              <div className="flex items-center space-x-3">
                <FaUser className="text-gray-400" size={20} />
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {currentLanguage === 'en' ? 'Credits' : 'क्रेडिट'}
                  </label>
                  <p className="text-gray-900">{user.credits || 0}</p>
                </div>
              </div>
            </div>

            {/* Edit Actions */}
            {isEditing && (
              <div className="flex space-x-3 mt-6 pt-6 border-t">
                <button
                  onClick={handleSave}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                >
                  <FaSave size={16} />
                  <span>{currentLanguage === 'en' ? 'Save' : 'सुरक्षित गर्नुहोस्'}</span>
                </button>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                >
                  {currentLanguage === 'en' ? 'Cancel' : 'रद्द गर्नुहोस्'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 