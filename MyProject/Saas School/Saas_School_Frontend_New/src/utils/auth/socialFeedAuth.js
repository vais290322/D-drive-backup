import api from '../../common/api';
import { setToken } from './authSlice';
import { initializeSocket } from '../socket';

/**
 * Initialize the social feed authentication using existing user data
 * @param {Object} user - User object from Redux store
 * @param {Array} userDetails - User details from Redux store
 * @param {String} schoolId - School ID from Redux store
 * @param {Function} dispatch - Redux dispatch function
 * @returns {Promise<boolean>} - Whether initialization was successful
 */
export const initializeSocialFeed = async (user, userDetails, schoolId, dispatch) => {
    try {
        if (!user || !schoolId) {
            console.error('Missing user data or school ID');
            return false;
        }

        // Get or generate token for social feed
        const response = await api.post('/auth/social-feed-token', {
            userId: user.id || user._id,
            role: user.role,
            schoolId: schoolId
        });

        if (response.data.success && response.data.token) {
            // Set token in Redux store
            dispatch(setToken(response.data.token));
            
            // Initialize socket connection
            initializeSocket(response.data.token, dispatch);
            
            return true;
        }
        
        return false;
    } catch (error) {
        console.error('Failed to initialize social feed:', error);
        return false;
    }
};