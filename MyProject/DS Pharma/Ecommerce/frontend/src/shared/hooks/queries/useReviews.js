import { useQuery } from "@tanstack/react-query";
import { mockReviewService } from "@/services/mockReviewService";

export const useReviews = (productId) => {
  return useQuery({
    queryKey: ["reviews", productId],
    queryFn: () => mockReviewService.getReviews(productId),
    enabled: !!productId,
    staleTime: 5 * 60 * 1000,
  });
};
