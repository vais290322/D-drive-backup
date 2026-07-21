/**
 * Product Constants
 * ============================================================
 * Centralized constants for product data handling
 */

// Fallback Images
export const FALLBACK_IMAGES = {
  PRODUCT: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80",
  CATEGORY: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=400&q=80",
  BANNER: "https://images.unsplash.com/photo-1544367563-12123d8965cd?auto=format&fit=crop&w=1200&q=80",
  USER_AVATAR: "https://ui-avatars.com/api/?name=User&background=64E5B8&color=fff",
};

// Default Product Values
export const DEFAULT_PRODUCT = {
  id: "",
  name: "Product",
  price: 0,
  originalPrice: 0,
  mrp: 0,
  discount: 0,
  image: FALLBACK_IMAGES.PRODUCT,
  images: [FALLBACK_IMAGES.PRODUCT],
  stock: 0,
  inStock: false,
  category: "Uncategorized",
  categoryId: "",
  description: "",
  unit: "piece",
  isVisible: true,
  display: true,
};

// Product Units
export const PRODUCT_UNITS = {
  STRIP: "strip",
  BOTTLE: "bottle",
  PIECE: "piece",
  BOX: "box",
  TUBE: "tube",
  PACK: "pack",
  ML: "ml",
  MG: "mg",
  GM: "gm",
};

// Stock Status
export const STOCK_STATUS = {
  IN_STOCK: "in_stock",
  OUT_OF_STOCK: "out_of_stock",
  LOW_STOCK: "low_stock",
  COMING_SOON: "coming_soon",
};

// Product Visibility
export const PRODUCT_VISIBILITY = {
  VISIBLE: true,
  HIDDEN: false,
};

// Discount Thresholds
export const DISCOUNT_THRESHOLDS = {
  LOW: 10,
  MEDIUM: 25,
  HIGH: 50,
};

/**
 * Canonical Product Data Contract
 * 
 * This defines the expected shape of a product object
 * after normalization. All components should expect this structure.
 */
export const PRODUCT_DATA_CONTRACT = {
  // Identity (REQUIRED)
  _id: "string",              // MongoDB ID
  id: "string",               // Normalized ID
  
  // Basic Info (REQUIRED)
  name: "string",             // Product name
  description: "string",      // Product description
  
  // Pricing (REQUIRED)
  price: "number",            // Selling price
  mrp: "number",              // Original price
  originalPrice: "number",    // For display
  discount: "number",         // Discount percentage (0-100)
  
  // Images (REQUIRED - ALWAYS PRESENT)
  image: "string",            // Primary image URL (never empty)
  images: "string[]",         // All images array (min 1 item)
  
  // Category (REQUIRED)
  category: "object|string",  // Populated category or ID
  categoryId: "string",       // Category ID reference
  
  // Stock (REQUIRED)
  stock: "number",            // Quantity available
  inStock: "boolean",         // Availability flag
  
  // Visibility (REQUIRED)
  isVisible: "boolean",       // Admin control
  display: "boolean",         // Normalized visibility
  
  // Optional Fields
  unit: "string",             // "strip", "bottle", etc.
  isFeatured: "boolean",      // Featured flag
  isHighlighted: "boolean",   // Highlighted flag
  rating: "number",           // Product rating (0-5)
  reviews: "number",          // Review count
  manufacturer: "string",     // Manufacturer name
  genericName: "string",      // Generic/scientific name
  prescription: "boolean",    // Requires prescription
  createdAt: "string",        // ISO date string
  updatedAt: "string",        // ISO date string
};

/**
 * Validation Rules
 */
export const PRODUCT_VALIDATION = {
  NAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 200,
  },
  PRICE: {
    MIN: 0,
    MAX: 999999,
  },
  STOCK: {
    MIN: 0,
    MAX: 999999,
    LOW_THRESHOLD: 10,
  },
  DISCOUNT: {
    MIN: 0,
    MAX: 100,
  },
  DESCRIPTION: {
    MIN_LENGTH: 0,
    MAX_LENGTH: 5000,
  },
};

/**
 * Display Configuration
 */
export const PRODUCT_DISPLAY = {
  // Card Display
  CARD_NAME_MAX_LENGTH: 50,
  CARD_DESC_MAX_LENGTH: 100,
  
  // Grid Layouts
  GRID_COLUMNS: {
    MOBILE: 2,
    TABLET: 3,
    DESKTOP: 4,
    LARGE_DESKTOP: 5,
  },
  
  // Pagination
  DEFAULT_PAGE_SIZE: 12,
  MAX_PAGE_SIZE: 100,
  
  // Image Sizes
  THUMBNAIL_SIZE: { width: 100, height: 100 },
  CARD_IMAGE_SIZE: { width: 400, height: 400 },
  DETAIL_IMAGE_SIZE: { width: 800, height: 800 },
};

/**
 * Helper: Get product display name
 */
export const getProductDisplayName = (product, maxLength = 50) => {
  if (!product?.name) return DEFAULT_PRODUCT.name;
  return product.name.length > maxLength
    ? `${product.name.substring(0, maxLength - 3)}...`
    : product.name;
};

/**
 * Helper: Get product image
 */
export const getProductImage = (product) => {
  if (!product) return FALLBACK_IMAGES.PRODUCT;
  
  // Priority: images[0] > image > fallback
  if (Array.isArray(product.images) && product.images.length > 0) {
    return product.images[0] || FALLBACK_IMAGES.PRODUCT;
  }
  
  return product.image || FALLBACK_IMAGES.PRODUCT;
};

/**
 * Helper: Calculate discount percentage
 */
export const calculateDiscount = (price, mrp) => {
  if (!mrp || !price || mrp <= price) return 0;
  return Math.round(((mrp - price) / mrp) * 100);
};

/**
 * Helper: Format price for display
 */
export const formatPrice = (price) => {
  if (typeof price !== 'number' || isNaN(price)) return '₹0';
  return `₹${price.toFixed(2)}`;
};

/**
 * Helper: Check if product is in stock
 */
export const isProductInStock = (product) => {
  if (!product) return false;
  return product.inStock !== false && (product.stock ?? 0) > 0;
};

/**
 * Helper: Get stock status
 */
export const getStockStatus = (stock) => {
  if (!stock || stock === 0) return STOCK_STATUS.OUT_OF_STOCK;
  if (stock < PRODUCT_VALIDATION.STOCK.LOW_THRESHOLD) return STOCK_STATUS.LOW_STOCK;
  return STOCK_STATUS.IN_STOCK;
};

export default {
  FALLBACK_IMAGES,
  DEFAULT_PRODUCT,
  PRODUCT_UNITS,
  STOCK_STATUS,
  PRODUCT_VISIBILITY,
  DISCOUNT_THRESHOLDS,
  PRODUCT_DATA_CONTRACT,
  PRODUCT_VALIDATION,
  PRODUCT_DISPLAY,
  // Helper functions
  getProductDisplayName,
  getProductImage,
  calculateDiscount,
  formatPrice,
  isProductInStock,
  getStockStatus,
};
