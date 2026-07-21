import api from "./api";

const adminApi = {
    /**
     * Get system-wide statistics
     */
    getSystemStats: async () => {
        const response = await api.get("/admin/stats");
        return response.data;
    },

    /**
     * Get all users with pagination and search
     */
    getAllUsers: async (page = 1, limit = 10, search = "") => {
        const response = await api.get(`/admin/users?page=${page}&limit=${limit}&search=${search}`);
        return response.data;
    },

    /**
     * Update a user's storage limit
     */
    updateStorageLimit: async (userId, limit) => {
        const response = await api.patch(`/admin/users/${userId}/limit`, { limit });
        return response.data;
    },

    /**
     * Toggle user active status
     */
    toggleUserStatus: async (userId) => {
        const response = await api.patch(`/admin/users/${userId}/status`);
        return response.data;
    },

    /**
     * Get detailed user information
     */
    getUserDetails: async (userId) => {
        const response = await api.get(`/admin/users/${userId}`);
        return response.data;
    },

    /**
     * Update admin message for a user
     */
    updateAdminMessage: async (userId, message) => {
        const response = await api.patch(`/admin/users/${userId}/message`, { message });
        return response.data;
    },

    /**
     * Get system settings
     */
    getSystemSettings: async () => {
        const response = await api.get("/admin/settings");
        return response.data;
    },

    /**
     * Toggle signup mode
     */
    toggleSignupMode: async (enabled) => {
        const response = await api.patch("/admin/settings/signup-mode", { enabled });
        return response.data;
    },

    /**
     * Get transaction history (paginated)
     */
    getTransactionHistory: async (page = 1, limit = 10, search = "") => {
        const response = await api.get(`/admin/transactions?page=${page}&limit=${limit}&search=${search}`);
        return response.data;
    },

    /**
     * Get revenue statistics
     */
    getRevenueStats: async () => {
        const response = await api.get("/admin/revenue");
        return response.data;
    },

    /**
     * Get specific user transactions
     */
    getUserTransactions: async (userId) => {
        const response = await api.get(`/admin/users/${userId}/transactions`);
        return response.data;
    }
};

export default adminApi;
