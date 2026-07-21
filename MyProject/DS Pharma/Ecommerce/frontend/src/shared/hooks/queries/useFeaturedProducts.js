import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { featuredService } from "@/services/admin/api/featuredService";
import toastUtil from "@/shared/utils/toast";

/**
 * Hook to fetch all featured products
 */
export const useFeaturedProducts = () => {
  return useQuery({
    queryKey: ["featured-products"],
    queryFn: featuredService.getFeaturedProducts,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook to fetch all products for admin selection
 */
export const useAllProducts = (params = {}) => {
  return useQuery({
    queryKey: ["products", "all", params],
    queryFn: () => featuredService.getAllProducts(params),
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook to add a product to the featured list
 */
export const useAddFeaturedProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId) => featuredService.addToFeatured(productId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["featured-products"] });
      toastUtil.success(data?.message || "Added to featured products");
    },
    onError: (err) => {
      const message =
        err.response?.data?.message || "Failed to add to featured";
      toastUtil.error(message);
    },
  });
};

/**
 * Hook to remove a product from the featured list
 */
export const useRemoveFeaturedProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => featuredService.removeFromFeatured(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["featured-products"] });
      toastUtil.success(data?.message || "Removed from featured products");
    },
    onError: (err) => {
      const message =
        err.response?.data?.message || "Failed to remove from featured";
      toastUtil.error(message);
    },
  });
};
