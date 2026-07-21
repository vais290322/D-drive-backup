import apiClient from "./api/apiClient";
import { API_ENDPOINTS } from "./api/baseURL";

/**
 * Auth Service
 * Handles all authentication related API calls directly with the backend
 */
export const authService = {
  /**
   * Register a new user
   * @param {Object} userData { name, email, phone, password }
   */
  register: async (userData) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.REGISTER, userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Login user
   * @param {Object} credentials { email, password }
   */
  login: async (credentials) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.LOGIN, credentials);
      // console.log("login response ", response)
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Identity is extracted from JWT token payload, /user method removed.

  /**
   * Update user profile
   * @param {Object} userData { name, phone, password }
   */
  updateProfile: async (userData) => {
    try {
      const response = await apiClient.put(API_ENDPOINTS.UPDATE_USER, userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Forgot password
   * @param {string} email
   */
  forgotPassword: async (email) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.FORGOT_PASSWORD, {
        email,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Reset password
   * @param {string} id - Reset token/ID
   * @param {Object} data { password }
   */
  resetPassword: async (id, data) => {
    try {
      const response = await apiClient.post(
        API_ENDPOINTS.RESET_PASSWORD(id),
        data,
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get all customers (Admin only)
   */
  getAdminCustomers: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.GET_ADMIN_CUSTOMERS);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default authService;
