import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "@/services/authService";
import { useAuthStore } from "@/store/useAuthStore";
import toastUtil from "@/shared/utils/toast";

/**
 * Hook to fetch user profile
 */
export const useProfile = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const response = await authService.getCurrentUser();
      return response;
    },
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to update user profile
 */
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const { setUser } = useAuthStore();

  return useMutation({
    mutationFn: (profileData) => authService.updateProfile(profileData),
    onSuccess: (response) => {
      const userData = response.data || response;
      toastUtil.success("Profile updated successfully");
      // Update store
      setUser(userData);
      // Invalidate profile query
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: (err) => {
      const message = err.message || "Failed to update profile";
      toastUtil.error(message);
    },
  });
};
