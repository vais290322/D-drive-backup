import api from "./api";
export { folderApi } from "./folder.service";
export { default as adminApi } from "./admin.service";

/**
 * Authentication API
 */
export const authApi = {
    // Register new user
    register: async (data) => {
        const response = await api.post("/auth/register", data);
        return response.data;
    },

    // Login user
    login: async (data) => {
        const response = await api.post("/auth/login", data);
        return response.data;
    },

    // Logout user
    logout: async () => {
        const response = await api.post("/auth/logout");
        return response.data;
    },

    // Get user profile
    getProfile: async () => {
        const response = await api.get("/auth/profile");
        return response.data;
    },

    // Update profile
    updateProfile: async (data) => {
        const response = await api.patch("/auth/profile", data);
        return response.data;
    },

    // Change password
    changePassword: async (data) => {
        const response = await api.patch("/auth/change-password", data);
        return response.data;
    },

    // Refresh token
    refreshToken: async (refreshToken) => {
        const response = await api.post("/auth/refresh", { refreshToken });
        return response.data;
    },
};

/**
 * File API
 */
export const fileApi = {
    // Upload file
    uploadFile: async (formData, onProgress) => {
        const response = await api.post("/files/upload", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
            onUploadProgress: (progressEvent) => {
                if (onProgress) {
                    const percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    onProgress(percentCompleted);
                }
            },
        });
        return response.data;
    },

    // Upload base64 file
    uploadBase64: async (data) => {
        const response = await api.post("/files/upload-base64", data);
        return response.data;
    },

    // Get all files
    getFiles: async (params) => {
        const response = await api.get("/files", { params });
        return response.data;
    },

    // Get file by ID
    getFileById: async (id) => {
        const response = await api.get(`/files/${id}`);
        return response.data;
    },

    // Update file
    updateFile: async (id, data) => {
        const response = await api.patch(`/files/${id}`, data);
        return response.data;
    },

    // Delete file
    deleteFile: async (id) => {
        const response = await api.delete(`/files/${id}`);
        return response.data;
    },

    // Download file
    downloadFile: async (id) => {
        const response = await api.get(`/files/${id}/download`, {
            responseType: "blob",
        });
        return response;
    },

    // Generate signed URL
    generateSignedUrl: async (id, expiresIn = 3600) => {
        const response = await api.post(`/files/${id}/signed-url`, { expiresIn });
        return response.data;
    },

    // Get file statistics
    getStats: async () => {
        const response = await api.get("/files/stats");
        return response.data;
    },
};

/**
 * API Key API
 */
export const apiKeyApi = {
    // Create API key
    createApiKey: async (data) => {
        const response = await api.post("/api-keys", data);
        return response.data;
    },

    // Get all API keys
    getApiKeys: async () => {
        const response = await api.get("/api-keys");
        return response.data;
    },

    // Get API key by ID
    getApiKeyById: async (id) => {
        const response = await api.get(`/api-keys/${id}`);
        return response.data;
    },

    // Update API key
    updateApiKey: async (id, data) => {
        const response = await api.patch(`/api-keys/${id}`, data);
        return response.data;
    },

    // Revoke API key
    revokeApiKey: async (id) => {
        const response = await api.delete(`/api-keys/${id}`);
        return response.data;
    },

    // Delete API key permanently
    deleteApiKey: async (id) => {
        const response = await api.delete(`/api-keys/${id}/permanent`);
        return response.data;
    },

    // Get API key stats
    getApiKeyStats: async (id) => {
        const response = await api.get(`/api-keys/${id}/stats`);
        return response.data;
    },
};
