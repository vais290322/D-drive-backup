import apiClient from "../../api/apiClient";
import { API_ENDPOINTS } from "../../api/baseURL";

/**
 * Featured Product API Service
 * Handles all featured product operations (Add, Get, Delete)
 *
 * NOTE: This service normalizes backend responses to return the data array
 */
export const featuredService = {
  /**
   * Fetch all featured products
   */
  getFeaturedProducts: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.FEATURED_GET);
      // Backend returns { data: [...], message: "..." }
      // We extract the data array for easier consumption in hooks
      return response.data?.data || [];
    } catch (error) {
      console.error(
        "Error fetching featured products:",
        error.response?.data || error.message,
      );
      throw error;
    }
  },

  /**
   * Add a product to the featured list
   * @param {string} productId - The ID of the product to feature
   */
  addToFeatured: async (productId) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.FEATURED_ADD, {
        productId,
      });
      return response.data;
    } catch (error) {
      console.error(
        "Error adding to featured:",
        error.response?.data || error.message,
      );
      throw error;
    }
  },

  /**
   * Remove a product from the featured list
   * @param {string} id - The featured record ID
   */
  removeFromFeatured: async (id) => {
    try {
      const response = await apiClient.delete(
        API_ENDPOINTS.FEATURED_DELETE(id),
      );
      return response.data;
    } catch (error) {
      console.error(
        "Error removing from featured:",
        error.response?.data || error.message,
      );
      throw error;
    }
  },

  /**
   * Fetch all products (for admin to select from)
   */
  getAllProducts: async (params = {}) => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.PRODUCT_ALL, {
        params,
      });
      // Return the full response data because it contains pagination info (total, limit, etc.)
      return response.data;
    } catch (error) {
      console.error(
        "Error fetching all products:",
        error.response?.data || error.message,
      );
      throw error;
    }
  },
};
