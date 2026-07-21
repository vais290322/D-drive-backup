import ApiResponse from "../../utils/apiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";
import {
  createCategoryService,
  deleteCategoryService,
  fetchAllCategoriesService,
  updateCategoryService,
} from "./category.service.js";

export const createCategory = asyncHandler(async (req, res) => {
  const { name, visibility = true, images = [] } = req.body;

  const category = await createCategoryService(name.trim(), visibility, images);

  return res
    .status(200)
    .json(new ApiResponse(200, category, "Category created successfully"));
});

export const fetchAllCategories = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query = "", all } = req.query;

  const response = await fetchAllCategoriesService(
    parseInt(page),
    parseInt(limit),
    query,
    all,
  );

  const data = all
    ? response
    : {
        categories: response.categories,
        totalCategories: response.totalCategories,
        totalPages: response.totalPages,
        currentPage: response.currentPage,
        hasMore: response.hasMore,
      };

  return res
    .status(200)
    .json(new ApiResponse(200, data, "Categories fetched successfully"));
});

export const updateCategory = asyncHandler(async (req, res) => {
  const { name, visibility, images } = req.body;
  const { id } = req.params;

  const updatedCategory = await updateCategoryService(
    id,
    name.trim(),
    visibility,
    images,
  );

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedCategory, "Category updated successfully"),
    );
});

export const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const deletedCategory = await deleteCategoryService(id);

  return res
    .status(200)
    .json(
      new ApiResponse(200, deletedCategory, "Category deleted successfully"),
    );
});
