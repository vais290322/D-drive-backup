/**
 * Legacy Supabase API - Deprecated
 * 
 * This file is kept for backward compatibility.
 * All functionality has been migrated to MongoDB backend.
 * Please use @/lib/api for new implementations.
 */

// Placeholder exports to prevent import errors
export const flightsApi = {
  search: async (_filters?: any) => ({ data: [], error: null }),
  getById: async (_id?: string) => ({ data: null, error: null }),
  getAll: async () => ({ data: [], error: null }),
};

export const hotelsApi = {
  search: async (_filters?: any) => ({ data: [], error: null }),
  getById: async (_id?: string) => ({ data: null, error: null }),
  create: async (_data?: any) => ({ data: null, error: null }),
  update: async (_id?: string, _data?: any) => ({ data: null, error: null }),
  delete: async (_id?: string) => ({ data: null, error: null }),
  getByCity: async (_city?: string) => ({ data: [], error: null }),
};

export const packagesApi = {
  getAll: async () => ({ data: [], error: null }),
  getById: async (_id?: string) => ({ data: null, error: null }),
  search: async (_filters?: any) => ({ data: [], error: null }),
  getFeatured: async () => ({ data: [], error: null }),
};

export const bookingsApi = {
  create: async (_data?: any) => ({ data: null, error: null }),
  getById: async (_id?: string) => ({ data: null, error: null }),
  getMyBookings: async () => ({ data: [], error: null }),
  getUserBookings: async (_userId?: string) => ({ data: [], error: null }),
  cancel: async (_id?: string) => ({ data: null, error: null }),
  verifyPayment: async (_data?: any) => ({ verified: false }),
  updateBookingStatus: async (_id?: string, _status?: string) => ({ data: null, error: null }),
};

export const ordersApi = {
  getMyOrders: async () => ({ data: [], error: null }),
  getUserOrders: async (_userId?: string) => ({ data: [], error: null }),
  getById: async (_id?: string) => ({ data: null, error: null }),
};

export const paymentApi = {
  createOrder: async (_data?: any) => ({ data: null, error: null }),
  verifyPayment: async (_data?: any) => ({ data: null, error: null }),
  createCheckoutSession: async (_data?: any) => ({ id: null, error: null }),
};

export const adminApi = {
  getStats: async () => ({ data: null, error: null }),
  getAnalytics: async () => ({ data: null, error: null }),
  getUsers: async () => ({ data: [], error: null }),
  getAllUsers: async () => [], // Returns array directly for compatibility
  updateUser: async (_id: string, _data: any) => ({ data: null, error: null }),
  deleteFlight: async (_id: string) => ({ data: null, error: null }),
  getBookings: async () => ({ data: [], error: null }),
  getHotels: async () => ({ data: [], error: null }),
  verifyHotel: async (_id: string) => ({ data: null, error: null }),
  getAllFlights: async () => [],
  createFlight: async (_data: any) => ({ data: null, error: null }),
  updateFlight: async (_id: string, _data: any) => ({ data: null, error: null }),
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
