import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCartStore } from "@/store/useCartStore";
import { useToastStore } from "@/store/useToastStore";

export const useUpdateCart = () => {
  const queryClient = useQueryClient();
  const { error } = useToastStore();

  return useMutation({
    mutationFn: async ({ productId, quantity }) => {
      // Direct update to Cart Store
      useCartStore.getState().updateQuantity(productId, quantity);
      return { success: true };
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },

    onError: (err) => {
      error("Failed to update cart");
      console.error(err);
    },
  });
};
