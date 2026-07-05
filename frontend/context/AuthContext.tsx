'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/services/api';

interface User {
  id: string;
  name: string;
  email: string;
  role_id: number;
  is_active: boolean;
  last_login?: string;
  profile?: {
    first_name: string;
    last_name: string;
    phone?: string;
    avatar_url?: string;
    bio?: string;
    date_of_birth?: string;
  };
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (firstName: string, lastName: string, email: string, password: string, phone?: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const setCookie = (name: string, value: string, maxAge: number) => {
  document.cookie = `${name}=${value}; path=/; max-age=${maxAge}; SameSite=Lax; Secure`;
};

const deleteCookie = (name: string) => {
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const refreshUser = async () => {
    try {
      const res = await api.get('/profile/');
      setUser(res.data);
      if (res.data.role_id === 1) {
        setCookie('user_role', 'Admin', 86400);
      } else {
        setCookie('user_role', 'User', 86400);
      }
    } catch (e) {
      setUser(null);
      deleteCookie('user_role');
      deleteCookie('access_token');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      refreshUser();
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('access_token', res.data.access_token);
      localStorage.setItem('refresh_token', res.data.refresh_token);
      setCookie('access_token', res.data.access_token, 86400);
      await refreshUser();
      router.push('/dashboard');
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const register = async (firstName: string, lastName: string, email: string, password: string, phone?: string) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/register', { 
        first_name: firstName, 
        last_name: lastName, 
        email, 
        password, 
        phone 
      });
      localStorage.setItem('access_token', res.data.access_token);
      localStorage.setItem('refresh_token', res.data.refresh_token);
      setCookie('access_token', res.data.access_token, 86400);
      await refreshUser();
      router.push('/dashboard');
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    const refresh = localStorage.getItem('refresh_token');
    if (refresh) {
      try {
        await api.post(`/auth/logout?refresh_token=${refresh}`);
      } catch (e) {
        // ignore logout errors on backend
      }
    }
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    deleteCookie('access_token');
    deleteCookie('user_role');
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
};
