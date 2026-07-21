import axios from 'axios';
import { userAddressUrl } from '../config/userApi';

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

// Address API functions
export const userAddressService = {
    // GET /address - Fetch all addresses
    getAllAddresses: async () => {
        const response = await axios.get(userAddressUrl.getAllAddresses, {
            headers: getAuthHeaders()
        });
        return response.data;
    },

    // POST /address - Add new address
    addAddress: async (addressData) => {
        const payload = {
            name: addressData.name,
            phone: addressData.phone,
            address: addressData.address,
            city: addressData.city,
            state: addressData.state,
            postalCode: addressData.postalCode || addressData.pincode,
            street: addressData.street || '',
            district: addressData.district || '',
            landmark: addressData.landmark || '',
            isDefault: addressData.isDefault || false
        };
        const response = await axios.post(userAddressUrl.addAddress, payload, {
            headers: getAuthHeaders()
        });
        return response.data;
    },

    // PUT /address/:id - Update address
    updateAddress: async (id, addressData) => {
        const payload = {
            name: addressData.name,
            phone: addressData.phone,
            address: addressData.address,
            city: addressData.city,
            state: addressData.state,
            postalCode: addressData.postalCode || addressData.pincode,
            street: addressData.street || '',
            district: addressData.district || '',
            landmark: addressData.landmark || '',
            isDefault: addressData.isDefault || false
        };
        const response = await axios.put(userAddressUrl.updateAddress(id), payload, {
            headers: getAuthHeaders()
        });
        return response.data;
    },

    // DELETE /address/:id - Delete address
    deleteAddress: async (id) => {
        const response = await axios.delete(userAddressUrl.deleteAddress(id), {
            headers: getAuthHeaders()
        });
        return response.data;
    },

    // Set address as default - Uses dedicated setaddress endpoint
    setDefaultAddress: async (id) => {
        const response = await axios.put(userAddressUrl.setDefaultAddress(id), { isDefault: true }, {
            headers: getAuthHeaders()
        });
        return response.data;
    }
};

export default userAddressService;
