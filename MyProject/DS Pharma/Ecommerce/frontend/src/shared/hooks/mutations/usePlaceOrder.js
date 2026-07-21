import { useMutation, useQueryClient } from "@tanstack/react-query";
import mockApi from "@/services/api/mockApi";
import { useToastStore } from "@/store/useToastStore";
import { useNavigate } from "react-router-dom";

export const usePlaceOrder = () => {
  const queryClient = useQueryClient();
  const { error } = useToastStore();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (orderData) => mockApi.placeOrder(orderData),

    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["cart"] });

      // Navigate directly to Order Details
      if (response?.data?.id) {
        navigate(`/order-confirmation/${response.data.id}`);
      } else {
        navigate("/orders");
      }
    },

    onError: (err) => {
      error(err.message || "Failed to place order. Please try again.");
      console.error(err);
    },
  });
};
