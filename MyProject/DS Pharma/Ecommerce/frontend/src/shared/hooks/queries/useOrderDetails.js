import { useQuery } from "@tanstack/react-query";
import { orderService } from "../../services/orderService";
import { useToastStore } from "../../store/useToastStore";

/**
 * Hook to fetch a single order by ID
 */
export const useOrderDetails = (orderId) => {
  const { error } = useToastStore();

  return useQuery({
    queryKey: ["order", orderId],
    queryFn: async () => {
      try {
        const response = await orderService.getOrderById(orderId);
        return response.data;
      } catch (err) {
        error("Failed to fetch order details");
        throw err;
      }
    },
    enabled: !!orderId, // Only run if orderId is provided
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
