import mockApi from "../../api/mockApi";

export const orderService = {
  getOrders: async ({ status, search } = {}) => {
    const orders = await mockApi.getOrders({ status, search });

    // Transform for UI (OrdersList.jsx expects flattened fields)
    return orders.map((o) => ({
      ...o,
      date: o.timeline?.[0]?.date || "N/A",
      customer:
        o.customerName ||
        o.deliveryAddress?.name ||
        o.address?.name ||
        o.customerAddress?.name ||
        "Guest",
      email: o.email || o.deliveryAddress?.email || "demo@dspharma.com", // Mock email usually missing in mock data
      items: o.items
        ? o.items.reduce((sum, item) => sum + (item.quantity || 1), 0)
        : o.quantity || 1,
      total:
        o.totals?.total ||
        o.paymentBreakdown?.total ||
        o.price * (o.quantity || 1),
      payment: o.paymentMethod === "cod" ? "Cash on Delivery" : "Paid",
    }));
  },

  getOrder: async (id) => {
    const order = await mockApi.getOrderById(id);

    // Transformation: Ensure UI receives consistent 'products' array
    // New orders use 'items', legacy use 'products' or flattened fields
    let productsArray = [];

    if (order.items && Array.isArray(order.items)) {
      // New structure (Multi-item)
      productsArray = order.items.map((item) => ({
        name: item.name || item.productName,
        price: item.price,
        qty: item.quantity || 1,
        image: item.image,
        total: item.price * (item.quantity || 1),
      }));
    } else if (order.products && Array.isArray(order.products)) {
      // Legacy structure (if any)
      productsArray = order.products;
    } else {
      // Legacy Single Item Fallback
      productsArray = [
        {
          name: order.productName || "Unknown Product",
          price: order.price || 0,
          qty: order.quantity || 1,
          image: order.image,
          total: (order.price || 0) * (order.quantity || 1),
        },
      ];
    }

    // Return normalized object for Admin UI
    return {
      ...order,
      date:
        order.date ||
        order.timeline?.[0]?.date ||
        new Date().toLocaleDateString(),
      customer:
        order.customerName ||
        order.deliveryAddress?.name ||
        order.address?.name ||
        order.customerAddress?.name ||
        "Guest",
      email: order.deliveryAddress?.email || order.email || "demo@dspharma.com",
      phone: order.deliveryAddress?.phone || order.phone,
      altPhone: order.deliveryAddress?.altPhone || order.altPhone,
      landmark: order.deliveryAddress?.landmark || order.landmark,
      shippingAddress:
        typeof order.deliveryAddress === "object"
          ? `${order.deliveryAddress.address}${
              order.deliveryAddress.landmark
                ? ` (Landmark: ${order.deliveryAddress.landmark})`
                : ""
            }, ${order.deliveryAddress.city || ""}, ${
              order.deliveryAddress.state || ""
            } - ${order.deliveryAddress.pincode || ""}`
          : order.address || order.shippingAddress || "N/A",
      payment:
        order.paymentMethod === "cod" ? "Cash on Delivery" : "Paid Online",
      total:
        order.totals?.total ||
        order.paymentBreakdown?.total ||
        order.price ||
        0,
      products: productsArray,
      totalItems: productsArray.reduce((sum, p) => sum + p.qty, 0),
    };
  },

  updateOrderStatus: async (id, status) => {
    return await mockApi.updateOrderStatus(id, status);
  },
};
