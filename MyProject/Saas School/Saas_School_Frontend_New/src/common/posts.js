import api from './api';

// Define the base API URL
// const API_BASE_URL = 'http://localhost:5000/api';
const API_BASE_URL = 'https://collage.vaisacademy.com/schoolfeed/api';

const baseUrl = import.meta.env.VITE_REACT_SERVICE2_URL ;

// export const userUrlApi = `http://192.168.0.158:8089/api/entity`
export const userUrlApi = `${baseUrl}/api/entity`

// Export the posts API endpoints
const postsUrlApi = `${API_BASE_URL}`;

export default postsUrlApi; 