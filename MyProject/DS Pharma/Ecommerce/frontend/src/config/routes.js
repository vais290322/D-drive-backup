// Route Configuration
// ============================================================
// Centralized route definitions

export const ROUTES = {
  // Public Routes
  HOME: "/",
  PRODUCTS: "/products",
  PRODUCT_DETAILS: "/product/:id",
  ALL_PRODUCTS: "/shop", // All products with filters
  ABOUT: "/about",
  CONTACT: "/contact",

  // User Routes
  LOGIN: "/login",
  REGISTER: "/register",
  USER_PROFILE: "/profile",

  // Shopping Routes
  CART: "/cart",
  CHECKOUT: "/checkout",

  // Order Routes
  ORDERS: "/orders",
  ORDER_DETAILS: "/orders/:id",

  // Admin Routes (if applicable)
  ADMIN_DASHBOARD: "/admin/dashboard",
  ADMIN_PRODUCTS: "/admin/products",
  ADMIN_ORDERS: "/admin/orders",
  ADMIN_ANNOUNCEMENTS: "/admin/announcements",
};

// Get route path with parameters
export const getRoute = (routeKey, params = {}) => {
  let route = ROUTES[routeKey];
  Object.keys(params).forEach((key) => {
    route = route.replace(`:${key}`, params[key]);
  });
  return route;
};
