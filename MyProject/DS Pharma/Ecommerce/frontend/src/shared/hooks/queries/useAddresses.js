import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { addressService } from "@/services/addressService";
import { useToastStore } from "@/store/useToastStore";

/**
 * Hook to fetch all addresses
 * Frontend-only: Uses localStorage-based mock data
 */
export const useAddresses = () => {
  return useQuery({
    queryKey: ["addresses"],
    queryFn: () => addressService.fetchAddresses(),
    staleTime: 30 * 60 * 1000, // 30 minutes - keep data fresh longer
    gcTime: 60 * 60 * 1000, // 60 minutes - keep in cache even when unmounted
    refetchOnMount: false, // Don't refetch when component remounts - prevents flicker
    refetchOnWindowFocus: false, // Don't refetch on window focus for better UX
    retry: false, // ← CRITICAL: Disable retries for frontend-only mode (no backend)
    retryOnMount: false, // Don't retry on mount
    // Provide fallback data so UI never breaks
    placeholderData: { data: [] },
  });
};

/**
 * Hook to add a new address
 */
export const useAddAddress = () => {
  const queryClient = useQueryClient();
  const { success, error } = useToastStore();

  return useMutation({
    mutationFn: (addressData) => addressService.addAddress(addressData),
    retry: false, // Disable retries for frontend-only mode
    onSuccess: () => {
      success("Address added successfully");
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
    },
    onError: (err) => {
      error(
        err.response?.data?.message || err.message || "Failed to add address"
      );
    },
  });
};

/**
 * Hook to update an address
 */
export const useUpdateAddress = () => {
  const queryClient = useQueryClient();
  const { success, error } = useToastStore();

  return useMutation({
    mutationFn: ({ id, data }) => addressService.updateAddress(id, data),
    retry: false, // Disable retries for frontend-only mode
    onSuccess: () => {
      success("Address updated successfully");
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
    },
    onError: (err) => {
      error(
        err.response?.data?.message || err.message || "Failed to update address"
      );
    },
  });
};

/**
 * Hook to delete an address
 */
export const useDeleteAddress = () => {
  const queryClient = useQueryClient();
  const { success, error } = useToastStore();

  return useMutation({
    mutationFn: (id) => addressService.deleteAddress(id),
    retry: false, // Disable retries for frontend-only mode
    onSuccess: () => {
      success("Address deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
    },
    onError: (err) => {
      error(
        err.response?.data?.message || err.message || "Failed to delete address"
      );
    },
  });
};
