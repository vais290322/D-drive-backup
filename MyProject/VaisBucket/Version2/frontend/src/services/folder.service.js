import api from "./api";

export const folderApi = {
    /**
     * Get directory contents (folders and files)
     */
    getDirectoryContents: async (parentFolder = null, all = false) => {
        const query = all ? `?all=true` : `?parentFolder=${parentFolder || "null"}`;
        const response = await api.get(`/folders${query}`);
        return response.data;
    },

    /**
     * Create a new folder
     */
    createFolder: async (data) => {
        const response = await api.post("/folders", data);
        return response.data;
    },

    /**
     * Rename a folder
     */
    renameFolder: async (id, name) => {
        const response = await api.patch(`/folders/${id}`, { name });
        return response.data;
    },

    /**
     * Delete a folder
     */
    deleteFolder: async (id) => {
        const response = await api.delete(`/folders/${id}`);
        return response.data;
    },
};
