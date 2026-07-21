import { MOCK_ORDERS } from "../data/userData.js";
import { mockCartService } from "./mockCartService";

// Initialize orders from localStorage or default to MOCK_ORDERS
const initializeOrders = () => {
  const stored = localStorage.getItem("ds-pharma-orders-db");
  if (stored) {
    return JSON.parse(stored);
  }
  return [...MOCK_ORDERS];
};

let orders = initializeOrders();

const saveOrders = () => {
  localStorage.setItem("ds-pharma-orders-db", JSON.stringify(orders));
};

// Simulate API delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockOrderService = {
  getOrders: async () => {
    await delay(500);
    return { data: orders };
  },

  getOrderById: async (id) => {
    await delay(300);
    const order = orders.find((o) => o.id === id);
    if (!order) throw new Error("Order not found");
    return { data: order };
  },

  createOrder: async (orderData) => {
    await delay(800);
    const newOrder = {
      id: `ORD-${Math.floor(Math.random() * 100000)}`,
      date: new Date().toISOString(),
      status: "PLACED",
      ...orderData,
      timeline: [
        {
          status: "PLACED",
          date: new Date().toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }),
          completed: true,
          active: true,
        },
        { status: "CONFIRMED", date: "", completed: false, active: false },
        {
          status: "SHIPPED",
          date: "Within 5 days",
          completed: false,
          active: false,
        },
        { status: "DELIVERED", date: "", completed: false, active: false },
      ],
    };
    orders.unshift(newOrder); // Add to beginning
    saveOrders(); // Persist to storage

    // Clear the cart on the "server side"
    await mockCartService.clearCart();

    return { data: newOrder };
  },
};
