import apiClient, {
  isCancelError,
  isRetriableError,
} from "@/services/api/apiClient";
import { API_ENDPOINTS } from "@/services/api/baseURL";

const CACHE_KEY_PREFIX = "dspharma_v2_";
const CACHE_EXPIRY = 10 * 60 * 1000;
const MEMORY_CACHE_SIZE = 50;
const MAX_RETRY_ATTEMPTS = 2;
const RETRY_DELAYS = [1000, 2000];
const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80";

const productfetchapi = import.meta.env.VITE_MEDIA_CLOUD_BASE_URL;

// ============================================================
// STATE MANAGEMENT
// ============================================================

// Active requests tracker - ONE request per unique key
const activeRequests = new Map();

// Track cache dependencies for cleanup
const cacheDependencies = new Map(); // Maps cacheKey -> Set of requestKeys
const requestDependencies = new Map(); // Maps requestKey -> cacheKey

// In-memory cache (faster than localStorage)
const memoryCache = new Map();
const cacheAccessOrder = []; // LRU tracking

// Category cache (reduce repeated calls)
let categoriesCache = null;
let categoriesCacheTime = 0;
const CATEGORIES_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// ============================================================
// HELPER: Generate unique request key
// ============================================================
const getRequestKey = (endpoint, params = {}) => {
  const sortedParams = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");
  return `${endpoint}?${sortedParams}`;
};

// ============================================================
// HELPER: Memory Cache Management (LRU)
// ============================================================
const memoryCacheManager = {
  get: (key) => {
    if (!memoryCache.has(key)) return null;

    const entry = memoryCache.get(key);

    // Check expiry
    if (Date.now() - entry.timestamp > CACHE_EXPIRY) {
      memoryCache.delete(key);
      return null;
    }

    // Update LRU order
    const index = cacheAccessOrder.indexOf(key);
    if (index > -1) cacheAccessOrder.splice(index, 1);
    cacheAccessOrder.push(key);

    return entry.data;
  },

  set: (key, data) => {
    // Evict oldest if cache is full
    if (memoryCache.size >= MEMORY_CACHE_SIZE && !memoryCache.has(key)) {
      const oldestKey = cacheAccessOrder.shift();
      if (oldestKey) memoryCache.delete(oldestKey);
    }

    memoryCache.set(key, {
      data,
      timestamp: Date.now(),
    });

    // Update LRU order
    const index = cacheAccessOrder.indexOf(key);
    if (index > -1) cacheAccessOrder.splice(index, 1);
    cacheAccessOrder.push(key);
  },

  clear: () => {
    memoryCache.clear();
    cacheAccessOrder.length = 0;
  },
};

// ============================================================
// HELPER: localStorage Cache Management
// ============================================================
const localStorageCache = {
  get: (key) => {
    try {
      const item = localStorage.getItem(`${CACHE_KEY_PREFIX}${key}`);
      if (!item) return null;

      const { data, timestamp } = JSON.parse(item);

      // Check expiry
      if (Date.now() - timestamp > CACHE_EXPIRY) {
        localStorage.removeItem(`${CACHE_KEY_PREFIX}${key}`);
        return null;
      }

      return data;
    } catch (error) {
      console.warn("[Cache] localStorage read failed:", error);
      return null;
    }
  },

  set: (key, data) => {
    try {
      const item = {
        data,
        timestamp: Date.now(),
      };
      localStorage.setItem(`${CACHE_KEY_PREFIX}${key}`, JSON.stringify(item));
    } catch (error) {
      // Handle quota exceeded
      if (error.name === "QuotaExceededError") {
        console.warn(
          "[Cache] localStorage quota exceeded, clearing old entries",
        );
        localStorageCache.clearExpired();
      }
    }
  },

  clearExpired: () => {
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(CACHE_KEY_PREFIX)) {
        try {
          const item = JSON.parse(localStorage.getItem(key));
          if (Date.now() - item.timestamp > CACHE_EXPIRY) {
            keysToRemove.push(key);
          }
        } catch {
          keysToRemove.push(key);
        }
      }
    }
    keysToRemove.forEach((key) => localStorage.removeItem(key));
  },
};

// ============================================================
// HELPER: Get from multi-layer cache
// ============================================================
const getCachedData = (key) => {
  // Try memory cache first (faster)
  const memoryData = memoryCacheManager.get(key);
  if (memoryData) return memoryData;

  // Fall back to localStorage
  const storageData = localStorageCache.get(key);
  if (storageData) {
    // Populate memory cache for next access
    memoryCacheManager.set(key, storageData);
    return storageData;
  }

  return null;
};

// ============================================================
// HELPER: Set to multi-layer cache
// ============================================================
const setCachedData = (key, data) => {
  memoryCacheManager.set(key, data);
  localStorageCache.set(key, data);
};

// ============================================================
// HELPER: Product Normalization
// ============================================================
export const normalizeProduct = (p) => {
  if (!p) return null;

  // Normalize images
  const images = Array.isArray(p.image)
    ? p.image
        .map((img) => (typeof img === "string" ? img : img?.url))
        .filter(Boolean)
    : p.image?.url
      ? [p.image.url]
      : typeof p.image === "string" && p.image
        ? [p.image]
        : Array.isArray(p.images)
          ? p.images
              .map((img) => (typeof img === "string" ? img : img?.url))
              .filter(Boolean)
          : typeof p.images === "string" && p.images
            ? [p.images]
            : [];

  // Convert relative image URLs to absolute URLs
  const absoluteImages = images.map((img) => {
    if (!img) return FALLBACK_IMAGE;

    // Check if it's already an absolute URL
    if (img.startsWith("http://") || img.startsWith("https://")) {
      return img;
    }

    // Check if it's a relative path (starts with /)
    if (img.startsWith("/")) {
      const baseUrl =
        import.meta.env.VITE_API_BASE_URL || "http://192.168.0.123:5000";
      // Remove trailing slash from base URL but KEEP the leading slash from image path
      const normalizedBaseUrl = baseUrl.replace(/\/$/, "");
      // ✅ CRITICAL FIX: Keep the leading slash for proper URL construction
      return `${normalizedBaseUrl}${img}`;
    }

    // If it's neither absolute nor relative, return fallback
    return FALLBACK_IMAGE;
  });

  const finalImages =
    absoluteImages.length > 0 ? absoluteImages : [FALLBACK_IMAGE];

  // Normalize category
  const category =
    typeof p.category === "object" && p.category
      ? {
          _id: p.category._id || p.category.id,
          name: p.category.name || "Uncategorized",
        }
      : p.category;

  const categoryId = typeof category === "object" ? category._id : category;

  // Normalize pricing with robust fallback logic based on Marg API + Common fallbacks
  // Priority 1: Marg API (rawPRate > rawRate)
  // Priority 2: Generic (sellingPrice, discountedPrice, price)
  const rawMRP = Number(p.MRP || p.mrp || p.originalPrice || 0);
  const rawRate = Number(
    p.Rate || p.rate || p.sellingPrice || p.discountedPrice || p.price || 0,
  );
  const rawPRate = Number(p.PRate || p.prate || 0);

  const price = rawPRate > 0 ? rawPRate : rawRate;
  const mrp =
    rawMRP > 0 ? rawMRP : p.originalPrice ? Number(p.originalPrice) : price;

  // Calculate discount percentage dynamically if MRP > price
  const discount =
    mrp > price && mrp > 0 ? Math.round(((mrp - price) / mrp) * 100) : 0;

  // Normalize stock
  const stock = Number(p.stock ?? 0);
  const inStock = p.inStock !== false && stock > 0;

  return {
    ...p,
    id: p._id || p.id,
    _id: p._id || p.id,
    image: finalImages[0],
    images: finalImages,
    category,
    categoryId,
    price: price,
    mrp: mrp,
    originalPrice: mrp,
    discount: discount,
    stock,
    inStock,
    isVisible: p.isVisible !== false,
    display: true,
  };
};

// ============================================================
// CORE: Resilient Fetch with Smart Retry
// ============================================================
const resilientFetch = async (requestKey, fetchFn, options = {}) => {
  const {
    skipCache = false,
    retries = MAX_RETRY_ATTEMPTS,
    cacheKeyOverride = null, // Allow specifying different cache key
  } = options;

  // Use provided cacheKey or derive from requestKey
  const cacheKey = cacheKeyOverride || requestKey;

  // Check cache first (unless skipped)
  if (!skipCache) {
    const cached = getCachedData(cacheKey);
    if (cached) {
      if (import.meta.env.DEV) {
        console.log(`[ProductService] Cache hit: ${cacheKey}`);
      }
      return cached;
    }
  }

  // Cancel previous request for same resource
  if (activeRequests.has(requestKey)) {
    const prevController = activeRequests.get(requestKey);
    prevController.abort();
    activeRequests.delete(requestKey);

    // Clean up dependencies
    if (requestDependencies.has(requestKey)) {
      const depCacheKey = requestDependencies.get(requestKey);
      if (cacheDependencies.has(depCacheKey)) {
        cacheDependencies.get(depCacheKey).delete(requestKey);
        if (cacheDependencies.get(depCacheKey).size === 0) {
          cacheDependencies.delete(depCacheKey);
        }
      }
      requestDependencies.delete(requestKey);
    }
  }

  // Create new AbortController
  const controller = new AbortController();
  activeRequests.set(requestKey, controller);

  // Set up dependencies
  requestDependencies.set(requestKey, cacheKey);
  if (!cacheDependencies.has(cacheKey)) {
    cacheDependencies.set(cacheKey, new Set());
  }
  cacheDependencies.get(cacheKey).add(requestKey);

  let lastError = null;

  try {
    // Retry loop
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const result = await fetchFn(controller.signal);

        // Success - cache and return
        setCachedData(cacheKey, result);

        // Clean up request tracking
        activeRequests.delete(requestKey);
        if (requestDependencies.has(requestKey)) {
          const depCacheKey = requestDependencies.get(requestKey);
          if (cacheDependencies.has(depCacheKey)) {
            cacheDependencies.get(depCacheKey).delete(requestKey);
            if (cacheDependencies.get(depCacheKey).size === 0) {
              cacheDependencies.delete(depCacheKey);
            }
          }
          requestDependencies.delete(requestKey);
        }

        return result;
      } catch (error) {
        lastError = error;

        // Don't retry if canceled
        if (isCancelError(error)) {
          throw error;
        }

        // Check if error is retriable
        if (!isRetriableError(error)) {
          throw error;
        }

        // If not last attempt, wait before retry
        if (attempt < retries) {
          const delay =
            RETRY_DELAYS[attempt] || RETRY_DELAYS[RETRY_DELAYS.length - 1];

          if (import.meta.env.DEV) {
            console.warn(
              `[ProductService] Retry ${attempt + 1}/${retries} after ${delay}ms for: ${requestKey}`,
            );
          }

          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }

    // All retries failed - try cache fallback
    throw lastError;
  } catch (error) {
    // Clean up on error
    if (activeRequests.get(requestKey) === controller) {
      activeRequests.delete(requestKey);
    }

    // Clean up dependencies
    if (requestDependencies.has(requestKey)) {
      const depCacheKey = requestDependencies.get(requestKey);
      if (cacheDependencies.has(depCacheKey)) {
        cacheDependencies.get(depCacheKey).delete(requestKey);
        if (cacheDependencies.get(depCacheKey).size === 0) {
          cacheDependencies.delete(depCacheKey);
        }
      }
      requestDependencies.delete(requestKey);
    }

    // If canceled, return null silently
    if (isCancelError(error)) {
      return null;
    }

    // Try cache fallback on failure
    const cachedFallback = getCachedData(cacheKey);
    if (cachedFallback) {
      console.warn(`[ProductService] Using cached fallback for: ${cacheKey}`);
      return cachedFallback;
    }

    // Re-throw error
    throw error;
  }
};

// ============================================================
// API: Get All Categories
// ============================================================
const getAllCategories = async (options = {}) => {
  const { skipCache = false } = options;

  // Check memory cache first
  if (
    !skipCache &&
    categoriesCache &&
    Date.now() - categoriesCacheTime < CATEGORIES_CACHE_TTL
  ) {
    return categoriesCache;
  }

  const requestKey = "categories_all";

  try {
    const result = await resilientFetch(
      requestKey,
      async (signal) => {
        const response = await apiClient.get(API_ENDPOINTS.CATEGORIES, {
          signal,
        });
        const categories = response.data?.data || response.data || [];

        return categories.map((c) => ({
          ...c,
          id: c._id || c.id,
          _id: c._id || c.id,
          name: c.name || "Unnamed Category",
          isVisible: c.isVisible !== false,
        }));
      },
      { skipCache },
    );

    // Update memory cache
    categoriesCache = result;
    categoriesCacheTime = Date.now();

    return result || [];
  } catch (error) {
    console.error("[ProductService] Failed to fetch categories:", error);
    return categoriesCache || []; // Return stale cache or empty array
  }
};

// ============================================================
// API: Get Products by Category
// ============================================================
// Session-based mapping of category identifiers that successfully returned data
// This avoids double-fetching for known working mappings in the same session
const workingCategoryIdentifiers = new Map();

const getProductsByCategory = async (
  categoryId,
  page = 1,
  limit = 12,
  options = {},
) => {
  if (!categoryId) return { data: [], pagination: {} };

  const pageNum = Math.max(1, Number(page) || 1);
  const limitNum = Math.max(1, Math.min(100, Number(limit) || 12));

  // If we already know which identifier works for this categoryId, use it immediately
  const knownIdentifier = workingCategoryIdentifiers.get(categoryId);

  const requestKey = getRequestKey(`category_${categoryId}`, {
    page: pageNum,
    limit: limitNum,
    id_override: !!knownIdentifier, // Differentiate cache keys
  });

  try {
    return await resilientFetch(
      requestKey,
      async (signal) => {
        let primaryIdentifier = knownIdentifier || categoryId;
        let secondaryIdentifier = null;

        const isObjectId = /^[a-f\d]{24}$/i.test(categoryId);

        // Define fallback strategy if we don't have a known identifier yet
        if (!knownIdentifier && isObjectId) {
          try {
            const categories = await getAllCategories();
            const category = categories.find(
              (c) => c.id === categoryId || c._id === categoryId,
            );
            if (category && category.name) {
              // We'll try ID first (primary), then fallback to Name (secondary)
              // This is because Admin-saved products use IDs.
              primaryIdentifier = categoryId;
              secondaryIdentifier = category.name;
            }
          } catch (err) {
            console.warn("[ProductService] Category resolution failed:", err);
          }
        }

        // 1. Try Primary Fetch
        const fetchBy = async (id, silent = false) => {
          try {
            const response = await apiClient.get(
              API_ENDPOINTS.PRODUCT_USER_CATEGORY(id),
              {
                params: { page: pageNum, limit: limitNum },
                signal,
                silent, // Suppress console logs
                noToast: silent, // Suppress error toasts
              },
            );
            const data = response.data?.data || response.data || [];
            const pagination = response.data?.pagination || {};
            return { data, pagination };
          } catch (err) {
            // Handle 404 specifically for fallback logic
            if (err.response?.status === 404) {
              return { data: [], pagination: {} };
            }
            throw err; // Re-throw other errors (500, Network, etc.)
          }
        };

        // Attempt primary lookup silently - we don't want to show errors if it fails and we have a fallback
        let result = await fetchBy(primaryIdentifier, !!secondaryIdentifier);

        // 2. Fallback if Primary returned nothing but a secondary exists
        // API might return {"message": "No products found..."} instead of []
        const isPrimaryEmpty =
          !result.data ||
          !Array.isArray(result.data) ||
          result.data.length === 0;

        if (isPrimaryEmpty && secondaryIdentifier) {
          if (import.meta.env.DEV) {
            console.log(
              `[ProductService] No products found for ID ${primaryIdentifier}, trying fallback name: ${secondaryIdentifier}`,
            );
          }
          const fallbackResult = await fetchBy(secondaryIdentifier);
          const isFallbackValid =
            fallbackResult.data &&
            Array.isArray(fallbackResult.data) &&
            fallbackResult.data.length > 0;

          if (isFallbackValid) {
            result = fallbackResult;
            workingCategoryIdentifiers.set(categoryId, secondaryIdentifier);
          }
        } else if (!isPrimaryEmpty && !knownIdentifier) {
          // Success with primary! Cache it.
          workingCategoryIdentifiers.set(categoryId, primaryIdentifier);
        }

        const { data, pagination } = result;

        // Calculate totalPages if not provided by backend
        const totalItems =
          pagination.totalItems || (Array.isArray(data) ? data.length : 0);
        const totalPages =
          pagination.totalPages ||
          (limitNum > 0 ? Math.ceil(totalItems / limitNum) : 1);

        return {
          data: Array.isArray(data)
            ? data.map(normalizeProduct).filter(Boolean)
            : [],
          pagination: {
            currentPage: pagination.current_page || pagination.page || pageNum,
            totalPages:
              totalPages ||
              (Array.isArray(data) && data.length > 0 ? pageNum : 0),
            totalItems: totalItems,
            hasMore:
              pagination.hasMore ??
              (Array.isArray(data) &&
                data.length >= limitNum &&
                pageNum < totalPages),
          },
        };
      },
      options,
    );
  } catch (error) {
    if (error.response?.status === 404) {
      if (import.meta.env.DEV) {
        console.warn(
          `[ProductService] 404 on category fetch for ID ${categoryId}. Clearing cache.`,
        );
      }
      // Force refresh of categories on next attempt
      categoriesCache = null;
      categoriesCacheTime = 0;

      return {
        data: [],
        pagination: {
          currentPage: pageNum,
          totalPages: 0,
          totalItems: 0,
          hasMore: false,
        },
      };
    }

    console.error(
      "[ProductService] Failed to fetch products for category:",
      error,
    );
    return {
      data: [],
      pagination: {
        currentPage: pageNum,
        totalPages: 0,
        totalItems: 0,
        hasMore: false,
      },
      error: true,
    };
  }
};

// ============================================================
// API: Get Featured Products
// ============================================================
const getFeaturedProducts = async (options = {}) => {
  const requestKey = "featured_products";
  try {
    return await resilientFetch(
      requestKey,
      async (signal) => {
        const response = await apiClient.get(API_ENDPOINTS.FEATURED_GET, {
          signal,
        });
        const data = response.data?.data || response.data || [];
        return Array.isArray(data)
          ? data.map((item) =>
              normalizeProduct(item.productId || item.product || item),
            )
          : [];
      },
      options,
    );
  } catch (error) {
    if (error.name === "AbortError") return null;
    console.error("[ProductService] Failed to load featured products:", error);
    return [];
  }
};

// ============================================================
// API: Get Product by ID
// ============================================================
const getProductById = async (id, options = {}) => {
  if (!id) {
    console.warn("[ProductService] No product ID provided");
    return null;
  }

  const requestKey = `product_${id}`;

  try {
    const result = await resilientFetch(
      requestKey,
      async (signal) => {
        const response = await apiClient.get(
          API_ENDPOINTS.PRODUCT_BY_ID_USER(id),
          { signal },
        );

        return normalizeProduct(response.data?.data || response.data);
      },
      options,
    );

    return result;
  } catch (error) {
    console.error(`[ProductService] Failed to fetch product ${id}:`, error);
    return null;
  }
};

// ============================================================
// API: Search Products
// ============================================================
const searchUserProducts = async (
  { search = "", page = 1, limit = 12 } = {},
  options = {},
) => {
  const pageNum = Math.max(1, Number(page) || 1);
  const limitNum = Math.max(1, Math.min(100, Number(limit) || 12));

  const requestKey = getRequestKey("search", {
    q: search,
    page: pageNum,
    limit: limitNum,
  });

  try {
    const result = await resilientFetch(
      requestKey,
      async (signal) => {
        const response = await apiClient.get(
          API_ENDPOINTS.PRODUCT_USER_SEARCH,
          {
            params: { search, page: pageNum, limit: limitNum },
            signal,
          },
        );

        const data = response.data?.data || response.data || [];
        const pagination = response.data?.pagination || {};

        return {
          data: Array.isArray(data)
            ? data.map(normalizeProduct).filter(Boolean)
            : [],
          pagination: {
            currentPage: pagination.currentPage || pageNum,
            totalPages: pagination.totalPages || 1,
            totalItems: pagination.totalItems || 0,
            hasMore:
              (pagination.currentPage || pageNum) <
              (pagination.totalPages || 1),
          },
        };
      },
      options,
    );

    return (
      result || {
        data: [],
        pagination: {
          currentPage: pageNum,
          totalPages: 0,
          totalItems: 0,
          hasMore: false,
        },
      }
    );
  } catch (error) {
    console.error("[ProductService] Search failed:", error);
    return {
      data: [],
      pagination: {
        currentPage: pageNum,
        totalPages: 0,
        totalItems: 0,
        hasMore: false,
      },
      error: true,
    };
  }
};

// ============================================================
// UTILITY: Cancel all pending requests
// ============================================================
const cancelAllRequests = () => {
  activeRequests.forEach((controller) => controller.abort());
  activeRequests.clear();
};

// ============================================================
// UTILITY: Clear all caches
// ============================================================
const clearAllCaches = () => {
  memoryCacheManager.clear();
  localStorageCache.clearExpired();
  categoriesCache = null;
  categoriesCacheTime = 0;

  // Also clear dependencies
  cacheDependencies.clear();
  requestDependencies.clear();
};

// Clean up active requests with proper cache dependency management
const cleanupActiveRequests = (pattern = null) => {
  for (const [requestKey, controller] of activeRequests.entries()) {
    if (!pattern || requestKey.includes(pattern)) {
      controller.abort();

      // Clean up dependencies
      if (requestDependencies.has(requestKey)) {
        const depCacheKey = requestDependencies.get(requestKey);
        if (cacheDependencies.has(depCacheKey)) {
          cacheDependencies.get(depCacheKey).delete(requestKey);
          if (cacheDependencies.get(depCacheKey).size === 0) {
            cacheDependencies.delete(depCacheKey);
          }
        }
        requestDependencies.delete(requestKey);
      }

      activeRequests.delete(requestKey);
    }
  }
};

// Force cache refresh for specific key
const refreshCache = async (cacheKey, fetchFn) => {
  try {
    // Cancel any active requests for this cache key
    const requestsToCancel = [];
    for (const [reqKey, depCacheKey] of requestDependencies.entries()) {
      if (depCacheKey === cacheKey) {
        requestsToCancel.push(reqKey);
      }
    }

    requestsToCancel.forEach((reqKey) => {
      if (activeRequests.has(reqKey)) {
        activeRequests.get(reqKey).abort();
        activeRequests.delete(reqKey);

        // Clean up dependencies
        if (cacheDependencies.has(cacheKey)) {
          cacheDependencies.get(cacheKey).delete(reqKey);
          if (cacheDependencies.get(cacheKey).size === 0) {
            cacheDependencies.delete(cacheKey);
          }
        }
        requestDependencies.delete(reqKey);
      }
    });

    // Fetch fresh data
    const freshData = await fetchFn();

    // Update cache
    setCachedData(cacheKey, freshData);

    return freshData;
  } catch (error) {
    console.error(
      `[ProductService] Failed to refresh cache for ${cacheKey}:`,
      error,
    );
    throw error;
  }
};

// Search-specific caching utilities
const getSearchCacheKey = (query, filters, sort, page, limit) => {
  const filterStr = JSON.stringify(filters);
  return `search_${encodeURIComponent(query)}_${filterStr}_${sort}_${page}_${limit}`;
};

// Cache search results with TTL
const cacheSearchResults = (query, filters, sort, page, limit, results) => {
  const cacheKey = getSearchCacheKey(query, filters, sort, page, limit);
  setCachedData(cacheKey, results);
};

// Get cached search results
const getCachedSearchResults = (query, filters, sort, page, limit) => {
  const cacheKey = getSearchCacheKey(query, filters, sort, page, limit);
  return getCachedData(cacheKey);
};

// Clear search cache
const clearSearchCache = (queryPrefix = "") => {
  // Clear all search caches that start with the given prefix
  memoryCache.forEach((_, key) => {
    if (key.startsWith("search_") && key.includes(queryPrefix)) {
      memoryCache.delete(key);
    }
  });

  // Also clear from localStorage
  for (let i = localStorage.length - 1; i >= 0; i--) {
    const key = localStorage.key(i);
    if (
      key &&
      key.startsWith(CACHE_KEY_PREFIX + "search_") &&
      key.includes(queryPrefix)
    ) {
      localStorage.removeItem(key);
    }
  }
};

// ============================================================
// API: Get All Products (with pagination)
// ============================================================
const getAllProducts = async ({ page = 1, limit = 12, filters = {} } = {}) => {
  const pageNum = Math.max(1, Number(page) || 1);
  const limitNum = Math.max(1, Math.min(100, Number(limit) || 12));

  const requestKey = getRequestKey("all_products", {
    page: pageNum,
    limit: limitNum,
    filters: JSON.stringify(filters),
  });

  try {
    const result = await resilientFetch(
      requestKey,
      async (signal) => {
        const response = await apiClient.get(`${productfetchapi}/api/v1/products`, {
          params: { page: pageNum, limit: limitNum, ...filters },
          signal,
        });
        // console.log("response from getAllProducts in productService", response);

        const data = response.data?.data || response.data || [];
        const pagination = response.data?.pagination || {};
        
        // Calculate hasMore based on actual data received vs limit
        // If we received exactly the limit amount and there are more pages, there might be more
        const hasMore = Array.isArray(data) && data.length === limitNum && 
                     ((pagination.totalPages && (pagination.currentPage || pageNum) < pagination.totalPages) ||
                      !pagination.totalPages); // If no totalPages is provided, assume there could be more
        
        return {
          data: Array.isArray(data)
            ? data.map(normalizeProduct).filter(Boolean)
            : [],
          pagination: {
            currentPage: pagination.currentPage || pageNum,
            totalPages: pagination.totalPages || 1,
            totalItems: pagination.totalItems || 0,
            hasMore,
          },
        };
      },
      {},
    );

    return (
      result || {
        data: [],
        pagination: {
          currentPage: pageNum,
          totalPages: 0,
          totalItems: 0,
          hasMore: false,
        },
      }
    );
  } catch (error) {
    console.error("[ProductService] Failed to fetch all products:", error);
    return {
      data: [],
      pagination: {
        currentPage: pageNum,
        totalPages: 0,
        totalItems: 0,
        hasMore: false,
      },
      error: true,
    };
  }
};

// ============================================================
// API: Get All Products at Once (without pagination - for modern UI)
// ============================================================
const getAllProductsAtOnce = async (filters = {}) => {
  const requestKey = getRequestKey("all_products_once", {
    filters: JSON.stringify(filters),
  });

  try {
    const result = await resilientFetch(
      requestKey,
      async (signal) => {
        const response = await apiClient.get(API_ENDPOINTS.PRODUCT_ALL, {
          params: { page: 1, limit: 100, ...filters }, // High limit to get most/all products
          signal,
        });

        const data = response.data?.data || response.data || [];

        return Array.isArray(data)
          ? data.map(normalizeProduct).filter(Boolean)
          : [];
      },
      {},
    );

    return result || [];
  } catch (error) {
    console.error(
      "[ProductService] Failed to fetch all products at once:",
      error,
    );
    return [];
  }
};

// ============================================================
// EXPORTS
// ============================================================
export const productService = {
  // Core API methods
  getAllCategories,
  getProductsByCategory,
  getFeaturedProducts,
  getProductById,
  searchUserProducts,
  getAllProducts,
  getProducts: getAllProducts, // Alias for hook compatibility
  getAllProductsAtOnce,

  // Legacy aliases for backward compatibility
  getCategoryProducts: (categoryId, options = {}) => {
    const { page = 1, limit = 12, ...rest } = options;
    return getProductsByCategory(categoryId, page, limit, rest);
  },
  fetchProductById: getProductById,
  getCategories: getAllCategories,

  // Utilities
  cancelAllRequests,
  clearAllCaches,
  cleanupActiveRequests,
  refreshCache,
  // Search caching utilities
  cacheSearchResults,
  getCachedSearchResults,
  clearSearchCache,
  normalizeProduct, // Export for external use
};

export default productService;
