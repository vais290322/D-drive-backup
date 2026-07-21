import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCartStore = create(
  persist(
    (set, get) => ({
      // State
      items: [],

      // Actions
      addItem: (product, quantity = 1) => {
        set((state) => {
          // Validate product data
          if (!product) return state;
          
          // Use 'rid' as the primary identifier if available, otherwise fallback to id/_id
          const productId = product.rid || product.id || product._id;
          
          // Validate required fields
          if (!productId) {
            console.warn("[CartStore] Product missing required ID field");
            return state;
          }
          
          const existingItem = state.items.find(
            (item) => (item.rid || item.id || item._id) === productId,
          );

          if (existingItem) {
            // Check stock if available
            const newQuantity = existingItem.quantity + quantity;
            if (product.stock !== undefined && newQuantity > product.stock) {
              // Could show toast notification about stock limit
              return state; // Prevent adding more than stock
            }

            return {
              items: state.items.map((item) =>
                (item.rid || item.id || item._id) === productId
                  ? { ...item, quantity: newQuantity }
                  : item,
              ),
            };
          }

          // Normalize product data before adding to cart
          const normalizedProduct = {
            id: productId,
            rid: product.rid,
            name: product.name || 'Unnamed Product',
            price: Number(product.price) || Number(product.PRate) || Number(product.Rate) || 0,
            originalPrice: Number(product.originalPrice) || Number(product.mrp) || Number(product.MRP) || undefined,
            image: product.image || product.imageUrl || undefined,
            stock: product.stock,
            discount: product.discount,
            unit: product.unit || product.pack || 'piece',
            quantity: quantity,
          };

          return {
            items: [...state.items, normalizedProduct],
          };
        });
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter(
            (item) => (item.rid || item.id || item._id) !== productId,
          ),
        }));
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            (item.rid || item.id || item._id) === productId
              ? { ...item, quantity }
              : item,
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      syncLocalStorageToBackend: async (cartService) => {
        const items = get().items;
        if (!items || items.length === 0) return;

        try {
          // Sequentially add all local items to the backend
          for (const item of items) {
            const rid = item.rid || item.id || item._id;

            await cartService.addToCart({
              rid: rid,
              quantity: item.quantity,
            });
          }
          // Clear local storage after successful sync
          get().clearCart();
        } catch (error) {
          console.error("[CartStore] Sync failed:", error);
        }
      },

      // Method to sync data from API (used when authenticated)
      setData: (items) => {
        const validItems = Array.isArray(items) ? items : [];
        set({ items: validItems });
      },

      // Computed values (getters)
      getTotalItems: () => {
        const items = get().items;
        return Array.isArray(items)
          ? items.reduce((total, item) => total + item.quantity, 0)
          : 0;
      },

      getTotalPrice: () => {
        const items = get().items;
        return Array.isArray(items)
          ? items.reduce((total, item) => {
              const price = item.price || item.PRate || item.Rate || 0;
              return total + Number(price) * item.quantity;
            }, 0)
          : 0;
      },

      getItemQuantity: (productId) => {
        const items = get().items;
        if (!Array.isArray(items)) return 0;
        const item = items.find(
          (item) => (item.rid || item.id || item._id) === productId,
        );
        return item ? item.quantity : 0;
      },
    }),
    {
      name: "ds-pharma-cart-v2", // Updated key to bypass corrupted data
      version: 1,
    },
  ),
);
