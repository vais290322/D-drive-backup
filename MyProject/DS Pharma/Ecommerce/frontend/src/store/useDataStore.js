import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { VALID_PRODUCTS, BANNERS, CATEGORY_DETAILS } from "../data/sampleData";
import { USERS, MOCK_ORDERS, INITIAL_USER_STATE } from "../data/userData";
import { MOCK_ADDRESSES } from "../data/addressData";

// Unique name for localStorage key
const STORE_NAME = "ds-pharma-store-v5";

const useDataStore = create(
  persist(
    (set) => ({
      // --- Data State ---
      products: VALID_PRODUCTS || [],
      orders: MOCK_ORDERS || [],
      users: USERS || [],
      banners: BANNERS || [],
      categories: CATEGORY_DETAILS || [],
      addresses: MOCK_ADDRESSES || [],

      // --- User Session State ---
      currentUser: null,
      isAuthenticated: false,
      cart: [],
      wishlist: [],
      notifications: [],

      // --- Actions: Addresses ---
      setAddresses: (addresses) => set({ addresses }),
      addAddress: (address) =>
        set((state) => {
          let updatedAddresses = state.addresses;
          if (address.isDefault) {
            updatedAddresses = state.addresses.map((a) => ({
              ...a,
              isDefault: false,
            }));
          }
          const newAddress = {
            ...address,
            id: address.id || `addr-${Date.now()}`,
          };
          return { addresses: [...updatedAddresses, newAddress] };
        }),
      updateAddress: (id, data) =>
        set((state) => {
          let updatedAddresses = state.addresses;
          if (data.isDefault) {
            updatedAddresses = state.addresses.map((a) => ({
              ...a,
              isDefault: false,
            }));
          }
          return {
            addresses: updatedAddresses.map((a) =>
              a.id === id ? { ...a, ...data } : a,
            ),
          };
        }),
      deleteAddress: (id) =>
        set((state) => ({
          addresses: state.addresses.filter((a) => a.id !== id),
        })),

      // --- Actions: Categories ---
      setCategories: (categories) => set({ categories }),
      addCategory: (category) =>
        set((state) => ({
          categories: [
            ...state.categories,
            {
              ...category,
              id: category.id || `cat-${Date.now()}`,
              isVisible:
                category.isVisible !== undefined ? category.isVisible : true,
            },
          ],
        })),
      updateCategory: (id, updates) =>
        set((state) => ({
          categories: state.categories.map((c) =>
            c.id === id ? { ...c, ...updates } : c,
          ),
        })),
      deleteCategory: (id) =>
        set((state) => ({
          categories: state.categories.filter((c) => c.id !== id),
        })),

      // --- Actions: Products ---
      setProducts: (products) => set({ products }),
      updateProduct: (updatedProduct) =>
        set((state) => ({
          products: state.products.map((p) =>
            p.id === updatedProduct.id ? updatedProduct : p,
          ),
        })),
      addProduct: (newProduct) =>
        set((state) => ({
          products: [newProduct, ...state.products],
        })),
      deleteProduct: (productId) =>
        set((state) => ({
          products: state.products.filter((p) => p.id !== productId),
        })),

      // --- Actions: Users ---
      addUser: (newUser) =>
        set((state) => ({
          users: [...state.users, newUser],
        })),

      // --- Actions: Orders ---
      placeOrder: (newOrder) =>
        set((state) => ({
          orders: [newOrder, ...state.orders],
          cart: [], // Clear cart after order
        })),
      updateOrderStatus: (orderId, status) =>
        set((state) => {
          const updatedOrders = state.orders.map((order) => {
            if (order.id === orderId) {
              // Prevent duplicate status updates in timeline
              const statusExists = (order.timeline || []).some(
                (t) => t.status === status,
              );
              let newTimeline = order.timeline || [];

              if (!statusExists) {
                newTimeline = [
                  ...newTimeline,
                  {
                    status: status,
                    completed: true,
                    active: true,
                    date: new Date().toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    }),
                  },
                ];
              }

              // Update active state for all steps
              newTimeline = newTimeline.map((t) => ({
                ...t,
                active: t.status === status,
              }));

              return { ...order, status, timeline: newTimeline };
            }
            return order;
          });
          return { orders: updatedOrders };
        }),

      // --- Actions: Users / Auth ---
      login: (user) =>
        set((state) => {
          // Merge guest cart with user saved cart
          // console.log("user in useDataStore", user)
          const guestCart = state.cart || [];
          const userCart = user.cart || [];

          // Create a Map to handle deduplication and quantity merging efficiently
          const cartMap = new Map();

          // Add user's saved items first
          userCart.forEach((item) => {
            cartMap.set(item.id, { ...item });
          });

          // Merge guest items
          guestCart.forEach((guestItem) => {
            if (cartMap.has(guestItem.id)) {
              const existingItem = cartMap.get(guestItem.id);
              existingItem.quantity =
                (existingItem.quantity || 1) + (guestItem.quantity || 1);
            } else {
              cartMap.set(guestItem.id, { ...guestItem });
            }
          });

          // Optional: Also merge wishlist
          const guestWishlist = state.wishlist || [];
          const userWishlist = user.wishlist || [];
          const mergedWishlist = [...userWishlist];
          guestWishlist.forEach((item) => {
            if (!mergedWishlist.some((w) => w.id === item.id)) {
              mergedWishlist.push(item);
            }
          });

          return {
            currentUser: user,
            isAuthenticated: true,
            cart: Array.from(cartMap.values()),
            wishlist: mergedWishlist,
          };
        }),
      logout: () => set(INITIAL_USER_STATE),
      updateUser: (updatedUser) =>
        set((state) => ({
          users: state.users.map((u) =>
            u.id === updatedUser.id ? updatedUser : u,
          ),
          currentUser:
            state.currentUser?.id === updatedUser.id
              ? updatedUser
              : state.currentUser,
        })),

      // --- Actions: Profile Image ---
      updateUserProfileImage: (userId, imageUrl) =>
        set((state) => ({
          users: state.users.map((u) =>
            u.id === userId ? { ...u, profileImage: imageUrl } : u,
          ),
          currentUser:
            state.currentUser?.id === userId
              ? { ...state.currentUser, profileImage: imageUrl }
              : state.currentUser,
        })),

      removeUserProfileImage: (userId) =>
        set((state) => ({
          users: state.users.map((u) =>
            u.id === userId ? { ...u, profileImage: null } : u,
          ),
          currentUser:
            state.currentUser?.id === userId
              ? { ...state.currentUser, profileImage: null }
              : state.currentUser,
        })),

      // --- Actions: Cart ---
      addToCart: (product) =>
        set((state) => {
          const exists = state.cart.some((item) => item.id === product.id);
          if (exists) return state;
          return { cart: [...state.cart, { ...product, quantity: 1 }] };
        }),
      removeFromCart: (productId) =>
        set((state) => ({
          cart: state.cart.filter((item) => item.id !== productId),
        })),
      updateCartQuantity: (productId, quantity) =>
        set((state) => ({
          cart: state.cart.map((item) =>
            item.id === productId ? { ...item, quantity } : item,
          ),
        })),
      clearCart: () => set({ cart: [] }),

      // --- Actions: Wishlist ---
      addToWishlist: (product) =>
        set((state) => {
          const exists = state.wishlist.find((item) => item.id === product.id);
          if (exists) return state;
          return { wishlist: [...state.wishlist, product] };
        }),
      removeFromWishlist: (productId) =>
        set((state) => ({
          wishlist: state.wishlist.filter((item) => item.id !== productId),
        })),
      moveToCart: (productId) =>
        set((state) => {
          const product = state.wishlist.find((item) => item.id === productId);
          if (!product) return state;

          const newWishlist = state.wishlist.filter(
            (item) => item.id !== productId,
          );

          const existingCartItem = state.cart.find(
            (item) => item.id === productId,
          );
          let newCart;
          if (existingCartItem) {
            newCart = state.cart.map((item) =>
              item.id === productId
                ? { ...item, quantity: item.quantity + 1 }
                : item,
            );
          } else {
            newCart = [...state.cart, { ...product, quantity: 1 }];
          }

          return { wishlist: newWishlist, cart: newCart };
        }),

      // --- Sync Helpers ---
      resetToDefaults: () =>
        set({
          products: VALID_PRODUCTS,
          orders: MOCK_ORDERS,
          users: USERS,
          banners: BANNERS,
          categories: CATEGORY_DETAILS,
          addresses: MOCK_ADDRESSES,
          ...INITIAL_USER_STATE,
        }),
    }),
    {
      name: STORE_NAME,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        products: state.products,
        orders: state.orders,
        users: state.users,
        currentUser: state.currentUser,
        isAuthenticated: state.isAuthenticated,
        cart: state.cart,
        wishlist: state.wishlist,
        addresses: state.addresses,
        categories: state.categories, // ✅ CRITICAL FIX: Persist categories
      }),
    },
  ),
);

if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key === STORE_NAME) {
      useDataStore.persist.rehydrate();
    }
  });
}

export default useDataStore;
