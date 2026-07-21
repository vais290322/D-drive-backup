import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { cartService } from "@/services/cartService";
import toastUtil from "@/shared/utils/toast";

/**
 * Hook to fetch cart data
 */
export const useCart = () => {
  return useQuery({
    queryKey: ["cart"],
    queryFn: cartService.getCart,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false, // Don't retry on auth errors
  });
};

/**
 * Hook to add item to cart
 */
export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cartService.addToCart,
    onSuccess: () => {
      toastUtil.success("Product added to cart");
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (error) => {
      // Handled by global interceptor, but we can add specific logic here if needed
    },
  });
};

/**
 * Hook to update cart item quantity with Optimistic Updates
 */
export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, quantity }) => cartService.updateCartItem(id, quantity),

    onMutate: async ({ id, quantity }) => {
      // Cancel any outgoing refetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey: ["cart"] });

      // Snapshot the previous value
      const previousCart = queryClient.getQueryData(["cart"]);

      // Optimistically update to the new value
      queryClient.setQueryData(["cart"], (old) => {
        if (!old || !old.data) return old;

        return {
          ...old,
          data: old.data.map((item) =>
            item._id === id ? { ...item, quantity } : item,
          ),
        };
      });

      // Return a context object with the snapshotted value
      return { previousCart };
    },

    onError: (err, newTodo, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      queryClient.setQueryData(["cart"], context.previousCart);
      toastUtil.error("Failed to update quantity");
    },

    onSettled: () => {
      // Always refetch after error or success to ensure sync
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};

/**
 * Hook to remove item from cart with Optimistic Updates
 */
export const useRemoveCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cartService.removeFromCart,

    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["cart"] });
      const previousCart = queryClient.getQueryData(["cart"]);

      queryClient.setQueryData(["cart"], (old) => {
        if (!old || !old.data) return old;
        return {
          ...old,
          data: old.data.filter((item) => item._id !== id),
        };
      });

      return { previousCart };
    },

    onSuccess: () => {
      toastUtil.success("Item removed from cart");
    },

    onError: (err, id, context) => {
      queryClient.setQueryData(["cart"], context.previousCart);
      toastUtil.error("Failed to remove item");
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};
