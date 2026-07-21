/**
 * User Data for DS Pharma
 * This file contains user-specific data, profiles, and initial state.
 */

// --- Mock Users ---
export const USERS = [
  {
    id: 1,
    name: "Gourav Gupta",
    email: "demo@dspharma.com",
    password: "demo123",
    phone: "+91 9876543210",
    role: "admin",
    profileImage: null, // Profile picture URL or base64
    address: null,
    orders: [],
  },
  {
    id: 2,
    name: "Priya Sharma",
    email: "priya@example.com",
    password: "password123",
    phone: "+91 9876543211",
    role: "user",
    profileImage:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    address: "45 Green Way, Mumbai, 400001",
    orders: [],
  },
];

// --- Mock Orders ---
export const MOCK_ORDERS = [
  {
    id: "964368972",
    productName: "Dolo 650 Tablet 15s",
    customerName: "Priya Sharma",
    customerId: 2,
    phone: "+91 9876543211",
    address: "45 Green Way, Mumbai, 400001",
    status: "PLACED",
    statusColor: "#10B981",
    statusBg: "#10B981",
    expectedDelivery: "20th Dec, 2025",
    image:
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80",
    price: 33.75,
    quantity: 2,
    paymentBreakdown: {
      totalCartValue: 67.5,
      discount: 0,
      coupon: 0,
      gst: 8,
      deliveryCharges: 40,
      total: 115.5,
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    timeline: [
      { status: "PLACED", completed: true, active: true, date: "Today" },
    ],
  },
  {
    id: "964368971",
    productName: "Shelcal 500 Tablet",
    customerName: "Rahul Verma",
    customerId: 3,
    phone: "+91 9876543212",
    address: "78 Lake View, Delhi, 110001",
    status: "CONFIRMED",
    statusColor: "#FF7A59",
    statusBg: "#FF7A59",
    expectedDelivery: "19th Dec, 2025",
    image:
      "https://images.unsplash.com/photo-1628771065518-0d82f1938462?auto=format&fit=crop&w=400&q=80",
    price: 119,
    quantity: 1,
    paymentBreakdown: {
      totalCartValue: 119,
      discount: 10,
      coupon: 0,
      gst: 14,
      deliveryCharges: 40,
      total: 163,
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    timeline: [
      { status: "PLACED", completed: true, active: false, date: "Yesterday" },
      { status: "CONFIRMED", completed: true, active: true, date: "Today" },
    ],
  },
  {
    id: "964368970",
    productName: "Revital H Capsule",
    customerName: "Sarah Jenkins",
    customerId: 4,
    phone: "+91 9876543213",
    address: "90 Beach Road, Goa, 403001",
    status: "SHIPPED",
    statusColor: "#F59E0B",
    statusBg: "#F59E0B",
    expectedDelivery: "18th Dec, 2025",
    image:
      "https://images.unsplash.com/photo-1628771065518-0d82f1938462?auto=format&fit=crop&w=400&q=80",
    price: 310,
    quantity: 1,
    paymentBreakdown: {
      totalCartValue: 310,
      discount: 0,
      coupon: 50,
      gst: 37,
      deliveryCharges: 0,
      total: 297,
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    timeline: [
      { status: "PLACED", completed: true, active: false, date: "11 Dec" },
      { status: "SHIPPED", completed: true, active: true, date: "Yesterday" },
    ],
  },
  {
    id: "964368969",
    productName: "Volini Gel 30g",
    customerName: "Ram Kumar",
    customerId: null,
    phone: "+91 9876543214",
    address: "Sector 15, Chandigarh",
    status: "DELIVERED",
    statusColor: "#059669",
    statusBg: "#059669",
    deliveredDate: "12th Dec, 2025",
    image:
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=400&q=80",
    price: 125,
    quantity: 2,
    paymentBreakdown: {
      totalCartValue: 250,
      discount: 0,
      coupon: 0,
      gst: 30,
      deliveryCharges: 40,
      total: 320,
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    timeline: [
      { status: "DELIVERED", completed: true, active: true, date: "12 Dec" },
    ],
    deliveredAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
  },
  {
    id: "964368968",
    productName: "Accu-Chek Active",
    customerName: "Priya Sharma",
    customerId: 2,
    phone: "+91 9876543211",
    address: "45 Green Way, Mumbai",
    status: "CANCELLED",
    statusColor: "#EF4444",
    statusBg: "#EF4444",
    image:
      "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=400&q=80",
    price: 950,
    quantity: 1,
    paymentBreakdown: {
      totalCartValue: 950,
      discount: 50,
      coupon: 0,
      gst: 114,
      deliveryCharges: 0,
      total: 1014,
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    timeline: [
      { status: "CANCELLED", completed: true, active: true, date: "10 Dec" },
    ],
  },
];

export const INITIAL_USER_STATE = {
  isAuthenticated: false,
  currentUser: null,
  cart: [],
  wishlist: [],
  notifications: [],
  recentSearches: [],
  preferences: {
    darkMode: false,
    emailNotifications: true,
  },
};

export const getUserByEmail = (email) => {
  return USERS.find((u) => u.email === email);
};

export const getUserById = (id) => {
  return USERS.find((u) => u.id === id);
};
