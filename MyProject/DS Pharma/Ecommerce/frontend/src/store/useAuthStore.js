import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      token: localStorage.getItem("authToken") || null,
      isAuthenticated: !!localStorage.getItem("authToken"),
      isLoading: false,

      // Actions
      setLoading: (loading) => set({ isLoading: loading }),

      login: (userData, authToken) => {
        // console.log("userData in useAuthStore", userData)
        localStorage.setItem("authToken", authToken);
        set({
          user: userData,
          token: authToken,
          isAuthenticated: true,
          isLoading: false,
        });
      },

      logout: () => {
        localStorage.removeItem("authToken");
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      updateUser: (userData) => {
        set((state) => ({
          user: { ...state.user, ...userData },
        }));
      },

      setToken: (token) => {
        if (token) {
          localStorage.setItem("authToken", token);
        } else {
          localStorage.removeItem("authToken");
        }
        set({ token, isAuthenticated: !!token });
      },

      setUser: (userData) =>
        set({ user: userData, isAuthenticated: !!userData, isLoading: false }),

      initialize: async () => {
        const token = localStorage.getItem("authToken");
        if (!token) {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          });
          return;
        }

        // If we have a token but no user, the App component
        // will handle the profile fetch to avoid circular deps.
        set({ token, isAuthenticated: true, isLoading: false });
      },

      // Getters
      getUser: () => get().user,
      getToken: () => get().token,
      isLoggedIn: () => get().isAuthenticated,
    }),
    {
      name: "ds-pharma-auth",
      version: 1,
    },
  ),
);
