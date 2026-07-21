/**
 * API Client for Maquam Holidays
 * 
 * Axios HTTP client for backend communication
 */

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Send cookies
});

// Request interceptor - Add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      const message = error.response.data?.error || error.response.data?.message || 'An error occurred';

      // Handle 401 Unauthorized
      if (error.response.status === 401) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }

      return Promise.reject(new Error(message));
    } else if (error.request) {
      return Promise.reject(new Error('No response from server'));
    } else {
      return Promise.reject(new Error(error.message));
    }
  }
);

// ============================================
// Authentication API
// ============================================

export const authAPI = {
  register: async (data) => {
    const response = await apiClient.post('/auth/register', data);
    if (response.token) {
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    return response;
  },

  login: async (email, password) => {
    const response = await apiClient.post('/auth/login', { email, password });
    if (response.token) {
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    return response;
  },

  logout: async () => {
    await apiClient.post('/auth/logout');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  },

  getCurrentUser: async () => {
    return apiClient.get('/auth/me');
  },

  updateProfile: async (data) => {
    return apiClient.put('/auth/profile', data);
  },

  changePassword: async (current_password, new_password) => {
    return apiClient.put('/auth/change-password', {
      current_password,
      new_password,
    });
  },
};

// ============================================
// Hotels API
// ============================================

export const hotelsAPI = {
  getHotels: async (params) => {
    return apiClient.get('/amadeus/hotels/search', { params });
  },
  getAllHotels: async () => {
    return apiClient.get('/hotels/all');
  },

  getHotelById: async (id) => {
    return apiClient.get(`/hotels/${id}`);
  },

  createHotel: async (data) => {
    return apiClient.post('/hotels', data);
  },

  updateHotel: async (id, data) => {
    return apiClient.put(`/hotels/${id}`, data);
  },

  deleteHotel: async (id) => {
    return apiClient.delete(`/hotels/${id}`);
  },

  getMyHotels: async () => {
    return apiClient.get('/hotels/my/hotels');
  },

  verifyHotel: async (id) => {
    return apiClient.put(`/hotels/${id}/verify`);
  },
};

// ============================================
// Bookings API
// ============================================

export const bookingsAPI = {
  createBooking: async (data) => {
    return apiClient.post('/bookings', data);
  },

  verifyPayment: async (data) => {
    return apiClient.post('/bookings/verify-payment', data);
  },

  getMyBookings: async () => {
    return apiClient.get('/bookings/my/bookings');
  },

  getBookingById: async (id) => {
    return apiClient.get(`/bookings/${id}`);
  },

  cancelBooking: async (id) => {
    return apiClient.put(`/bookings/${id}/cancel`);
  },

  getAllBookings: async (params) => {
    return apiClient.get('/bookings/admin/all', { params });
  },

  getHotelierBookings: async () => {
    return apiClient.get('/bookings/hotelier/bookings');
  },

  updateBookingStatus: async (id, data) => {
    return apiClient.put(`/bookings/${id}/status`, data);
  },

  initiatePayPalPayment: async (bookingId) => {
    return apiClient.post(`/bookings/${bookingId}/paypal/init`);
  },

  confirmPayPalPayment: async (data) => {
    return apiClient.post('/bookings/paypal/confirm', data);
  },
};

// ============================================
// Amadeus API
// ============================================

export const amadeusApi = {
  searchAirports: async (keyword) => {
    return apiClient.get('/amadeus/flights/airport', { params: { keyword } });
  },

  searchFlights: async (params) => {
    return apiClient.get('/amadeus/flights/search', { params });
  },

  searchHotels: async (cityCode ) => {
    return apiClient.get('/amadeus/hotels/search', { params: { cityCode } });
  },
};

// ============================================
// Upload API (VaisBucket)
// ============================================

export const uploadApi = {
  uploadFile: async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    return apiClient.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  deleteFile: async (fileId) => {
    return apiClient.delete(`/upload/${fileId}`);
  },
};

// ============================================
// Helper Functions
// ============================================

export const getStoredUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

export const getStoredToken = () => {
  return localStorage.getItem('auth_token');
};

export const isAuthenticated = () => {
  return !!getStoredToken();
};

export const hasRole = (role) => {
  const user = getStoredUser();
  return user?.role === role;
};

// Export default API client
export default apiClient;


