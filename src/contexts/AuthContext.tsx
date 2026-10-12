import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import type { User, Role, Department } from '../types';

interface AuthContextType {
  user: (User & { role: Role; department?: Department }) | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (data: SignUpData) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isProcurementOfficer: boolean;
  isSupplier: boolean;
  isAuditor: boolean;
}

interface SignUpData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role_name: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<(User & { role: Role; department?: Department }) | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkSession();
  }, []);

  async function checkSession() {
    try {
      const storedUser = localStorage.getItem('sttms_user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Session check error:', error);
    } finally {
      setLoading(false);
    }
  }

  async function login(email: string, password: string) {
    try {
      setLoading(true);

      // Call the edge function for authentication
      const { data, error } = await supabase.functions.invoke('auth-login', {
        body: { email, password }
      });

      if (error) {
        return { success: false, error: 'Invalid email or password' };
      }

      if (!data.success || !data.user) {
        return { success: false, error: data.error || 'Login failed' };
      }

      const fullUser = {
        id: data.user.id,
        email: data.user.email,
        first_name: data.user.first_name,
        last_name: data.user.last_name,
        role_id: data.user.role.id,
        role: data.user.role,
        department: data.user.department,
        employee_id: data.user.employee_id,
        phone: data.user.phone,
        is_active: data.user.is_active,
        email_verified: data.user.email_verified,
        created_at: data.user.created_at,
        updated_at: data.user.created_at
      } as User & { role: Role; department?: Department };

      setUser(fullUser);
      localStorage.setItem('sttms_user', JSON.stringify(fullUser));

      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'An unexpected error occurred' };
    } finally {
      setLoading(false);
    }
  }

  async function signUp(data: SignUpData) {
    try {
      setLoading(true);

      const { data: result, error } = await supabase.functions.invoke('auth-register', {
        body: {
          email: data.email,
          password: data.password,
          first_name: data.first_name,
          last_name: data.last_name,
          role_name: data.role_name,
        }
      });

      if (error) {
        return { success: false, error: 'Registration failed. Please try again.' };
      }

      if (!result.success) {
        return { success: false, error: result.error || 'Registration failed' };
      }

      return { success: true };
    } catch (error) {
      console.error('Sign up error:', error);
      return { success: false, error: 'An unexpected error occurred' };
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    setUser(null);
    localStorage.removeItem('sttms_user');
  }

  const value: AuthContextType = {
    user,
    loading,
    login,
    signUp,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role?.name === 'admin',
    isProcurementOfficer: user?.role?.name === 'procurement_officer',
    isSupplier: user?.role?.name === 'supplier',
    isAuditor: user?.role?.name === 'auditor',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
