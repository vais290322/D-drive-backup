import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { getCurrentUser, logout as apiLogout, type AuthUser } from "@/db/api";
import apiClient from '@/lib/apiClient';
import type { Profile } from "@/types/types";

interface AuthContextType {
  user: AuthUser | null;
  profile: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

// Create context with a default value to prevent undefined errors
const defaultAuthContext: AuthContextType = {
  user: null,
  profile: null,
  loading: true,
  signOut: async () => {},
  refreshProfile: async () => {},
};

const AuthContext = createContext<AuthContextType>(defaultAuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = async () => {
    if (!user) return;
    try {
      if (apiClient.hasBackend()) {
        try {
          const me = await apiClient.request('/auth/me');
          setProfile(me);
          return;
        } catch (err) {
          // ignore - server may not implement /auth/me
        }
      }

      const { getProfile } = await import("@/db/api");
      const profileData = await getProfile(user.id);
      setProfile(profileData);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const signOut = async () => {
    await apiLogout();
    setUser(null);
    setProfile(null);
  };

  useEffect(() => {
    let mounted = true;

    const loadUser = async () => {
      try {
        const currentUser = await getCurrentUser();

        if (!mounted) return;

        setUser(currentUser);

        if (currentUser) {
          if (apiClient.hasBackend()) {
            try {
              const me = await apiClient.request('/auth/me');
              setProfile(me);
            } catch (err) {
              // fallback to local profile lookup
              const { getProfile } = await import("@/db/api");
              const profileData = await getProfile(currentUser.id);
              setProfile(profileData);
            }
          } else {
            const { getProfile } = await import("@/db/api");
            const profileData = await getProfile(currentUser.id);
            setProfile(profileData);
          }
        } else {
          setProfile(null);
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    // Initial load
    loadUser();

    // Listen for auth changes triggered elsewhere (same-tab dispatch)
    const onAuthChanged = () => {
      // Re-load user/profile
      loadUser();
    };

    window.addEventListener('auth-changed', onAuthChanged);

    return () => {
      mounted = false;
      window.removeEventListener('auth-changed', onAuthChanged);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile, loading, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  return context;
}

