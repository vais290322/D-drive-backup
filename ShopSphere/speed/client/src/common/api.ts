interface ApiEndpoints {
  signup: string;
  login: string;
  getUserDetails: string;
  logout: string;
  forgotPassword: string;
  resetPassword: string;
  addCategory?: string;
  addSubCategory?: string;
  addProduct?: string,
  allUsers?: string,
  addStaff?: string,
  allStaff?: string,
  updateStaff?: string,
  deleteStaff?: string,
  addStoreProfile?: string,
  updateStoreProfile?: string,
  fetchStoreProfile?: string,
  fetchOrders?: string,
  productsByCategory?: string,
  productsBySubCategory?: string,
  addCart?: string,
  fetchCart?: string,
  updateCart?: string,
  deleteCart?: string,
  clearAllCart?: string,
  checkout?: string
}

const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:8082';

const summaryApi: ApiEndpoints = {
    signup: `${BASE_URL}/api/v1/auth/users/register`,
    login: `${BASE_URL}/api/v1/auth/users/login`,
    getUserDetails: `${BASE_URL}/api/v1/auth/users/me`,
    logout: `${BASE_URL}/api/v1/auth/users/logout`,
    forgotPassword: `${BASE_URL}/api/v1/auth/users/forgot-password`,
    resetPassword: `${BASE_URL}/api/v1/auth/users/reset-password`,
    allUsers: `${BASE_URL}/api/v1/auth/users`,

    // product category
    addCategory: `${BASE_URL}/api/v1/category`,
    addSubCategory: `${BASE_URL}/api/v1/subcategories`,

    // add product 
    addProduct: `${BASE_URL}/api/products`,
    productsByCategory: `${BASE_URL}/api/products/category`,
    productsBySubCategory: `${BASE_URL}/api/products/subcategory`,

    // staff management

    addStaff: `${BASE_URL}/api/v1/staff/add`,
    allStaff: `${BASE_URL}/api/v1/staff/all`,
    updateStaff: `${BASE_URL}/api/v1/staff/update`,
    deleteStaff: `${BASE_URL}/api/v1/staff/delete`,

    // store setting : store profile

    addStoreProfile: `${BASE_URL}/api/v1/store/add`,
    updateStoreProfile: `${BASE_URL}/api/v1/store/update`,
    fetchStoreProfile: `${BASE_URL}/api/v1/store/all`,

    // orders management

    fetchOrders: `${BASE_URL}/api/v1/orders`,

    // cart sectioin 

    addCart: `${BASE_URL}/api/v1/cart/add`, // /userId/ProductId
    fetchCart: `${BASE_URL}/api/v1/cart`,  // /userId
    updateCart: `${BASE_URL}/api/v1/cart/update`, // /userId
    deleteCart: `${BASE_URL}/api/v1/cart/remove`, // /userId/productId
    clearAllCart: `${BASE_URL}/api/v1/cart/clear`, // /userId


}

export default summaryApi;