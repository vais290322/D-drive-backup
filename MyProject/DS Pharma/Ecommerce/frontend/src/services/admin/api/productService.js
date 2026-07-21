import mockApi from "../../api/mockApi";
import useDataStore from "@/store/useDataStore";

export const productService = {
  getProducts: async ({ search, category, page = 1, limit = 10000 } = {}) => {
    // Note: Search/Filtering logic is currently basic in mockApi.
    // We can enhance mockApi or do client-side filtering here if needed.
    // For now, let's delegate to mockApi.
    const allProducts = await mockApi.getProducts({ category });

    let products = allProducts.data;

    // Apply Search locally if API doesn't support it fully yet
    if (search) {
      const lowerSearch = search.toLowerCase();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(lowerSearch) ||
          p.sku?.toLowerCase().includes(lowerSearch)
      );
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProducts = products.slice(startIndex, endIndex);

    return {
      data: paginatedProducts,
      total: products.length,
      page,
      limit,
      totalPages: Math.ceil(products.length / limit),
    };
  },

  getCategories: async () => {
    // Mimic the behavior from the user-facing service
    const categories = useDataStore.getState().categories;
    return { data: categories };
  },

  getProduct: async (id) => {
    return await mockApi.getProductById(id);
  },

  createProduct: async (productData) => {
    return await mockApi.createProduct(productData);
  },

  updateProduct: async (id, productData) => {
    return await mockApi.updateProduct(id, productData);
  },

  deleteProduct: async (id) => {
    return await mockApi.deleteProduct(id);
  },
};
