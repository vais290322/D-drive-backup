import axios from "axios";
import Category from "./category.model.js";

export const fetchAllCategoriesService = async (page, limit, query) => {
  try {
    const skip = (page - 1) * limit;

    const queryOptions = {};

    if (query) {
      queryOptions.$or = [{ catcode: { $regex: query, $options: "i" } }];
    }

    // const categories = await Category.find(queryOptions)
    //   .skip(skip)
    //   .limit(limit)
    //   .lean();

    const categories = await axios.get(`${backendBaseUrl}/api/v1/categories`, {
      params: {
        page,
        limit,
        search:query,
      },
    });

    const totalCategories = categories.data.totalCategories;

    const totalPages = Math.ceil(totalCategories / limit);

    return {
      categories:categories.data.categories,
      totalCategories,
      page,
      limit,
      totalPages,
      currentPage: page,
      hasMore: page < totalPages,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};
