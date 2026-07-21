import { PRODUCTS } from "../data/sampleData.js";

// Initialize cart with sample data if empty (for demo purposes)
const initializeCart = () => {
  const stored = localStorage.getItem("ds-pharma-cart-db");

  if (!stored || stored === "[]") {
    // Pre-populate with some sample items for demo
    const sampleCartItems = [
      {
        ...PRODUCTS[0], // Dolo 650
        quantity: 2,
      },
      {
        ...PRODUCTS[11], // Becosules
        quantity: 1,
      },
      {
        ...PRODUCTS[21], // Glycomet 500
        quantity: 1,
      },
    ];
    localStorage.setItem("ds-pharma-cart-db", JSON.stringify(sampleCartItems));
    return sampleCartItems;
  }

  try {
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  // eslint-disable-next-line no-unused-vars
  } catch (e) {
    return [];
  }
};

// Initial cart with sample data
let cart = initializeCart();

const saveCart = () => {
  localStorage.setItem("ds-pharma-cart-db", JSON.stringify(cart));
};

// Simulate API delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockCartService = {
  getCart: async () => {
    await delay(300);
    return { data: cart };
  },

  addToCart: async (item) => {
    await delay(300);
    const existingItem = cart.find((i) => i.id === item.id);
    if (existingItem) {
      existingItem.quantity += item.quantity || 1;
    } else {
      cart.push({ ...item, quantity: item.quantity || 1 });
    }
    saveCart();
    return { data: cart };
  },

  updateCartItem: async (itemId, quantity) => {
    await delay(300);
    const item = cart.find((i) => i.id === itemId);
    if (item) {
      item.quantity = quantity;
      saveCart();
    }
    return { data: cart };
  },

  removeFromCart: async (itemId) => {
    await delay(300);
    cart = cart.filter((i) => i.id !== itemId);
    saveCart();
    return { data: cart };
  },

  clearCart: async () => {
    await delay(300);
    cart = [];
    saveCart();
    return { data: [] };
  },
};
