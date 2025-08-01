"use client";

import { useAuth } from "@/components/AuthContext";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { FaCoins, FaHistory, FaPlus, FaMinus, FaGlobe, FaSignOutAlt, FaArrowLeft, FaCalendar, FaMoneyBillWave, FaQrcode, FaUser } from "react-icons/fa";

interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'payment' | 'refund';
  amount: number;
  description: string;
  date: string;
}

export default function WalletPage() {
  const { user, logout, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'ne'>('en');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loadingTransactions, setLoadingTransactions] = useState(true);

  console.log('💰 WalletPage: Rendering with user:', user ? user.name : 'null');
  console.log('💰 WalletPage: Loading:', loading, 'Authenticated:', isAuthenticated);

  useEffect(() => {
    console.log('💰 WalletPage: useEffect triggered');
    console.log('💰 WalletPage: Loading:', loading, 'Authenticated:', isAuthenticated, 'User:', user ? user.name : 'null');
    
    if (!loading && !isAuthenticated) {
      console.log('💰 WalletPage: Not authenticated, redirecting to login');
      router.push("/en/login");
      return;
    } else if (!loading && isAuthenticated && user) {
      console.log('💰 WalletPage: User authenticated:', user.name);
    }

    // Load transactions only if authenticated
    if (isAuthenticated && user) {
      // Mock transaction data - in real app, this would come from API
      const mockTransactions: Transaction[] = [
        {
          id: '1',
          type: 'deposit',
          amount: 100,
          description: 'Initial credit deposit',
          date: '2024-01-15T10:30:00Z'
        },
        {
          id: '2',
          type: 'payment',
          amount: -20,
          description: 'Umbrella rental payment',
          date: '2024-01-16T14:20:00Z'
        },
        {
          id: '3',
          type: 'refund',
          amount: 5,
          description: 'Early return refund',
          date: '2024-01-17T09:15:00Z'
        }
      ];

      setTransactions(mockTransactions);
      setLoadingTransactions(false);
    }
  }, [loading, isAuthenticated, user, router]);

  const handleLogout = () => {
    logout();
    router.push("/en/login");
  };

  const handleLanguageChange = (language: 'en' | 'ne') => {
    setCurrentLanguage(language);
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <FaPlus className="text-green-500" size={16} />;
      case 'withdrawal':
        return <FaMinus className="text-red-500" size={16} />;
      case 'payment':
        return <FaMoneyBillWave className="text-blue-500" size={16} />;
      case 'refund':
        return <FaCoins className="text-yellow-500" size={16} />;
      default:
        return <FaCoins className="text-gray-500" size={16} />;
    }
  };

  const getTransactionTypeText = (type: string) => {
    switch (type) {
      case 'deposit':
        return currentLanguage === 'en' ? 'Deposit' : 'जम्मा';
      case 'withdrawal':
        return currentLanguage === 'en' ? 'Withdrawal' : 'निकासी';
      case 'payment':
        return currentLanguage === 'en' ? 'Payment' : 'भुक्तानी';
      case 'refund':
        return currentLanguage === 'en' ? 'Refund' : 'फिर्ता';
      default:
        return type;
    }
  };

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
                  {currentLanguage === 'en' ? 'Wallet' : 'बटुवा'}
                </h1>
                <p className="text-sm text-gray-600">
                  {currentLanguage === 'en' ? 'Manage your credits and transactions' : 'आफ्ना क्रेडिट र लेनदेन व्यवस्थापन गर्नुहोस्'}
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Credit Balance Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <FaCoins className="text-yellow-500 text-4xl" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {currentLanguage === 'en' ? 'Credit Balance' : 'क्रेडिट ब्यालेन्स'}
                </h2>
                <p className="text-4xl font-bold text-blue-600 mb-4">
                  {user.credits || 0}
                </p>
                <p className="text-sm text-gray-600">
                  {currentLanguage === 'en' ? 'Available credits' : 'उपलब्ध क्रेडिटहरू'}
                </p>
              </div>
            </div>
          </div>

          {/* Transaction History */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">
                    <FaHistory className="inline mr-2" />
                    {currentLanguage === 'en' ? 'Transaction History' : 'लेनदेन इतिहास'}
                  </h2>
                  <span className="text-sm text-gray-500">
                    {transactions.length} {currentLanguage === 'en' ? 'transactions' : 'लेनदेनहरू'}
                  </span>
                </div>
              </div>

              {loadingTransactions ? (
                <div className="p-6 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">
                    {currentLanguage === 'en' ? 'Loading transactions...' : 'लेनदेनहरू लोड हुँदै...'}
                  </p>
                </div>
              ) : transactions.length === 0 ? (
                <div className="p-6 text-center">
                  <FaHistory className="text-gray-400 text-4xl mx-auto mb-4" />
                  <p className="text-gray-600">
                    {currentLanguage === 'en' ? 'No transactions found' : 'कुनै लेनदेन फेला परेनन्'}
                  </p>
                </div>
              ) : (
                <div className="divide-y">
                  {transactions.map((transaction) => (
                    <div key={transaction.id} className="p-4 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {getTransactionIcon(transaction.type)}
                          <div>
                            <p className="font-medium text-gray-900">
                              {getTransactionTypeText(transaction.type)}
                            </p>
                            <p className="text-sm text-gray-600">
                              {transaction.description}
                            </p>
                            <div className="flex items-center text-xs text-gray-500 mt-1">
                              <FaCalendar className="mr-1" />
                              {new Date(transaction.date).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-semibold ${
                            transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {transaction.amount > 0 ? '+' : ''}{transaction.amount} credits
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">
            {currentLanguage === 'en' ? 'Quick Actions' : 'छिटो कार्यहरू'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => router.push("/en/dashboard")}
              className="flex items-center justify-center space-x-2 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FaQrcode className="text-blue-500" size={20} />
              <span className="font-medium">
                {currentLanguage === 'en' ? 'Rent Umbrella' : 'छाता भाडा लिनुहोस्'}
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