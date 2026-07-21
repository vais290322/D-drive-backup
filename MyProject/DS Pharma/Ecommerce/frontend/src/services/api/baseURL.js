// API Base Configuration
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://192.168.0.123:5000";



export const API_ENDPOINTS = {
  // Products (Generic - Admin)
  PRODUCTS: "product",
  PRODUCT_BY_ID: (id) => `product/${id}`, 
  PRODUCT_ALL: "product",

  // Products (User-Facing - New Backend APIs)
  PRODUCT_USER_SEARCH: "productusersearch",
  PRODUCT_USER_CATEGORY: (categoryName) =>
    `productusercategory/${encodeURIComponent(categoryName)}`,
  PRODUCT_BY_ID_USER: (id) => `productbyid/${id}`,
  FILTER_PRODUCTS: "getfilterproduct",

  // Categories (Live Backend API)
  CATEGORIES: "category",
  CATEGORY_BY_ID: (id) => `category/${id}`,
  CATEGORY_CREATE: "category",
  CATEGORY_UPDATE: (id) => `category/${id}`,
  CATEGORY_DELETE: (id) => `category/${id}`,
  CATEGORY_PRODUCTS: (id) => `category/${id}/products`,

  // Featured Products
  FEATURED_ADD: "featured",
  FEATURED_GET: "featured",
  FEATURED_DELETE: (id) => `featured/${id}`,

  // Cart
  CART: "cart",
  CART_ADD: "cart/add",
  CART_UPDATE: "cart/update",
  CART_REMOVE: "cart/remove",

  // Orders
  ORDERS: "orders",
  ORDER_BY_ID: (id) => `orders/${id}`,
  CREATE_ORDER: "orders/create",

  // Auth
  LOGIN: "login",
  REGISTER: "register",
  LOGOUT: "logout",
  UPDATE_USER: "updateuser",
  FORGOT_PASSWORD: "forgotpassword",
  RESET_PASSWORD: (id) => `resetpassword/${id}`,
  GET_ADMIN_CUSTOMERS: "getadmincustomer",

  // Payments
  PAYMENTS: "payments",
  INITIATE_PAYMENT: "payments/initiate",
  VERIFY_PAYMENT: "payments/verify",

  // Search
  SEARCH: "search",
  SEARCH_SUGGEST: "search/suggest",

  // Content
  BANNERS: "content/banners",
  REVIEWS: "reviews",
  PRODUCT_REVIEWS: (id) => `products/${id}/reviews`,

  // Addresses
  ADDRESSES: "addresses",
  ADDRESS_DETAILS: (id) => `addresses/${id}`,
  ADD_ADDRESS: "addresses",
  UPDATE_ADDRESS: (id) => `addresses/${id}`,
  DELETE_ADDRESS: (id) => `addresses/${id}`,

  // Title / Heading (Marquee System)
  GET_HEADINGS: "getheading",
  GET_HEADING_BY_ID: (id) => `getheadingbyid/${id}`,
  UPDATE_HEADING: (id) => `updateheading/${id}`,
  DELETE_HEADING: (id) => `deleteheading/${id}`,
  ADD_HEADING: "addheading",
};
