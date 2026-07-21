import apiClient from "@/services/api/apiClient";

export const cartService = {
  /**
   * Add an item to the cart
   * @param {Object} data - { rid, quantity, image } (rid MUST be product rid)
   */
  addToCart: async (data) => {
    if (!data.rid) throw new Error("Product rid is required");

    // Debug logging
    console.log("[cartService] addToCart called with:", data);

    const payload = {
      rid: data.rid,
      quantity: Number(data.quantity) || 1,
      image: data.image || '',
    };

    console.log("[cartService] Sending payload:", payload);

    const response = await apiClient.post("/cartadd", payload);
    console.log("[Cart Service] addToCart response:", response.data);
    return response.data;
  },

  getCart: async () => {
    const response = await apiClient.get("/cartget");
    console.log("[Cart Service] getCart raw response:", response.data);


    const rawItems = response.data?.data || response.data?.items || response.data || [];

    if (!Array.isArray(rawItems)) {
      console.warn("[Cart Service] Unexpected cart response structure:", response.data);
      return [];
    }

    const normalizedItems = rawItems.map(item => {
      const product = item.product || item.productId || {};
      const isPopulated = !!(item.product || item.productId);

      // If populated, use product details, otherwise fall back to item root properties
      const baseDetails = isPopulated ? product : item;

      return {
        _id: item._id, // Cart Item ID (for remove/update)
        id: baseDetails.id || baseDetails._id, // Product ID
        rid: baseDetails.rid || baseDetails.RID || item.rid, // MARG ID
        name: baseDetails.name || item.name || 'Unknown Product',
        image: baseDetails.image || baseDetails.imageUrl || item.image || item.imageUrl,
        price: Number(baseDetails.price) || Number(baseDetails.PRate) || Number(baseDetails.Rate) || Number(item.price) || 0,
        originalPrice: Number(baseDetails.originalPrice) || Number(baseDetails.mrp) || Number(baseDetails.MRP) || undefined,
        quantity: Number(item.quantity) || 1,
        stock: baseDetails.stock !== undefined ? Number(baseDetails.stock) : undefined,
        unit: baseDetails.unit || baseDetails.pack || item.unit || 'piece',
        discount: baseDetails.discount || item.discount || 0
      };
    });

    console.log("[Cart Service] Normalized items:", normalizedItems);
    return { data: normalizedItems }; // Return consistent structure matching useCart expectations
  },

  /**
   * Update cart item quantity
   * @param {string} id - Cart Item ID
   * @param {number} quantity - New quantity
   */
  updateCartItem: async (id, quantity) => {
    const response = await apiClient.put(`/cartupdate/${id}`, { quantity });
    return response.data;
  },

  /**
   * Remove an item from the cart
   * @param {string} id - Cart Item ID
   */
  removeFromCart: async (id) => {
    const response = await apiClient.delete(`/cartdelete/${id}`);
    return response.data;
  },
};
