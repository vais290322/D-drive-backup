import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useOrderStore = create(
  persist(
    (set, get) => ({
      // State
      orders: [],

      // Actions
      addOrder: (orderData) => {
        const newOrder = {
          id: `ORD${Date.now()}`,
          ...orderData,
          status: "PLACED",
          statusColor: "#10B981",
          statusBg: "#10B981",
          createdAt: new Date().toISOString(),
          expectedDelivery: getExpectedDelivery(),
          timeline: [
            { status: "PLACED", completed: true, active: true },
            { status: "CONFIRMED", completed: false },
            { status: "SHIPPED", completed: false },
            { status: "DELIVERED", completed: false },
          ],
        };

        set((state) => ({
          orders: [newOrder, ...state.orders],
        }));

        return newOrder.id;
      },

      getOrderById: (orderId) => {
        return get().orders.find((order) => order.id === orderId);
      },

      updateOrderStatus: (orderId, status) => {
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === orderId ? { ...order, status } : order
          ),
        }));
      },

      clearOrders: () => set({ orders: [] }),

      // Get all orders
      getAllOrders: () => get().orders,
    }),
    {
      name: "ds-pharma-orders", // localStorage key
      version: 1,
    }
  )
);

// Helper function to calculate expected delivery (5 days from now)
function getExpectedDelivery() {
  const date = new Date();
  date.setDate(date.getDate() + 5);
  const options = { day: "numeric", month: "short", year: "numeric" };
  return date.toLocaleDateString("en-IN", options);
}
