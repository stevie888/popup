"use client";
import { useAuth } from "@/components/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import RentalManager from "@/components/RentalManager";
import CreditSystem from "@/components/CreditSystem";
import StationMap from "@/components/StationMap";
import { FaQrcode, FaCoins, FaMapMarkerAlt, FaUser, FaSignOutAlt, FaGlobe, FaCog, FaChartLine, FaWallet, FaHistory } from "react-icons/fa";

export default function HomePage() {
  const { user, logout, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'rental' | 'credits' | 'stations'>('rental');
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'ne'>('en');

  console.log('🏠 Dashboard: Rendering with user:', user ? user.name : 'null');
  console.log('🏠 Dashboard: Loading:', loading, 'Authenticated:', isAuthenticated);

  useEffect(() => {
    console.log('🏠 Dashboard: useEffect triggered');
    console.log('🏠 Dashboard: Loading:', loading, 'Authenticated:', isAuthenticated, 'User:', user ? user.name : 'null');
    
    if (!loading && !isAuthenticated) {
      console.log('🏠 Dashboard: Not authenticated, redirecting to login');
      router.push("/en/login");
    } else if (!loading && isAuthenticated && user) {
      console.log('🏠 Dashboard: User authenticated:', user.name);
    }
  }, [loading, isAuthenticated, user, router]);

  const handleLogout = () => {
    logout();
    router.push("/en/login");
  };

  const handleLanguageChange = (language: 'en' | 'ne') => {
    setCurrentLanguage(language);
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
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold">
                {currentLanguage === 'en' ? 'Umbrella Rental' : 'छाता भाडा'}
              </h1>
              <p className="text-sm text-gray-600">
                {currentLanguage === 'en' ? 'Welcome, ' : 'स्वागत छ, '}{user.name}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              {/* Language Switcher Button */}
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
              
              {/* Admin Dashboard Button (only for admins) */}
              {user.role === 'admin' && (
                <button
                  onClick={() => router.push("/en/admin")}
                  className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                  title={currentLanguage === 'en' ? 'Admin Dashboard' : 'एडमिन ड्यासबोर्ड'}
                >
                  <FaChartLine size={20} />
                </button>
              )}
              
              <button
                onClick={() => router.push("/en/wallet")}
                className="p-2 text-gray-600 hover:text-yellow-600 transition-colors"
                title={currentLanguage === 'en' ? 'Wallet' : 'बटुवा'}
              >
                <FaWallet size={20} />
              </button>
              
              <button
                onClick={() => router.push("/en/history")}
                className="p-2 text-gray-600 hover:text-green-600 transition-colors"
                title={currentLanguage === 'en' ? 'History' : 'इतिहास'}
              >
                <FaHistory size={20} />
              </button>
              
              <button
                onClick={() => router.push("/en/profile")}
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
        <div className="max-w-md mx-auto px-4">
          <div className="flex space-x-1">
            <button
              onClick={() => setActiveTab('rental')}
              className={`flex-1 py-3 px-4 text-sm font-medium rounded-t-lg transition-colors ${
                activeTab === 'rental'
                  ? 'bg-yellow-500 text-black'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <FaQrcode className="inline mr-2" />
              {currentLanguage === 'en' ? 'Rent' : 'भाडा'}
            </button>
            <button
              onClick={() => setActiveTab('credits')}
              className={`flex-1 py-3 px-4 text-sm font-medium rounded-t-lg transition-colors ${
                activeTab === 'credits'
                  ? 'bg-yellow-500 text-black'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <FaCoins className="inline mr-2" />
              {currentLanguage === 'en' ? 'Credits' : 'क्रेडिट'}
            </button>
            <button
              onClick={() => setActiveTab('stations')}
              className={`flex-1 py-3 px-4 text-sm font-medium rounded-t-lg transition-colors ${
                activeTab === 'stations'
                  ? 'bg-yellow-500 text-black'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <FaMapMarkerAlt className="inline mr-2" />
              {currentLanguage === 'en' ? 'Stations' : 'स्टेशन'}
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto">
        {activeTab === 'rental' && <RentalManager />}
        {activeTab === 'credits' && <CreditSystem />}
        {activeTab === 'stations' && <StationMap />}
      </div>
    </div>
  );
} 