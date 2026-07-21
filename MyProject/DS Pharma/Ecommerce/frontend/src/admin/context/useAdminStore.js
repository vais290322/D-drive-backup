import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAdminStore = create(
  persist(
    (set) => ({
      adminUser: null,
      token: null,
      isAuthenticated: false,
      isSidebarOpen: true,

      login: (userData, token) =>
        set({
          adminUser: userData,
          token: token,
          isAuthenticated: true,
        }),

      logout: () =>
        set({
          adminUser: null,
          token: null,
          isAuthenticated: false,
        }),

      toggleSidebar: () =>
        set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
    }),
    {
      name: "admin-storage", // unique name
      partialize: (state) => ({
        adminUser: state.adminUser,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }), // Persist only auth state
    }
  )
);

export default useAdminStore;
