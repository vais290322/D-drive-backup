import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Product API
export const getProducts = () => api.get('/products');
export const getProduct = (id) => api.get(`/products/${id}`);
export const createProduct = (data) => api.post('/products', data);
export const updateProduct = (id, data) => api.put(`/products/${id}`, data);
export const deleteProduct = (id) => api.delete(`/products/${id}`);
export const createDummyProducts = () => api.post('/products/create-dummy');

// Order API
export const getOrders = () => api.get('/orders');
export const getOrder = (id) => api.get(`/orders/${id}`);
export const createOrder = (data) => api.post('/orders', data);
export const updateOrder = (id, data) => api.put(`/orders/${id}`, data);
export const deleteOrder = (id) => api.delete(`/orders/${id}`);
export const createDummyOrder = () => api.post('/orders/create-dummy');
export const processShiprocketOrder = (data) => api.post('/orders/process-shiprocket', data);
export const trackShipment = (orderId) => api.get(`/orders/track/${orderId}`);

// Shiprocket API
export const checkServiceability = (params) => api.get('/shiprocket/serviceability', { params });
export const getShiprocketToken = () => api.get('/shiprocket/token');
export const createShiprocketOrder = (data) => api.post('/shiprocket/orders', data);
export const assignAWB = (data) => api.post('/shiprocket/assign-awb', data);
export const generatePickup = (data) => api.post('/shiprocket/generate-pickup', data);
export const generateManifest = (data) => api.post('/shiprocket/generate-manifest', data);
export const printManifest = (data) => api.post('/shiprocket/print-manifest', data);
export const generateLabel = (data) => api.post('/shiprocket/generate-label', data);
export const printInvoice = (data) => api.post('/shiprocket/print-invoice', data);
export const trackShiprocketShipment = (awbCode) => api.get(`/shiprocket/track/${awbCode}`);
export const processCompleteOrder = (data) => api.post('/shiprocket/process-order', data);

export default api;