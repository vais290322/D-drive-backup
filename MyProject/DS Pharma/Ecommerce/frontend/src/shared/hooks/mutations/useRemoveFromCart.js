import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCartStore } from "@/store/useCartStore";
import { useToastStore } from "@/store/useToastStore";

export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();
  const { success, error } = useToastStore();

  return useMutation({
    mutationFn: async (productId) => {
      // Direct update to Cart Store
      useCartStore.getState().removeItem(productId);
      return { success: true };
    },

    onSuccess: () => {
      success("Item removed from cart");
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },

    onError: (err) => {
      error("Failed to remove item");
      console.error(err);
    },
  });
};
