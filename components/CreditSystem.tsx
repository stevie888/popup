"use client";
import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { Button } from './ui/button';
import { FaCoins, FaPlus, FaMinus } from 'react-icons/fa';

export default function CreditSystem() {
  const { user } = useAuth();
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user && user.id) {
      fetchCreditBalance();
    }
  }, [user]);

  const fetchCreditBalance = async () => {
    if (!user?.id) return;
    
    try {
      const response = await fetch(`http://localhost:3001/api/credits?userId=${user.id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.success) {
        setBalance(data.balance);
      }
    } catch (error) {
      console.error('Error fetching credit balance:', error);
    }
  };

  const getCreditStatus = () => {
    if (balance >= 200) return { color: 'text-green-600', status: 'Excellent' };
    if (balance >= 100) return { color: 'text-yellow-600', status: 'Good' };
    if (balance >= 50) return { color: 'text-orange-600', status: 'Low' };
    return { color: 'text-red-600', status: 'Critical' };
  };

  const status = getCreditStatus();

  // Show login message if no user
  if (!user) {
    return (
      <div className="max-w-md mx-auto p-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-800 mb-2">Credit System</h3>
          <p className="text-sm text-blue-600 mb-3">
            Please log in to view your credit balance.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-4">
      {/* Credit Balance */}
      <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-lg p-6 mb-4 text-white">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold">Credit Balance</h3>
          <FaCoins size={24} />
        </div>
        <div className="text-3xl font-bold mb-1">{balance}</div>
        <div className={`text-sm ${status.color}`}>
          Status: {status.status}
        </div>
        <div className="text-sm opacity-90">
          {balance >= 50 ? `${Math.floor(balance / 50)} rentals available` : 'Need more credits to rent'}
        </div>
      </div>

      {/* Credit Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-800 mb-2">Credit Information</h3>
        <div className="text-sm text-blue-700 space-y-1">
          <div>• 1 rental = 50 credits</div>
          <div>• Minimum balance: 50 credits</div>
          <div>• Credits never expire</div>
          <div>• Credits are deducted when you rent umbrellas</div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
    </div>
  );
} 