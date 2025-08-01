"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '@/lib/api';

interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  mobile: string;
  profileImage?: string;
  role: 'user' | 'admin';
  credits?: number;
  total_rentals?: number;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  login: (phone: string, password: string) => Promise<boolean>;
  register: (userData: {
    username: string;
    email: string;
    password: string;
    name: string;
    mobile: string;
  }) => Promise<boolean>;
  logout: () => void;
  updateProfile: (profile: { 
    name?: string; 
    email?: string; 
    mobile?: string; 
    profileImage?: string;
  }) => Promise<boolean>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<boolean>;
  loading: boolean;
  checkAuth: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status from server
  const checkAuth = async () => {
    try {
      console.log('🔍 AuthContext: Checking authentication status...');
      
      // Only run on client side
      if (typeof window === 'undefined') {
        console.log('🔍 AuthContext: Server side, skipping auth check');
        setLoading(false);
        return;
      }

      const token = localStorage.getItem('auth_token');
      console.log('🔍 AuthContext: Token from localStorage:', token ? 'Token exists' : 'No token');
      
      if (!token) {
        console.log('🔍 AuthContext: No auth token found');
        setUser(null);
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      // Call API to verify token and get user data
      console.log('🔍 AuthContext: Calling verifyToken API...');
      const response = await api.auth.verifyToken(token);
      console.log('🔍 AuthContext: Token verification response:', response);
      
      if (response.success && response.user) {
        console.log('✅ AuthContext: Token valid, user authenticated:', response.user.name);
        setUser(response.user);
        setIsAuthenticated(true);
      } else {
        console.log('❌ AuthContext: Token invalid, clearing auth data');
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('auth_token');
      }
    } catch (error) {
      console.error('❌ AuthContext: Error checking authentication:', error);
      setUser(null);
      setIsAuthenticated(false);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
      }
    } finally {
      setLoading(false);
    }
  };

  // Check auth on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const saveAuthToken = (token: string) => {
    console.log('💾 AuthContext: saveAuthToken called with token:', token ? 'Token exists' : 'No token');
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
      console.log('💾 AuthContext: Auth token saved to localStorage');
      // Verify it was saved
      const savedToken = localStorage.getItem('auth_token');
      console.log('💾 AuthContext: Verified saved token:', savedToken ? 'Token exists' : 'No token');
    } else {
      console.log('💾 AuthContext: Not on client side, cannot save token');
    }
  };

  // Login with phone number and password
  const login = async (phone: string, password: string): Promise<boolean> => {
    try {
      console.log('🔐 AuthContext: Attempting login with phone:', phone);
      setLoading(true);
      const response = await api.auth.login(phone, password);
      console.log('🔐 AuthContext: Login response:', response);
      
      if (response.success && response.user && response.token) {
        console.log('✅ AuthContext: Login successful, saving token and user');
        console.log('🔐 AuthContext: Token received:', response.token ? 'Token exists' : 'No token');
        console.log('🔐 AuthContext: User received:', response.user);
        saveAuthToken(response.token);
        setUser(response.user);
        setIsAuthenticated(true);
        return true;
      }
      console.log('❌ AuthContext: Login failed - missing success, user, or token');
      return false;
    } catch (error) {
      console.error('❌ Login error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Register new user
  const register = async (userData: {
    username: string;
    email: string;
    password: string;
    name: string;
    mobile: string;
  }): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await api.auth.signup(userData);
      if (response.success && response.user && response.token) {
        saveAuthToken(response.token);
        setUser(response.user);
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    console.log('🚪 AuthContext: Logging out user');
    setUser(null);
    setIsAuthenticated(false);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      console.log('🚪 AuthContext: User logged out, token removed');
    }
  };

  const updateProfile = async (profile: { 
    name?: string; 
    email?: string; 
    mobile?: string; 
    profileImage?: string;
  }): Promise<boolean> => {
    if (!user) return false;
    
    try {
      setLoading(true);
      const response = await api.user.updateProfile(user.id, profile);
      if (response.success && response.user) {
        setUser(response.user);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Update profile error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (oldPassword: string, newPassword: string): Promise<boolean> => {
    if (!user) return false;
    try {
      setLoading(true);
      const response = await api.user.updateProfile(user.id, { 
        name: user.name, 
        email: user.email, 
        mobile: user.mobile
      });
      if (response.success) {
        return true;
      }
      return false;
    } catch (error) {
      console.error('Change password error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register, 
      logout, 
      updateProfile, 
      changePassword,
      loading,
      checkAuth,
      isAuthenticated
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}; 