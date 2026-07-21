/**
 * Product Service (Resilient Singleton)
 * ============================================================
 * Features:
 * 1. Strictly ID-driven (No slugs/names)
 * 2. Auto-Retries (Max 2)
 * 3. Request Deduplication (AbortController)
 * 4. Smart Caching (localStorage, 15m expiry)
 * 5. Fail-safe defaults
 */

import apiClient from "@/services/api/apiClient";
import { API_ENDPOINTS } from "@/services/api/baseURL";
import toast from "react-hot-toast";

// Constants
const CACHE_KEY_PREFIX = "dspharma_cache_";
const CACHE_EXPIRY = 15 * 60 * 1000; // 15 minutes
const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80"; // Medical/pharmacy fallback

// State for request deduplication
const activeRequests = new Map();

/**
 * Helper: Normalized Product
 * Ensures consistent product data structure across all pages
 * 
 * @param {Object} p - Raw product data from backend
 * @returns {Object} - Normalized product with guaranteed fields
 */
export const normalizeProduct = (p) => {
  if (!p) return null;

  // 1. Normalize Images - Always return array
  const images = Array.isArray(p.image)
    ? p.image
        .map((img) => (typeof img === "string" ? img : img?.url))
        .filter(Boolean)
    : p.image?.url
      ? [p.image.url]
      : typeof p.image === "string" && p.image
        ? [p.image]
        : [];

  // Use fallback image if no images found
  const finalImages = images.length > 0 ? images : [FALLBACK_IMAGE];

  // 2. Normalize Category - Always return consistent structure
  const category = typeof p.category === "object" && p.category
    ? {
        _id: p.category._id || p.category.id,
        name: p.category.name || "Uncategorized"
      }
    : p.category; // Keep as string/ID if not populated

  const categoryId = typeof category === "object" 
    ? category._id 
    : category;

  // 3. Normalize Pricing
  const price = Number(p.price) || 0;
  const mrp = Number(p.mrp || p.originalPrice) || price;
  const discount = p.discount || (mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0);

  // 4. Normalize Stock
  const stock = Number(p.stock ?? 0);
  const inStock = p.inStock !== false && stock > 0;

  return {
    ...p,
    // Identity
    id: p._id || p.id,
    _id: p._id || p.id, // Keep MongoDB ID
    
    // Images (GUARANTEED)
    image: finalImages[0], // Primary image URL (always exists)
    images: finalImages, // All image URLs (always array, min 1 item)
    
    // Category (GUARANTEED)
    category: category,
    categoryId: categoryId,
    
    // Pricing (GUARANTEED)
    price: price,
    mrp: mrp,
    originalPrice: mrp,
    discount: discount,
    
    // Stock (GUARANTEED)
    stock: stock,
    inStock: inStock,
    
    // Visibility
    isVisible: p.isVisible !== false,
    display: true,
  };
};

/**
 * Helper: Caching Logic
 */
const cache = {
  set: (key, data) => {
    try {
      if (!data) return;
      const cacheData = {
        timestamp: Date.now(),
        data,
      };
      localStorage.setItem(
        `${CACHE_KEY_PREFIX}${key}`,
        JSON.stringify(cacheData),
      );
    } catch (e) {
      console.warn("Cache write failed:", e);
    }
  },
  get: (key) => {
    try {
      const raw = localStorage.getItem(`${CACHE_KEY_PREFIX}${key}`);
      if (!raw) return null;
      const { timestamp, data } = JSON.parse(raw);
      if (Date.now() - timestamp > CACHE_EXPIRY) {
        localStorage.removeItem(`${CACHE_KEY_PREFIX}${key}`);
        return null;
      }
      return data;
    } catch (cacheError) {
      console.warn("Cache read failed:", cacheError);
      return null;
    }
  },
};

/**
 * Core Resilient Fetcher
 */
const resilientFetch = async (key, fetchFn, retries = 2) => {
  // 1. Abort existing identical request
  if (activeRequests.has(key)) {
    activeRequests.get(key).abort();
  }
  const controller = new AbortController();
  activeRequests.set(key, controller);

  try {
    let lastError;
    for (let i = 0; i <= retries; i++) {
      try {
        const result = await fetchFn(controller.signal);

        // On success: Cache and Clean up
        cache.set(key, result);
        activeRequests.delete(key);
        return result;
      } catch (err) {
        if (err.name === "AbortError") throw err;
        lastError = err;
        if (i < retries) {
          console.warn(`Retrying request ${key} (${i + 1}/${retries})...`);
          await new Promise((r) => setTimeout(r, 1000 * (i + 1))); // Exponential backoff
        }
      }
    }

    // On Final Failure: Serve from cache if available
    const cachedData = cache.get(key);
    if (cachedData) {
      toast.error("Using offline data - Server temporarily unavailable");
      return cachedData;
    }

    throw lastError;
  } finally {
    if (activeRequests.get(key) === controller) {
      activeRequests.delete(key);
    }
  }
};

export const productService = {
  /**
   * Fetch all categories
   */
  getAllCategories: async () => {
    const cacheKey = "all_categories";
    try {
      return await resilientFetch(cacheKey, async (signal) => {
        const response = await apiClient.get(API_ENDPOINTS.CATEGORIES, {
          signal,
        });
        const categories = response.data?.data || response.data || [];
        return categories.map((c) => ({
          ...c,
          id: c._id || c.id,
          visibility: c.isVisible !== false,
        }));
      });
    } catch (error) {
      if (error.name === "AbortError") return null;
      console.error("Critical error fetching categories:", error);
      return []; // Safe fallback
    }
  },

  /**
   * Get products by category ID (STRICTLY _id)
   * Resolves ID to Name for backend compatibility if needed
   */
  getProductsByCategory: async (categoryId, page = 1, limit = 12) => {
    if (!categoryId) return { data: [], pagination: {} };

    // 1. Resolve ID to Name (Backend currently expects Name on this endpoint)
    let identifier = categoryId;
    try {
      const categories = await productService.getAllCategories();
      const cat = categories.find(
        (c) => c.id === categoryId || c._id === categoryId,
      );
      if (cat && cat.name) {
        identifier = cat.name;
      }
    } catch (err) {
      console.warn("Category resolution failed, falling back to ID:", err);
    }

    const cacheKey = `cat_${categoryId}_p${page}_l${limit}`;

    try {
      return await resilientFetch(cacheKey, async (signal) => {
        const response = await apiClient.get(
          API_ENDPOINTS.PRODUCT_USER_CATEGORY(identifier),
          { params: { page, limit }, signal },
        );

        const data = response.data?.data || response.data || [];
        const pagination = response.data?.pagination || {};

        return {
          data: Array.isArray(data) ? data.map(normalizeProduct) : [],
          pagination: {
            currentPage: pagination.currentPage || Number(page),
            totalPages: pagination.totalPages || 1,
            totalItems: pagination.totalItems || 0,
            hasMore:
              (pagination.currentPage || Number(page)) <
              (pagination.totalPages || 1),
          },
        };
      });
    } catch (error) {
      if (error.name === "AbortError") return null;

      // Treat 404 (Resource not found) as "No products in this category"
      // instead of a fatal error to keep the UI sections intact.
      if (error.response?.status === 404) {
        return {
          data: [],
          pagination: { currentPage: page, totalPages: 1, hasMore: false },
        };
      }

      console.error(
        `Failed to load products for category ${categoryId}:`,
        error,
      );
      return { data: [], pagination: {}, error: true };
    }
  },

  /**
   * Get featured products (Strictly from backend)
   */
  getFeaturedProducts: async () => {
    const cacheKey = "featured_products";
    try {
      return await resilientFetch(cacheKey, async (signal) => {
        const response = await apiClient.get(API_ENDPOINTS.FEATURED_GET, {
          signal,
        });
        const data = response.data?.data || response.data || [];
        return Array.isArray(data)
          ? data.map((item) => normalizeProduct(item.product || item))
          : [];
      });
    } catch (error) {
      if (error.name === "AbortError") return null;
      console.error("Failed to load featured products:", error);
      return [];
    }
  },

  /**
   * Get product by ID
   */
  getProductById: async (id) => {
    if (!id) return null;
    const cacheKey = `product_${id}`;
    try {
      return await resilientFetch(cacheKey, async (signal) => {
        const response = await apiClient.get(
          API_ENDPOINTS.PRODUCT_BY_ID_USER(id),
          { signal },
        );
        return normalizeProduct(response.data?.data || response.data);
      });
    } catch (error) {
      if (error.name === "AbortError") return null;
      console.error(`Error fetching product ${id}:`, error);
      return null;
    }
  },

  /**
   * Search products (User facing)
   */
  searchUserProducts: async ({ search = "", page = 1, limit = 12 } = {}) => {
    const cacheKey = `search_${search}_p${page}_l${limit}`;
    try {
      return await resilientFetch(cacheKey, async (signal) => {
        const response = await apiClient.get(
          API_ENDPOINTS.PRODUCT_USER_SEARCH,
          {
            params: { search, page, limit },
            signal,
          },
        );

        const data = response.data?.data || response.data || [];
        const pagination = response.data?.pagination || {};

        return {
          data: Array.isArray(data) ? data.map(normalizeProduct) : [],
          pagination: {
            currentPage: pagination.currentPage || Number(page),
            totalPages: pagination.totalPages || 1,
            totalItems: pagination.totalItems || 0,
            hasMore:
              (pagination.currentPage || Number(page)) <
              (pagination.totalPages || 1),
          },
        };
      });
    } catch (error) {
      if (error.name === "AbortError") return null;
      console.error("Search failed:", error);
      return { data: [], pagination: {}, error: true };
    }
  },

  // Legacy compatibility aliases
  getCategoryProducts: async (categoryId, { page = 1, limit = 12 } = {}) => {
    return productService.getProductsByCategory(categoryId, page, limit);
  },
  fetchProductById: async (id) => {
    return productService.getProductById(id);
  },
  getCategories: async () => {
    return productService.getAllCategories();
  },
};

export default productService;
