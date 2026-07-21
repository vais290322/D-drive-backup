// Application Configuration
// ============================================================
// App-wide settings and configuration

export const APP_CONFIG = {
  // App Identity
  APP_NAME: 'DS Pharma',
  APP_VERSION: '1.0.0',
  APP_DESCRIPTION: 'Your trusted online pharmacy',

  // API Configuration
  API_BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  API_TIMEOUT: 10000,

  // Pagination
  DEFAULT_PAGE_SIZE: 12,
  MAX_RESULTS_PER_PAGE: 100,

  // Features
  FEATURES: {
    ENABLE_NOTIFICATIONS: true,
    ENABLE_ANALYTICS: true,
    ENABLE_LIVE_CHAT: false,
  },

  // Cache Configuration
  CACHE_DURATION: {
    PRODUCTS: 5 * 60 * 1000, // 5 minutes
    CART: 1 * 60 * 1000, // 1 minute
    USER: 10 * 60 * 1000, // 10 minutes
  },

  // Image Configuration
  IMAGE_CONFIG: {
    PRODUCT_WIDTH: 400,
    PRODUCT_HEIGHT: 400,
    THUMBNAIL_WIDTH: 100,
    THUMBNAIL_HEIGHT: 100,
  },

  // Payment Configuration
  PAYMENT_GATEWAY: 'razorpay',
  MIN_ORDER_VALUE: 100,
  FREE_SHIPPING_THRESHOLD: 500,

  // Contact Information
  CONTACT: {
    EMAIL: 'support@dspharma.com',
    PHONE: '+91-1800-123-4567',
    ADDRESS: 'DS Pharma, India',
  },
};

export default APP_CONFIG;
