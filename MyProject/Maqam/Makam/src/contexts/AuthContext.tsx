/**
 * Authentication Context (MongoDB Version)
 * 
 * Manages user authentication state with MongoDB backend
 */

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { authAPI, getStoredUser, getStoredToken } from '@/lib/api';

interface User {
  id: string;
  email: string;
  username: string;
  full_name?: string;
  phone?: string;
  role: 'user' | 'admin' | 'hotelier';
  avatar_url?: string;
  email_verified: boolean;
  phone_verified: boolean;
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  profile: User | null; // For backward compatibility
  loading: boolean;
  isAdmin: boolean;
  isCustomer: boolean;
  isHotelier: boolean;
  isStaff: boolean;
  getDashboardPath: () => string;
  signIn: (username: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (username: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = async () => {
    if (!user) return;

    try {
      const response: any = await authAPI.getCurrentUser();
      setUser(response.user);
      localStorage.setItem('user', JSON.stringify(response.user));
    } catch (error) {
      console.error('Failed to refresh profile:', error);
    }
  };

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = getStoredUser();
        const token = getStoredToken();

        if (storedUser && token) {
          // Verify token is still valid
          const response: any = await authAPI.getCurrentUser();
          setUser(response.user);
        }
      } catch (error) {
        console.error('Failed to load user:', error);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const signInWithUsername = async (username: string, password: string) => {
    try {
      // Support both email and username
      const email = username.includes('@') ? username : `${username}@maquamholidays.com`;
      const response: any = await authAPI.login(email, password);
      setUser(response.user);
      return { error: null, user: response.user };
    } catch (error) {
      return { error: error as Error, user: null };
    }
  };

  const signUpWithUsername = async (username: string, password: string) => {
    try {
      const email = username.includes('@') ? username : `${username}@maquamholidays.com`;
      const response: any = await authAPI.register({
        email,
        password,
        username,
        role: 'user',
      });
      setUser(response.user);
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
    }
  };

  // Role helper functions
  const isAdmin = user?.role === 'admin';
  const isCustomer = user?.role === 'user';
  const isHotelier = user?.role === 'hotelier';
  const isStaff = false; // No staff role in MongoDB version

  // Get dashboard path based on role
  const getDashboardPath = () => {
    if (!user) return '/';
    switch (user.role) {
      case 'admin':
        return '/admin';
      case 'user':
        return '/customer';
      case 'hotelier':
        return '/hotelier';
      default:
        return '/';
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      profile: user, // For backward compatibility
      loading,
      isAdmin,
      isCustomer,
      isHotelier,
      isStaff,
      getDashboardPath,
      signIn: signInWithUsername,
      signUp: signUpWithUsername,
      signOut,
      refreshProfile
    }}>
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

/**
 * Get user profile (for backward compatibility)
 * @deprecated Use useAuth().user instead
 */
export async function getProfile(userId: string): Promise<User | null> {
  try {
    const response: any = await authAPI.getCurrentUser();
    return response.user;
  } catch (error) {
    console.error('Failed to get profile:', error);
    return null;
  }
}