import ApiResponse from "../../utils/apiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";
import { fetchAllCategoriesService } from "./category.service.js";

export const fetchAllCategories = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query = "" } = req.params;

  const { categories, totalCategories, totalPages, currentPage, hasMore } =
    await fetchAllCategoriesService(page, limit, query);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { categories, totalCategories, totalPages, currentPage, hasMore },
        "Categories fetched successfully",
      ),
    );
});
