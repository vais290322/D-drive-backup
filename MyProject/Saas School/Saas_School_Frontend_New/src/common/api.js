// api.js
import axios from 'axios';

// const API_URL = 'http://localhost:8086/api';
const API_URL = 'https://collage.vaisacademy.com/schoolfeed/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Remove token interceptor
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error)
);

// Simplify response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export default api;
