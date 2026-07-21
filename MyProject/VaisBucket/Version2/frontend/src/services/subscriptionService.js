import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://apibucket.vais.co.in/api/v1';

const getAuthHeader = () => {
    const token = localStorage.getItem('accessToken'); // Or however you store it. Actually AuthContext usually handles axios interceptors?
    // Assuming axios interceptor is NOT set up globally for all requests in this file, or using the global axios instance if available.
    // If the project uses a global axios instance with interceptors, I should use that.
    // Checking previous files... I didn't see a global axios setup file in the viewed files.
    // I will assume standard axios + withCredentials for cookies, or header if token usage.
    // The backend uses cookies (accessToken), so `withCredentials: true` is important.
    return {
        withCredentials: true
    };
};

export const createSubscriptionOrder = async (plan, billingCycle, billingDetails) => {
    try {
        const response = await axios.post(`${API_URL}/subscription/order`, { plan, billingCycle, billingDetails }, getAuthHeader());
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const verifySubscriptionPayment = async (paymentData) => {
    try {
        const response = await axios.post(`${API_URL}/subscription/verify`, paymentData, getAuthHeader());
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const getSystemSettings = async () => {
    try {
        const response = await axios.get(`${API_URL}/admin/settings`, getAuthHeader()); // Admin route? Or maybe public route for signup mode?
        // Wait, toggleSignupMode is admin protected. User needs to know if signup is plan based.
        // I should probably make a public endpoint for "public settings".
        // For now, let's assume I need to fix backend to allow public access to check signup mode?
        // Or users just try to signup and fail? No, UX needs to know.
        // I'll skip this for now and rely on manual check or protected route if admin.
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// We need a public endpoint for settings.
// ... (previous code)

export const getPublicConfig = async () => {
    try {
        const response = await axios.get(`${API_URL}/auth/settings`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};
export const getMyTransactions = async () => {
    try {
        const response = await axios.get(`${API_URL}/subscription/my-transactions`, getAuthHeader());
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const downloadInvoice = async (transactionId) => {
    try {
        const response = await axios.get(`${API_URL}/subscription/invoice/${transactionId}`, {
            ...getAuthHeader(),
            responseType: 'blob'
        });

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `invoice_${transactionId}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
    } catch (error) {
        throw error.response?.data || error.message;
    }
};
