import axios from 'axios';
import { userProfileUrl } from '../config/userApi';

// Helper function to get auth token
const getAuthToken = () => {
    return localStorage.getItem('authToken') || sessionStorage.getItem('token');
};

// Helper function to get auth headers
const getAuthHeaders = () => {
    const token = getAuthToken();
    return {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` })
    };
};

// User Profile API functions
export const userProfileService = {
    // GET /user - Fetch user profile data
    getUserProfile: async () => {
        const response = await axios.get(userProfileUrl.getUserProfile, {
            headers: getAuthHeaders()
        });
        return response.data;
    },

    // PUT /updateuser - Update user profile
    updateUserProfile: async (userData) => {
        const payload = {
            name: userData.name,
            email: userData.email,
            phone: userData.phone
        };
        const response = await axios.put(userProfileUrl.updateUserProfile, payload, {
            headers: getAuthHeaders()
        });
        return response.data;
    }
};

export default userProfileService;
