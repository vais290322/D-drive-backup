import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { productService } from "@/services/productService";

/**
 * Hook to fetch products with infinite scrolling
 */
export const useInfiniteProducts = ({
  categoryId,
  limit = 12,
  ...otherFilters
} = {}) => {
  return useInfiniteQuery({
    queryKey: ["products", "infinite", { categoryId, limit, ...otherFilters }],
    queryFn: async ({ pageParam = 1 }) => {
       const response = categoryId 
        ? await productService.getCategoryProducts(categoryId, { page: pageParam, limit })
        : await productService.getProducts({ page: pageParam, limit, ...otherFilters });
       
       return response;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { currentPage, totalPages } = lastPage.pagination || {};
      if (currentPage < totalPages) return currentPage + 1;
      return undefined;
    },
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook to fetch products with optional category filter and pagination
 * @param {Object} params - { category?: string, page?: number, limit?: number, ...otherFilters }
 */
export const useProducts = ({
  categoryId,
  category,
  page = 1,
  limit = 12,
  ...otherFilters
} = {}) => {
  return useQuery({
    queryKey: [
      "products",
      { categoryId, category, page, limit, ...otherFilters },
    ],
    queryFn: async () => {
      // If categoryId is provided, use category-specific API
      if (categoryId || category) {
        return await productService.getCategoryProducts(
          categoryId || category,
          {
            page,
            limit,
          },
        );
      }
      // Otherwise use generic products API (for admin/legacy)
      return await productService.getProducts({ page, limit, ...otherFilters });
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // Previously cacheTime
  });
};

/**
 * Hook to fetch all categories
 */
export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => productService.getCategories(),
    staleTime: 60 * 60 * 1000, // 1 hour (categories don't change often)
  });
};
