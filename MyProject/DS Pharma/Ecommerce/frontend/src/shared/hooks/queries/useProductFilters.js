import { useQuery } from "@tanstack/react-query";
import { productService } from "@/services/productService";

/**
 * Hook for filtered products (price, brand, sort)
 * @param {Object} filters - { minPrice, maxPrice, brand, sort, page, limit }
 */
export const useProductFilters = ({
  minPrice,
  maxPrice,
  brand,
  sort = "relevance",
  page = 1,
  limit = 12,
} = {}) => {
  return useQuery({
    queryKey: [
      "productFilters",
      { minPrice, maxPrice, brand, sort, page, limit },
    ],
    queryFn: () =>
      productService.getFilteredProducts({
        minPrice,
        maxPrice,
        brand,
        sort,
        page,
        limit,
      }),
    staleTime: 3 * 60 * 1000, // 3 minutes
    gcTime: 5 * 60 * 1000,
  });
};
