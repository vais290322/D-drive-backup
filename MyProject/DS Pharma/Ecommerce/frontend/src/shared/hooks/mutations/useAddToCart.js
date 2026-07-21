import { useMutation, useQueryClient } from "@tanstack/react-query";
import useDataStore from "@/store/useDataStore";
import { useToastStore } from "@/store/useToastStore";

/**
 * Hook to add product to cart
 */
export const useAddToCart = () => {
  const queryClient = useQueryClient();
  const { success, error } = useToastStore();

  return useMutation({
    mutationFn: async ({ product }) => {
      const cart = useDataStore.getState().cart;
      const exists = cart.some((item) => item.id === product.id);

      if (exists) {
        return { alreadyInCart: true, name: product.name };
      }

      useDataStore.getState().addToCart(product);
      return { success: true, name: product.name };
    },

    onSuccess: (data) => {
      if (data.alreadyInCart) {
        success(`${data.name} is already in your cart!`);
      } else {
        success(`Added ${data.name} to cart!`);
      }
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },

    onError: (err) => {
      error("Failed to add product to cart");
      console.error(err);
    },
  });
};
