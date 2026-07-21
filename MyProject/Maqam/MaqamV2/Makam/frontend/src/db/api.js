/**
 * Legacy Supabase API - Deprecated
 * 
 * This file is kept for backward compatibility.
 * All functionality has been migrated to MongoDB backend.
 * Please use @/lib/api for new implementations.
 */

// Placeholder exports to prevent import errors
export const flightsApi = {
  search: async (filters) => ({ data: [], error: null }),
  getById: async (id) => ({ data: null, error: null }),
  getAll: async () => ({ data: [], error: null }),
};

export const hotelsApi = {
  search: async (filters) => ({ data: [], error: null }),
  getById: async (id) => ({ data: null, error: null }),
  create: async (data) => ({ data: null, error: null }),
  update: async (id, data) => ({ data: null, error: null }),
  delete: async (id) => ({ data: null, error: null }),
  getByCity: async (city) => ({ data: [], error: null }),
};

export const packagesApi = {
  getAll: async () => ({ data: [], error: null }),
  getById: async (id) => ({ data: null, error: null }),
  search: async (filters) => ({ data: [], error: null }),
  getFeatured: async () => ({ data: [], error: null }),
};

export const bookingsApi = {
  create: async (data) => ({ data: null, error: null }),
  getById: async (id) => ({ data: null, error: null }),
  getMyBookings: async () => ({ data: [], error: null }),
  getUserBookings: async (userId) => ({ data: [], error: null }),
  cancel: async (id) => ({ data: null, error: null }),
  verifyPayment: async (data) => ({ verified: false }),
  updateBookingStatus: async (id, status) => ({ data: null, error: null }),
};

export const ordersApi = {
  getMyOrders: async () => ({ data: [], error: null }),
  getUserOrders: async (userId) => ({ data: [], error: null }),
  getById: async (id) => ({ data: null, error: null }),
};

export const paymentApi = {
  createOrder: async (data) => ({ data: null, error: null }),
  verifyPayment: async (data) => ({ data: null, error: null }),
  createCheckoutSession: async (data) => ({ id: null, error: null }),
};

export const adminApi = {
  getStats: async () => ({ data: null, error: null }),
  getAnalytics: async () => ({ data: null, error: null }),
  getUsers: async () => ({ data: [], error: null }),
  getAllUsers: async () => [], // Returns array directly for compatibility
  updateUser: async (id, data) => ({ data: null, error: null }),
  deleteFlight: async (id) => ({ data: null, error: null }),
  getBookings: async () => ({ data: [], error: null }),
  getHotels: async () => ({ data: [], error: null }),
  verifyHotel: async (id) => ({ data: null, error: null }),
  getAllFlights: async () => [],
  createFlight: async (data) => ({ data: null, error: null }),
  updateFlight: async (id, data) => ({ data: null, error: null }),
};

export const profileApi = {
  getProfile: async () => ({ data: null, error: null }),
  updateProfile: async () => ({ data: null, error: null }),
};

export const blogApi = {
  getPosts: async () => ({ data: [], error: null }),
  getPostBySlug: async () => ({ data: null, error: null }),
};

export const resourcesApi = {
  getResources: async () => ({ data: [], error: null }),
  getResourceBySlug: async () => ({ data: null, error: null }),
};

export const contactApi = {
  submit: async () => ({ data: null, error: null }),
};

console.warn('⚠️ Using deprecated Supabase API. Please migrate to MongoDB API (@/lib/api)');
