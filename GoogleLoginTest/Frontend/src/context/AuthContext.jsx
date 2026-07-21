import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext(null);

const API = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true, // Send cookies with every request
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Try to restore session on mount
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const res = await API.get("/api/v1/auth/me");
        setUser(res.data.data);
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    restoreSession();
  }, []);

  // Email/password login
  const login = async (email, password) => {
    const res = await API.post("/api/v1/auth/login", { email, password });
    setUser(res.data.data);
    return res.data;
  };

  // Email/password register
  const register = async (userData) => {
    const res = await API.post("/api/v1/auth/register", userData);
    setUser(res.data.data);
    return res.data;
  };

  // Google OAuth login (credential = Google ID token from @react-oauth/google)
  const googleLogin = async (credential) => {
    const res = await API.post("/api/v1/auth/google-login", { credential });
    setUser(res.data.data);
    return res.data;
  };

  // GitHub OAuth login
  const githubLogin = async (code) => {
    const res = await API.post("/api/v1/auth/github-login", { code });
    setUser(res.data.data);
    return res.data;
  };

  // Logout
  const logout = async () => {
    await API.post("/api/v1/auth/logout");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        googleLogin,
        githubLogin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};

export default AuthContext;
