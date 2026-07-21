import { useMutation, useQueryClient } from "@tanstack/react-query";
import { orderService } from "@/services/orderService";
import { useToastStore } from "@/store/useToastStore";

export const useCancelOrder = () => {
  const queryClient = useQueryClient();
  const { success, error } = useToastStore();

  return useMutation({
    mutationFn: (orderId) => orderService.cancelOrder(orderId),

    onSuccess: () => {
      success("Order cancelled successfully");
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },

    onError: (err) => {
      error("Failed to cancel order");
      console.error(err);
    },
  });
};
