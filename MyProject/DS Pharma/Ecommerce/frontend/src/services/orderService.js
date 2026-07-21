import apiClient from "@/services/api/apiClient";
import { API_ENDPOINTS } from "@/services/api/baseURL";
import mockApi from "@/services/api/mockApi";

const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true" || true;

export const orderService = {
  getOrders: async () => {
    if (USE_MOCK) {
      const orders = await mockApi.getOrders();
      return { data: orders };
    }
    return apiClient.get(API_ENDPOINTS.ORDERS);
  },

  getOrderById: async (id) => {
    if (USE_MOCK) {
      const order = await mockApi.getOrderById(id);
      return { data: order };
    }
    return apiClient.get(API_ENDPOINTS.ORDER_BY_ID(id));
  },

  createOrder: async (orderData) => {
    if (USE_MOCK) {
      return mockApi.placeOrder(orderData);
    }
    return apiClient.post(API_ENDPOINTS.CREATE_ORDER, orderData);
  },

  // Aliases for hooks that use different naming
  fetchOrders: async () => {
    if (USE_MOCK) {
      const orders = await mockApi.getOrders();
      return { data: orders };
    }
    return apiClient.get(API_ENDPOINTS.ORDERS);
  },

  fetchOrderById: async (id) => {
    if (USE_MOCK) {
      const order = await mockApi.getOrderById(id);
      return { data: order };
    }
    return apiClient.get(API_ENDPOINTS.ORDER_BY_ID(id));
  },

  cancelOrder: async (id) => {
    try {
      if (USE_MOCK) {
        const response = await mockApi.updateOrderStatus(id, "CANCELLED");
        return { data: response };
      }
      return apiClient.patch(API_ENDPOINTS.ORDER_STATUS(id), {
        status: "CANCELLED",
      });
    } catch (error) {
      console.error("Cancel Order Error:", error);
      throw error;
    }
  },

  returnOrder: async (id) => {
    try {
      if (USE_MOCK) {
        const response = await mockApi.updateOrderStatus(
          id,
          "RETURN_REQUESTED"
        );
        return { data: response };
      }
      return apiClient.patch(API_ENDPOINTS.ORDER_STATUS(id), {
        status: "RETURN_REQUESTED",
      });
    } catch (error) {
      console.error("Return Order Error:", error);
      throw error;
    }
  },
};

export default orderService;
