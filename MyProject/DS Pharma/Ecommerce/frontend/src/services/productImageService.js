import axios from "axios";
import { validateImage } from "@/utils/imageValidation";

const IMAGE_API_URL = `${import.meta.env.VITE_URL}/products`;

// Use mock service for local development if needed
const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";

export const productImageService = {
  /**
   * Upload multiple images for a product
   * @param {string|number} productId - Product ID from Marg
   * @param {File[]} files - Array of image files
   * @returns {Promise<Object>}
   */
  uploadProductImages: async (productId, files) => {
    try {
      // Validate all files
      files.forEach((file) => validateImage(file));

      if (USE_MOCK) {
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Mocking behavior: convert to data URLs
        const newImages = await Promise.all(
          files.map(
            (file) =>
              new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () =>
                  resolve({
                    id: Math.random().toString(36).substr(2, 9),
                    url: reader.result,
                    name: file.name,
                  });
                reader.readAsDataURL(file);
              }),
          ),
        );

        return {
          success: true,
          images: newImages,
          message: "Images uploaded successfully (Mock)",
        };
      }

      const formData = new FormData();
      files.forEach((file) => formData.append("images", file));

      const response = await axios.post(
        `${IMAGE_API_URL}/${productId}/images`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );

      return {
        success: true,
        images: response.data.images || [],
        message: response.data.message || "Images uploaded successfully",
      };
    } catch (error) {
      console.error("[ProductImageService] Upload Error:", error);
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Failed to upload images",
      );
    }
  },

  /**
   * Delete a product image
   * @param {string|number} productId
   * @param {string|number} imageId
   */
  deleteProductImage: async (productId, imageId) => {
    try {
      if (USE_MOCK) {
        await new Promise((resolve) => setTimeout(resolve, 800));
        return { success: true, message: "Image deleted successfully (Mock)" };
      }

      const response = await axios.delete(
        `${IMAGE_API_URL}/${productId}/images/${imageId}`,
      );
      return {
        success: true,
        message: response.data.message || "Image deleted successfully",
      };
    } catch (error) {
      console.error("[ProductImageService] Delete Error:", error);
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Failed to delete image",
      );
    }
  },

  /**
   * Fetch product images
   * @param {string|number} productId
   */
  getProductImages: async (productId) => {
    try {
      if (USE_MOCK) {
        return { success: true, images: [] }; // Mock starts empty or could pull from storage
      }

      const response = await axios.get(`${IMAGE_API_URL}/${productId}/images`);
      return {
        success: true,
        images: response.data.images || [],
      };
    } catch (error) {
      console.error("[ProductImageService] Fetch Error:", error);
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch images",
      );
    }
  },
};

export default productImageService;
