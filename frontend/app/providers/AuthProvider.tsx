'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import apiClient from '@/lib/services/api';
import Cookies from 'js-cookie';
import socketService from '@/lib/socket';

interface User {
  id: string;
  email: string;
  username: string;
  role: 'user' | 'admin';
  avatarKey?: string;
  createdAt?: string;
  notificationPreferences?: {
    email: boolean;
    inApp: boolean;
  };
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (token: string, userData: User) => void;
  logout: () => void;
  updateUser: (userData: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = Cookies.get('token');
        if (!token) {
          setLoading(false);
          return;
        }

        const response = await apiClient.get('/users/me');

        setUser(response.data.data);
        
        // Connect to Socket.io when user is fetched
        socketService.connect(token);
      } catch (err) {
        console.error('Failed to fetch user:', err);
        Cookies.remove('token');
        setError(err instanceof Error ? err.message : 'Failed to fetch user');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = (token: string, userData: User) => {
    Cookies.set('token', token, { expires: 7 });
    setUser(userData);
    
    // Connect to Socket.io when user logs in
    socketService.connect(token);
  };

  const logout = () => {
    Cookies.remove('token');
    setUser(null);
    setError(null);
    
    // Disconnect from Socket.io when user logs out
    socketService.disconnect();
    
    // Redirect to login page
    if (typeof window !== 'undefined') {
      window.location.href = '/auth/login';
    }
  };

  const updateUser = (userData: User) => {
    setUser(userData);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        isAuthenticated: !!user,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
