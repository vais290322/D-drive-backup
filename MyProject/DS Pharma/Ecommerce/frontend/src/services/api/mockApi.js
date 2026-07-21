import useDataStore from "@/store/useDataStore";

// Helper to simulate network latency
const delay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockApi = {
  // --- Products ---
  getProducts: async ({
    category,
    limit,
    query,
    minPrice,
    maxPrice,
    inStock,
    isHighlighted,
    isFeatured,
  } = {}) => {
    await delay();
    let products = useDataStore.getState().products;

    // Search Query
    if (query) {
      const lowerQuery = query.toLowerCase().trim();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(lowerQuery) ||
          p.genericName?.toLowerCase().includes(lowerQuery) ||
          p.category?.toLowerCase().includes(lowerQuery)
      );
    }

    // Category Filter
    if (category && category !== "All") {
      const targetCategory = category.toLowerCase().trim();
      products = products.filter(
        (p) => p.category?.toLowerCase().trim() === targetCategory
      );
    }

    // Price Filter
    if (minPrice !== undefined && minPrice !== null) {
      products = products.filter((p) => p.price >= Number(minPrice));
    }
    if (maxPrice !== undefined && maxPrice !== null) {
      products = products.filter((p) => p.price <= Number(maxPrice));
    }

    // Stock Filter
    if (inStock !== undefined && inStock !== null) {
      // if inStock is 'true'/'false' string or boolean
      const stockValue = String(inStock) === "true";
      products = products.filter((p) => !!p.inStock === stockValue);
    }

    // Highlighted / Featured Filter
    if (isHighlighted !== undefined && isHighlighted !== null) {
      const highlightedValue = String(isHighlighted) === "true";
      products = products.filter((p) => !!p.isHighlighted === highlightedValue);
    }

    if (isFeatured !== undefined && isFeatured !== null) {
      const featuredValue = String(isFeatured) === "true";
      products = products.filter((p) => !!p.isFeatured === featuredValue);
    }

    if (limit) {
      products = products.slice(0, limit);
    }

    return { data: products, total: products.length };
  },

  getProductById: async (id) => {
    await delay(300);
    const product = useDataStore.getState().products.find((p) => p.id === id);
    if (!product) throw new Error("Product not found");
    return product;
  },

  createProduct: async (productData) => {
    await delay(800);
    const newProduct = {
      id: "PROD-" + Date.now(),
      rating: 0,
      reviews: 0,
      inStock: true,
      ...productData,
    };
    useDataStore.getState().addProduct(newProduct);
    return newProduct;
  },

  updateProduct: async (id, updates) => {
    await delay(600);
    const currentProduct = useDataStore
      .getState()
      .products.find((p) => p.id === id);
    if (!currentProduct) throw new Error("Product not found");

    const updatedProduct = { ...currentProduct, ...updates };
    useDataStore.getState().updateProduct(updatedProduct);
    return updatedProduct;
  },

  deleteProduct: async (id) => {
    await delay(600);
    useDataStore.getState().deleteProduct(id);
    return true;
  },

  // --- Orders ---
  getOrders: async ({ status, search } = {}) => {
    await delay(400);
    let orders = useDataStore.getState().orders;

    // Status Filter
    if (status && status !== "All") {
      const statusMap = {
        PLACED: ["PLACED", "CONFIRMED"],
        SHIPPED: ["SHIPPED"],
        DELIVERED: ["DELIVERED"],
        CANCELLED: [
          "CANCELLED",
          "RETURN_REQUESTED",
          "RETURN_APPROVED",
          "RETURN_COMPLETED",
        ],
      };
      const validStatuses = statusMap[status] || [status];
      orders = orders.filter((o) => validStatuses.includes(o.status));
    }

    if (search) {
      const lowerSearch = search.toLowerCase();
      orders = orders.filter(
        (o) =>
          o.id.toLowerCase().includes(lowerSearch) ||
          o.customerName?.toLowerCase().includes(lowerSearch)
      );
    }

    return orders;
  },

  getOrderById: async (id) => {
    await delay(300);
    const order = useDataStore.getState().orders.find((o) => o.id === id);
    if (!order) throw new Error("Order not found");
    return order;
  },

  updateOrderStatus: async (id, status) => {
    await delay(500);
    useDataStore.getState().updateOrderStatus(id, status);
    return useDataStore.getState().orders.find((o) => o.id === id);
  },

  placeOrder: async (orderData) => {
    await delay(800);
    const { cart, currentUser } = useDataStore.getState();

    const orderItems =
      orderData.items ||
      cart.map((item) => ({
        id: item.id,
        name: item.name || item.productName,
        productName: item.name || item.productName,
        price: item.price,
        quantity: item.quantity || 1,
        image: item.image || item.imageUrl,
      }));

    if (orderItems.length === 0) {
      throw new Error("No items to order");
    }

    const totals = orderData.totals || {
      totalCartValue: orderItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      ),
      discount: 0,
      coupon: 0,
      gst: Math.round(
        orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0) *
          0.18
      ),
      deliveryCharges: 40,
      total: 0,
    };

    if (!orderData.totals) {
      totals.total =
        totals.totalCartValue -
        totals.discount -
        totals.coupon +
        totals.gst +
        totals.deliveryCharges;
    }

    const newOrder = {
      id: "ORD-" + Date.now(),
      customerName: orderData.customerName || currentUser?.name || "Guest",
      customerId: currentUser?.id || null,
      phone: orderData.phone || currentUser?.phone || "",
      address: orderData.address || currentUser?.address?.street || "N/A",
      deliveryAddress: orderData.deliveryAddress || {
        name: orderData.customerName || currentUser?.name || "Guest",
        phone: orderData.phone || currentUser?.phone || "",
        address: orderData.address || "N/A",
      },
      status: "PLACED",
      statusColor: "#3B82F6",
      date: new Date().toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      expectedDelivery: new Date(
        Date.now() + 5 * 24 * 60 * 60 * 1000
      ).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      items: orderItems,
      totals: totals,
      paymentBreakdown: totals,
      paymentMethod: orderData.paymentMethod || "cod",
      appliedCoupon: orderData.appliedCoupon || null,
      timeline: [
        {
          status: "PLACED",
          completed: true,
          active: true,
          date: new Date().toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }),
        },
      ],
      createdAt: new Date().toISOString(),
    };

    useDataStore.getState().placeOrder(newOrder);

    return { data: newOrder };
  },

  login: async (email, password) => {
    await delay(800);
    const user = useDataStore
      .getState()
      .users.find((u) => u.email === email && u.password === password);
    if (!user) throw new Error("Invalid credentials");

    const token = "mock-jwt-" + Date.now();
    useDataStore.getState().login(user);

    return { user, token };
  },

  getCustomers: async () => {
    await delay(400);
    return useDataStore.getState().users.filter((u) => u.role !== "admin");
  },

  getCustomerById: async (id) => {
    await delay(300);
    const user = useDataStore
      .getState()
      .users.find((u) => u.id === id || u.id === parseInt(id));
    if (!user) throw new Error("Customer not found");
    return user;
  },
};

export default mockApi;
