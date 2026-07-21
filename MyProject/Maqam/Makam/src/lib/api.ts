/**
 * API Client for Maquam Holidays
 * 
 * Replaces Supabase client with Axios HTTP client
 */

import axios, { AxiosInstance, AxiosError } from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
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
  (response) => response.data as any,
  (error: AxiosError<any>) => {
    if (error.response) {
      // Server responded with error
      const message = error.response.data?.error || error.response.data?.message || 'An error occurred';

      // Handle 401 Unauthorized
      if (error.response.status === 401) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }

      return Promise.reject(new Error(message));
    } else if (error.request) {
      // Request made but no response
      return Promise.reject(new Error('No response from server'));
    } else {
      // Error setting up request
      return Promise.reject(new Error(error.message));
    }
  }
);

// ============================================
// Authentication API
// ============================================

export const authAPI = {
  /**
   * Register new user
   */
  register: async (data: {
    email: string;
    password: string;
    username: string;
    full_name?: string;
    phone?: string;
    role?: 'user' | 'hotelier';
  }): Promise<any> => {
    const response: any = await apiClient.post('/auth/register', data);
    if (response.token) {
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    return response;
  },

  /**
   * Login user
   */
  login: async (email: string, password: string): Promise<any> => {
    const response: any = await apiClient.post('/auth/login', { email, password });
    if (response.token) {
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    return response;
  },

  /**
   * Logout user
   */
  logout: async () => {
    await apiClient.post('/auth/logout');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  },

  /**
   * Get current user
   */
  getCurrentUser: async () => {
    return apiClient.get('/auth/me');
  },

  /**
   * Update profile
   */
  updateProfile: async (data: {
    full_name?: string;
    phone?: string;
    avatar_url?: string;
  }) => {
    return apiClient.put('/auth/profile', data);
  },

  /**
   * Change password
   */
  changePassword: async (current_password: string, new_password: string) => {
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
  /**
   * Get all hotels with filters
   */
  getHotels: async (params?: {
    city?: string;
    location?: string;
    min_price?: number;
    max_price?: number;
    star_rating?: number;
    prayer_facilities?: boolean;
    halal_food?: boolean;
    search?: string;
    page?: number;
    limit?: number;
  }) => {
    return apiClient.get('/hotels', { params });
  },

  /**
   * Get hotel by ID
   */
  getHotelById: async (id: string) => {
    return apiClient.get(`/hotels/${id}`);
  },

  /**
   * Create new hotel
   */
  createHotel: async (data: any) => {
    return apiClient.post('/hotels', data);
  },

  /**
   * Update hotel
   */
  updateHotel: async (id: string, data: any) => {
    return apiClient.put(`/hotels/${id}`, data);
  },

  /**
   * Delete hotel
   */
  deleteHotel: async (id: string) => {
    return apiClient.delete(`/hotels/${id}`);
  },

  /**
   * Get my hotels (hotelier)
   */
  getMyHotels: async () => {
    return apiClient.get('/hotels/my/hotels');
  },

  /**
   * Verify hotel (admin)
   */
  verifyHotel: async (id: string) => {
    return apiClient.put(`/hotels/${id}/verify`);
  },
};

// ============================================
// Bookings API
// ============================================

export const bookingsAPI = {
  /**
   * Create new booking
   */
  createBooking: async (data: {
    hotel_id: string;
    check_in_date: string;
    check_out_date: string;
    guests: number;
    room_type: string;
    guest_name?: string;
    guest_email?: string;
    guest_phone?: string;
    special_requests?: string;
  }) => {
    return apiClient.post('/bookings', data);
  },

  /**
   * Verify Razorpay payment
   */
  verifyPayment: async (data: {
    razorpay_payment_id: string;
    razorpay_order_id?: string;
    razorpay_signature?: string;
    booking_id: string;
  }) => {
    return apiClient.post('/bookings/verify-payment', data);
  },

  /**
   * Get my bookings
   */
  getMyBookings: async () => {
    return apiClient.get('/bookings/my/bookings');
  },

  /**
   * Get booking by ID
   */
  getBookingById: async (id: string) => {
    return apiClient.get(`/bookings/${id}`);
  },

  /**
   * Cancel booking
   */
  cancelBooking: async (id: string) => {
    return apiClient.put(`/bookings/${id}/cancel`);
  },

  /**
   * Get all bookings (admin)
   */
  getAllBookings: async (params?: {
    status?: string;
    payment_status?: string;
    page?: number;
    limit?: number;
  }) => {
    return apiClient.get('/bookings/admin/all', { params });
  },

  /**
   * Get hotelier bookings
   */
  getHotelierBookings: async () => {
    return apiClient.get('/bookings/hotelier/bookings');
  },

  /**
   * Update booking status (internal use)
   */
  updateBookingStatus: async (id: string, data: {
    status?: string;
    payment_id?: string;
    payment_status?: string;
    paid_at?: string;
  }) => {
    return apiClient.put(`/bookings/${id}/status`, data);
  },

  /**
   * Initiate PayPal Payment
   */
  initiatePayPalPayment: async (bookingId: string) => {
    return apiClient.post(`/bookings/${bookingId}/paypal/init`);
  },

  /**
   * Confirm PayPal Payment
   */
  confirmPayPalPayment: async (data: { bookingId: string; orderId: string }) => {
    return apiClient.post('/bookings/paypal/confirm', data);
  },
};

// ============================================
// Amadeus API
// ============================================

export const amadeusApi = {
    /**
     * Search Airports (Cities) by keyword
     */
    searchAirports: async (keyword: string) => {
      return apiClient.get('/amadeus/flights/airport', { params: { keyword } });
    },
  /**
   * Search Flights
   */
  searchFlights: async (params: {
    origin: string;
    destination: string;
    date: string;
    adults?: number
  }) => {
    return apiClient.get('/amadeus/flights/search', { params });
  },

  /**
   * Search Hotels (Amadeus)
   */
  searchHotels: async (cityCode: string) => {
    return apiClient.get('/amadeus/hotels/search', { params: { cityCode } });
  },
};

// ============================================
// Upload API (VaisBucket)
// ============================================

export const uploadApi = {
  /**
   * Upload file
   */
  uploadFile: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    // The backend route is /api/upload which maps to uploadRoutes
    return apiClient.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  /**
   * Delete file
   */
  deleteFile: async (fileId: string) => {
    return apiClient.delete(`/upload/${fileId}`);
  },
};

// ============================================
// Helper Functions
// ============================================

/**
 * Get stored user
 */
export const getStoredUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

/**
 * Get stored token
 */
export const getStoredToken = () => {
  return localStorage.getItem('auth_token');
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
  return !!getStoredToken();
};

/**
 * Check if user has role
 */
export const hasRole = (role: string) => {
  const user = getStoredUser();
  return user?.role === role;
};

// Export default API client
export default apiClient;
