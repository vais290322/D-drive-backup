import { useQuery } from "@tanstack/react-query";
import { productService } from "@/services/productService";

/**
 * Hook to fetch single product details
 * @param {string|number} productId - Product ID
 */
export const useProductDetails = (productId) => {
  return useQuery({
    queryKey: ["product", productId],
    queryFn: () => productService.fetchProductById(productId),
    enabled: !!productId && productId !== "undefined" && productId !== "null", // Only run if productId exists and is valid
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 15 * 60 * 1000,
  });
};
