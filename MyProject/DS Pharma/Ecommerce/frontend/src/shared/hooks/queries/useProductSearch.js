import { useQuery } from "@tanstack/react-query";
import { productService } from "@/services/productService";

/**
 * Hook for product search with debounced query and pagination
 * @param {Object} params - { search: string, page: number, limit: number }
 */
export const useProductSearch = ({
  search = "",
  page = 1,
  limit = 12,
} = {}) => {
  return useQuery({
    queryKey: ["productSearch", { search, page, limit }],
    queryFn: () => productService.searchUserProducts({ search, page, limit }),
    enabled: search?.length > 0, // Only search if there's a query
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000,
  });
};
