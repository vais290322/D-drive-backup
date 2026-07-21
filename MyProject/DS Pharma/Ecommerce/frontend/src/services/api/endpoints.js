export const ENDPOINTS = {
  // Products
  PRODUCTS: '/products',
  PRODUCT_DETAILS: (id) => `/products/${id}`,
  CATEGORIES: '/categories',
  SEARCH_PRODUCTS: '/products/search',
  
  // Auth
  LOGIN: '/auth/login',
  SIGNUP: '/auth/signup',
  LOGOUT: '/auth/logout',
  REFRESH_TOKEN: '/auth/refresh',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  
  // User
  USER_PROFILE: '/user/profile',
  UPDATE_PROFILE: '/user/profile',
  
  // Cart
  CART: '/cart',
  ADD_TO_CART: '/cart/add',
  UPDATE_CART_ITEM: (itemId) => `/cart/${itemId}`,
  REMOVE_CART_ITEM: (itemId) => `/cart/${itemId}`,
  CLEAR_CART: '/cart/clear',
  
  // Orders
  ORDERS: '/orders',
  ORDER_DETAILS: (id) => `/orders/${id}`,
  CREATE_ORDER: '/orders',
  CANCEL_ORDER: (id) => `/orders/${id}/cancel`,
  
  // Addresses
  ADDRESSES: '/addresses',
  ADDRESS_DETAILS: (id) => `/addresses/${id}`,
  ADD_ADDRESS: '/addresses',
  UPDATE_ADDRESS: (id) => `/addresses/${id}`,
  DELETE_ADDRESS: (id) => `/addresses/${id}`,
};
