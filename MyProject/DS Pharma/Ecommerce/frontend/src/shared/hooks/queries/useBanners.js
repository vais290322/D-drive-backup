import { useQuery } from "@tanstack/react-query";
import { mockContentService } from "@/services/mockContentService";

// Note: Future proofing for real service integration
// import { contentService } from '../../services/contentService';
// For now directly using mock service or we can create a contentService wrapper

export const useBanners = () => {
  return useQuery({
    queryKey: ["banners"],
    queryFn: () => mockContentService.getBanners(),
    staleTime: 60 * 60 * 1000, // 1 hour
  });
};
