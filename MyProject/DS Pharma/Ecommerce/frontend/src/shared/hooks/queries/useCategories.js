import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { categoryService } from "@/services/categoryService";
import toastUtil from "@/shared/utils/toast";

/**
 * Hook to fetch all product categories with pagination and search
 * @param {Object} params - Query parameters { search, page, limit }
 */
export const useCategories = (params = {}) => {
  const { search = "", page = 1, limit = 10 } = params;
  return useQuery({
    queryKey: ["categories", { search, page, limit }],
    queryFn: () => categoryService.getAllCategories({ search, page, limit }),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

/**
 * Hook to fetch a single category by ID
 */
export const useCategoryById = (id) => {
  return useQuery({
    queryKey: ["categories", id],
    queryFn: () => categoryService.getCategoryById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook to fetch only visible categories for the website
 */
export const useVisibleCategories = () => {
  return useQuery({
    queryKey: ["categories", "visible"],
    queryFn: () => categoryService.getVisibleCategories(),
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook to create a new category
 */
export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (categoryData) => categoryService.createCategory(categoryData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      const message = data?.message || "Category created successfully";
      toastUtil.success(message);
    },
    onError: (error) => {
      const message =
        error.response?.data?.message || "Failed to create category";
      toastUtil.error(message);
    },
  });
};

/**
 * Hook to update an existing category
 */
export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => categoryService.updateCategory(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      const message = data?.message || "Category updated successfully";
      toastUtil.success(message);
    },
    onError: (error) => {
      const message =
        error.response?.data?.message || "Failed to update category";
      toastUtil.error(message);
    },
  });
};

/**
 * Hook to delete a category
 */
export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => categoryService.deleteCategory(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      const message = data?.message || "Category deleted successfully";
      toastUtil.success(message);
    },
    onError: (error) => {
      const message =
        error.response?.data?.message || "Failed to delete category";
      toastUtil.error(message);
    },
  });
};
