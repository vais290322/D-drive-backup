import { useMutation, useQueryClient } from "@tanstack/react-query";
import { orderService } from "@/services/orderService";
import { useToastStore } from "@/store/useToastStore";

export const useReturnOrder = () => {
  const queryClient = useQueryClient();
  const { success, error } = useToastStore();

  return useMutation({
    mutationFn: (orderId) => orderService.returnOrder(orderId),

    onSuccess: () => {
      success("Return request submitted successfully");
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["order", "details"] });
    },

    onError: (err) => {
      error("Failed to submit return request");
      console.error(err);
    },
  });
};
