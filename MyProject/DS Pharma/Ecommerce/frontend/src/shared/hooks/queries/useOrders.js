import { useQuery } from "@tanstack/react-query";
import { orderService } from "@/services/orderService";

/**
 * Hook to fetch all orders
 */
export const useOrders = () => {
  return useQuery({
    queryKey: ["orders"],
    queryFn: () => orderService.fetchOrders(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to fetch single order details
 * @param {string|number} orderId - Order ID
 */
export const useOrderDetails = (orderId) => {
  return useQuery({
    queryKey: ["order", orderId],
    queryFn: () => orderService.fetchOrderById(orderId),
    enabled: !!orderId,
    staleTime: 5 * 60 * 1000,
  });
};
