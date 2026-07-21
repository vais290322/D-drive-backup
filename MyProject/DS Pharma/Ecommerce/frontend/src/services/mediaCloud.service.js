import axios from "axios";

/**
 * MediaCloud REST API Service
 * Base URL: https://apibucket.vais.co.in/api/v1
 */

const MEDIACLOUD_API_URL = "https://apibucket.vais.co.in/api/v1/user";
const API_KEY =
  "fup_232a28a4_de6f29b910ac06959d690901f3221b97301657e6b2459173eae6562244022e42";

const mediaApiClient = axios.create({
  baseURL: MEDIACLOUD_API_URL,
  headers: {
    "X-API-Key": API_KEY,
  },
});

mediaApiClient.interceptors.request.use((request) => {
  console.log("[MediaCloud] Request:", {
    url: request.url,
    method: request.method,
    headers: request.headers,
    data: request.data instanceof FormData ? "FormData" : request.data,
  });
  return request;
});

mediaApiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("[MediaCloud] Error Context:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        headers: error.config?.headers,
      },
    });
    return Promise.reject(error);
  },
);

export const mediaCloudService = {
  /**
   * Upload a single file to MediaCloud
   * @param {File} file - The image file to upload
   * @param {string} visibility - "public" or "private"
   * @param {Function} onProgress - Callback for upload progress
   * @returns {Promise<Object>} { fileId, fileUrl, fileName }
   */
  uploadFile: async (
    file,
    visibility = "public",
    folderId = null,
    onProgress,
  ) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("visibility", visibility);
      if (folderId) formData.append("folderId", folderId);

      const response = await mediaApiClient.post("/files/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total,
            );
            onProgress(percentCompleted);
          }
        },
      });
// console.log("response from uploadFile : ",response)
      // Assuming response.data contains the mapping info
      return {
        fileId: response.data?.data?.fileId,
        url: response.data?.data?.fileUrl,
        name: response.data?.data?.fileName || file.name,
      };
    } catch (error) {
      console.error("[MediaCloudService] Upload Error:", error);
      throw new Error(
        error.response?.data?.message || "Failed to upload image to MediaCloud",
      );
    }
  },

  /**
   * Delete a file from MediaCloud
   * @param {string} fileId
   */
  deleteFile: async (fileId) => {
    try {
      const response = await mediaApiClient.delete(`/files/${fileId}`);
      return response.data;
    } catch (error) {
      console.error("[MediaCloudService] Delete Error:", error);
      throw new Error(
        error.response?.data?.message ||
          "Failed to delete image from MediaCloud",
      );
    }
  }, 

  /**
   * Batch upload multiple files in parallel
   * @param {File[]} files
   * @param {Function} onFileComplete - Callback when a file finishes
   */
  batchUpload: async (files, onFileComplete) => {
    const uploadPromises = files.map(async (file) => {
      try {
        const result = await mediaCloudService.uploadFile(file, "public");
        if (onFileComplete) onFileComplete(result);
        return result;
      } catch (error) {
        console.error(`Failed to upload ${file.name}:`, error);
        return { error: error.message, fileName: file.name };
      }
    });

    return Promise.all(uploadPromises);
  },
};

export default mediaCloudService;
