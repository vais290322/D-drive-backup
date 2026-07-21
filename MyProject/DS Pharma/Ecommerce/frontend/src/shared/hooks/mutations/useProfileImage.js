import { useMutation, useQueryClient } from "@tanstack/react-query";
import profileImageService from "@/services/profileImageService";
import { useToastStore } from "@/store/useToastStore";

/**
 * Hook to upload profile image
 * @returns {MutationResult}
 */
export const useUploadProfileImage = () => {
  const queryClient = useQueryClient();
  const { success, error } = useToastStore();

  return useMutation({
    mutationFn: ({ userId, file }) =>
      profileImageService.uploadProfileImage(userId, file),
    onSuccess: (data) => {
      // Invalidate profile queries to refetch updated data
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
      success(data.message || "Profile picture updated successfully!");
    },
    onError: (err) => {
      error(err.message || "Failed to upload image. Please try again.");
    },
  });
};

/**
 * Hook to remove profile image
 * @returns {MutationResult}
 */
export const useRemoveProfileImage = () => {
  const queryClient = useQueryClient();
  const { success, error } = useToastStore();

  return useMutation({
    mutationFn: (userId) => profileImageService.removeProfileImage(userId),
    onSuccess: (data) => {
      // Invalidate profile queries
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
      success(data.message || "Profile picture removed successfully");
    },
    onError: (err) => {
      error(err.message || "Failed to remove image. Please try again.");
    },
  });
};
