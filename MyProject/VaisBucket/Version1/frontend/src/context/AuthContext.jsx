import React, { createContext, useContext, useState, useEffect } from "react";
import { authApi } from "../services";

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Check if user is logged in on mount
    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem("accessToken");
            const savedUser = localStorage.getItem("user");

            if (token && savedUser) {
                try {
                    setUser(JSON.parse(savedUser));
                    setIsAuthenticated(true);

                    // Fetch fresh user data
                    const response = await authApi.getProfile();
                    if (response.success) {
                        setUser(response.data.user);
                        localStorage.setItem("user", JSON.stringify(response.data.user));
                    }
                } catch (error) {
                    console.error("Auth check failed:", error);
                    logout();
                }
            }
            setLoading(false);
        };

        checkAuth();
    }, []);

    const login = async (email, password) => {
        try {
            const response = await authApi.login({ email, password });

            if (response.success) {
                const { user, accessToken, refreshToken } = response.data;

                setUser(user);
                setIsAuthenticated(true);

                localStorage.setItem("accessToken", accessToken);
                localStorage.setItem("refreshToken", refreshToken);
                localStorage.setItem("user", JSON.stringify(user));

                return { success: true, user };
            }

            return { success: false, message: response.message };
        } catch (error) {
            console.error("Login error:", error);
            return {
                success: false,
                message: error.response?.data?.message || "Login failed",
            };
        }
    };

    const register = async (name, email, password) => {
        try {
            const response = await authApi.register({ name, email, password });

            if (response.success) {
                const { user, accessToken, refreshToken } = response.data;

                setUser(user);
                setIsAuthenticated(true);

                localStorage.setItem("accessToken", accessToken);
                localStorage.setItem("refreshToken", refreshToken);
                localStorage.setItem("user", JSON.stringify(user));

                return { success: true, user };
            }

            return { success: false, message: response.message };
        } catch (error) {
            console.error("Register error:", error);
            return {
                success: false,
                message: error.response?.data?.message || "Registration failed",
            };
        }
    };

    const logout = async () => {
        try {
            await authApi.logout();
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            setUser(null);
            setIsAuthenticated(false);
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("user");
        }
    };

    const updateUser = async (data) => {
        try {
            const response = await authApi.updateProfile(data);

            if (response.success) {
                setUser(response.data.user);
                localStorage.setItem("user", JSON.stringify(response.data.user));
                return { success: true };
            }

            return { success: false, message: response.message };
        } catch (error) {
            console.error("Update profile error:", error);
            return {
                success: false,
                message: error.response?.data?.message || "Update failed",
            };
        }
    };

    const value = {
        user,
        loading,
        isAuthenticated,
        login,
        register,
        logout,
        updateUser,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
