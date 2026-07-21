const axios = require('axios');
const ShiprocketToken = require('../models/ShiprocketToken');

const BASE_URL = 'https://apiv2.shiprocket.in/v1/external';

// Get a valid token or generate a new one if expired
const getToken = async () => {
  try {
    // Check if we have a valid token in the database
    const tokenDoc = await ShiprocketToken.findOne({
      expiresAt: { $gt: new Date() }
    }).sort({ expiresAt: -1 });

    if (tokenDoc) {
      return tokenDoc.token;
    }

    // If no valid token, generate a new one
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      email: process.env.SHIPROCKET_EMAIL,
      password: process.env.SHIPROCKET_PASSWORD
    });

    const token = response.data.token;
    
    // Calculate expiry (10 days from now)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 10);

    // Save the new token
    await ShiprocketToken.create({
      token,
      expiresAt
    });

    return token;
  } catch (error) {
    console.error('Error getting Shiprocket token:', error);
    throw new Error('Failed to authenticate with Shiprocket');
  }
};

// Check serviceability
const checkServiceability = async (pickup_postcode, delivery_postcode, weight, cod = 0) => {
  try {
    const token = await getToken();
    console.log("token : ",token);
    
    // Convert cod to boolean as required by Shiprocket API
    // If cod is any positive number, set it to true, otherwise false
    const codValue = cod > 0 ? true : false;
    
    const response = await axios.get(`${BASE_URL}/courier/serviceability`, {
      params: {
        pickup_postcode,
        delivery_postcode,
        weight,
        cod: true,
        qc_check: 1
      },
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error checking serviceability:', error);
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      throw new Error(`Shiprocket API error: ${error.response.data.message || 'Unknown error'}`);
    } else if (error.request) {
      // The request was made but no response was received
      throw new Error('No response received from Shiprocket API');
    } else {
      // Something happened in setting up the request that triggered an Error
      throw new Error(`Error setting up request: ${error.message}`);
    }
  }
};

// Create order
const createOrder = async (orderData) => {
  try {
    const token = await getToken();
    const response = await axios.post(`${BASE_URL}/orders/create/adhoc`, orderData, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

// Assign AWB to order
const assignAWB = async (shipmentId, courierId) => {
  try {
    const token = await getToken();
    const response = await axios.post(`${BASE_URL}/courier/assign/awb`, {
      shipment_id: shipmentId,
      courier_id: courierId
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error assigning AWB:', error);
    throw error;
  }
};

// Generate pickup
const generatePickup = async (shipmentId) => {
  try {
    const token = await getToken();
    const response = await axios.post(`${BASE_URL}/courier/generate/pickup`, {
      shipment_id: shipmentId
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error generating pickup:', error);
    throw error;
  }
};

// Generate manifest
const generateManifest = async (shipmentId) => {
  try {
    const token = await getToken();
    const response = await axios.post(`${BASE_URL}/manifests/generate`, {
      shipment_id: shipmentId
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error generating manifest:', error);
    throw error;
  }
};

// Print manifest
const printManifest = async (manifestId) => {
  try {
    const token = await getToken();
    const response = await axios.post(`${BASE_URL}/manifests/print`, {
      manifest_id: manifestId
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error printing manifest:', error);
    throw error;
  }
};

// Generate label
const generateLabel = async (shipmentId) => {
  try {
    const token = await getToken();
    const response = await axios.post(`${BASE_URL}/courier/generate/label`, {
      shipment_id: shipmentId
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error generating label:', error);
    throw error;
  }
};

// Print invoice
const printInvoice = async (orderId) => {
  try {
    const token = await getToken();
    const response = await axios.post(`${BASE_URL}/orders/print/invoice`, {
      ids: [orderId]
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error printing invoice:', error);
    throw error;
  }
};

// Track shipment
const trackShipment = async (awbCode) => {
  try {
    const token = await getToken();
    const response = await axios.get(`${BASE_URL}/courier/track/awb/${awbCode}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error tracking shipment:', error);
    throw error;
  }
};

module.exports = {
  getToken,
  checkServiceability,
  createOrder,
  assignAWB,
  generatePickup,
  generateManifest,
  printManifest,
  generateLabel,
  printInvoice,
  trackShipment
};