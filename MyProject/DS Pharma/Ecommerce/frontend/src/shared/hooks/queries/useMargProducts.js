import { useQuery } from "@tanstack/react-query";
import { margProductService } from "@/services/margProductService";

/**
 * Hook to fetch products from Marg ERP with pagination
 * @param {Object} options - { page, limit, search }
 */
export const useMargProducts = (options = {}) => {
  return useQuery({
    queryKey: ["margProducts", options],
    queryFn: () => margProductService.getProducts(options),
    placeholderData: (previousData) => previousData, // Maintain data during transitions
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 1,
  });
};
