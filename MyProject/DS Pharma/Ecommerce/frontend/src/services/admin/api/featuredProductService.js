import axios from "axios";
import { featuredProductUrl } from "@/config/adminApi";

/**
 * Featured Product Service
 * Handles all featured product operations using the backend API
 */
export const featuredProductService = {
  /**
   * Get all featured products
   * @returns {Promise<Array>} List of featured products
   */
  getFeaturedProducts: async () => {
    try {
      const response = await axios.get(featuredProductUrl.getFeaturedProducts);
      return response.data;
    } catch (error) {
      console.error("Error fetching featured products:", error);
      throw error;
    }
  },

  /**
   * Add a product to featured list
   * @param {string} productId - The ID of the product to add
   * @returns {Promise<Object>} Response data
   */
  addFeaturedProduct: async (productId) => {
    try {
      const response = await axios.post(featuredProductUrl.addFeaturedProduct, {
        productId,
      });
      return response.data;
    } catch (error) {
      console.error("Error adding featured product:", error);
      throw error;
    }
  },

  /**
   * Remove a product from featured list
   * @param {string} featuredId - The ID of the featured record to remove
   * @returns {Promise<Object>} Response data
   */
  removeFeaturedProduct: async (featuredId) => {
    try {
      const response = await axios.delete(
        `${featuredProductUrl.removeFeaturedProduct}/${featuredId}`,
      );
      return response.data;
    } catch (error) {
      console.error("Error removing featured product:", error);
      throw error;
    }
  },
};
