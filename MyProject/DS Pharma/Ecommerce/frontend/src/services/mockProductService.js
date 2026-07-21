import { PRODUCTS, CATEGORY_DETAILS } from "../data/sampleData.js";

// Simulate API delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockProductService = {
  getProducts: async (filters = {}) => {
    await delay(500);
    let filteredProducts = [...PRODUCTS];

    if (filters.category) {
      filteredProducts = filteredProducts.filter(
        (p) => p.category.toLowerCase() === filters.category.toLowerCase()
      );
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredProducts = filteredProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(searchLower) ||
          p.genericName.toLowerCase().includes(searchLower)
      );
    }

    if (filters.featured) {
      // Just return a subset for featured if logic isn't in sampleData
      filteredProducts = filteredProducts.slice(0, 4);
    }

    return { data: filteredProducts };
  },

  getProductById: async (id) => {
    await delay(300);
    const product = PRODUCTS.find((p) => p.id === id);
    if (!product) throw new Error("Product not found");
    return { data: product };
  },

  getCategories: async () => {
    await delay(300);
    // Return Categories with images and metadata
    return { data: CATEGORY_DETAILS };
  },

  getRelatedProducts: async (categoryId, currentProductId) => {
    await delay(300);
    const related = PRODUCTS.filter(
      (p) => p.category === categoryId && p.id !== currentProductId
    ).slice(0, 4);
    return { data: related };
  },
};
