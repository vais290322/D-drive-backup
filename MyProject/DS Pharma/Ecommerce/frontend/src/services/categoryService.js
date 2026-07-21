/**
 * Category API Service
 * Handles all category-related API calls to the live backend
 * Base URL: http://192.168.0.123:5000/category
 */

import apiClient from "./api/apiClient";
import { API_ENDPOINTS } from "./api/baseURL";
export const apiKushal =
  import.meta.env.VITE_MEDIA_CLOUD_BASE_URL || "http://localhost:5000";

export const categoryService = {
  /**
   * Fetch categories from the backend with pagination and search
   * @param {Object} params - Query parameters
   * @param {string} params.search - Search term
   * @param {number} params.page - Page number
   * @param {number} params.limit - Items per page
   * @returns {Promise<Object>} Paginated response with categories and metadata
   */
  getAllCategories: async (params = {}) => {
    try {
      const { search = "", page = 1, limit = 10 } = params;
      const response = await apiClient.get(`${apiKushal}/api/v1/categories`, {
        params: { search, page, limit },
      });

      const data = response.data;
      // Backend structure: { data: [...], pagination: { totalItems, ... } }
      const categories = data.data.categories || [];
      const pagination = data.data.pagination || {};

      return {
        categories: categories.map((cat) => {
          // Flatten image URL for UI components that expect a string, 
          // but keep the record of the original image object/array for deletion
          let imageUrl = cat.image;
          if (cat.image && typeof cat.image === "object" && cat.image.url) {
            imageUrl = cat.image.url;
          } else if (cat.images && cat.images.length > 0 && cat.images[0].url) {
            imageUrl = cat.images[0].url;
          }

          return {
            ...cat,
            id: cat.id || cat._id,
            image: imageUrl,
            images: cat.images || (cat.image && typeof cat.image === 'object' ? [cat.image] : []),
            visibility:
              cat.visibility !== undefined ? cat.visibility : cat.isVisible,
          };
        }),
        totalItems: pagination.totalItems || categories.length,
        totalPages: pagination.totalPages || 1,
        currentPage: pagination.currentPage || Number(page),
        limit: pagination.limit || Number(limit),
      };
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  },

  /**
   * Get category details by ID
   */
  getCategoryById: async (id) => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.CATEGORY_BY_ID(id));
      const category = response.data.data || response.data;

      let imageUrl = category.image;
      if (
        category.image &&
        typeof category.image === "object" &&
        category.image.url
      ) {
        imageUrl = category.image.url;
      } else if (category.images && category.images.length > 0 && category.images[0].url) {
        imageUrl = category.images[0].url;
      }

      return {
        ...category,
        id: category.id || category._id,
        image: imageUrl,
        images: category.images || (category.image && typeof category.image === 'object' ? [category.image] : []),
        visibility:
          category.visibility !== undefined
            ? category.visibility
            : category.isVisible,
      };
    } catch (error) {
      console.error(`Error fetching category ${id}:`, error);
      throw error;
    }
  },

  /**
   * Create a new category
   */
  createCategory: async (categoryData) => {
    try {
      const response = await apiClient.post(
        `${apiKushal}/api/v1/categories`,
        categoryData,
      );
      return response.data;
    } catch (error) {
      console.error("Error creating category:", error);
      throw error;
    }
  },

  /**
   * Update an existing category
   */
  updateCategory: async (id, categoryData) => {
    try {
      const response = await apiClient.put(
        `${apiKushal}/api/v1/categories/${id}`,
        categoryData,
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating category ${id}:`, error);
      throw error;
    }
  },

  /**
   * Delete a category
   */
  deleteCategory: async (id) => {
    try {
      await apiClient.delete(`${apiKushal}/api/v1/categories/${id}`);
    } catch (error) {
      console.error(`Error deleting category ${id}:`, error);
      throw error;
    }
  },

  /**
   * Get filtered visible categories for the website
   */
  getVisibleCategories: async () => {
    try {
      const result = await categoryService.getAllCategories({
        page: 1,
        limit: 100,
      });
      return result.categories.filter(
        (cat) =>
          cat.visibility === true ||
          cat.visibility === "true" ||
          cat.isVisible === true ||
          cat.isVisible === "true" ||
          cat.status === true ||
          cat.status === "active",
      );
    } catch (error) {
      console.error("Error fetching visible categories:", error);
      throw error;
    }
  },
};

export default categoryService;
