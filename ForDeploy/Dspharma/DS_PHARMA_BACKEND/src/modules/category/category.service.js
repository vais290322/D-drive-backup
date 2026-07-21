import ApiError from "../../utils/apiError.js";
import Category from "./category.model.js";

export const createCategoryService = async (name, visibility, images) => {
  try {
    const existedCategory = await Category.findOne({ name });

    console.log(existedCategory);

    if (existedCategory) {
      console.log("Category already exists");
      throw new ApiError(400, "Category already exists");
    }

    const category = await Category.create({ name, visibility, images });
    return category;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, "Error updating category");
  }
};

export const fetchAllCategoriesService = async (
  page,
  limit,
  query,
  all = false,
) => {
  try {
    if (all) {
      const categories = await Category.find({}).sort({ createdAt: -1 });

      return categories;
    }

    const categories = await Category.aggregate([
      {
        $match: {
          $or: [{ name: { $regex: query, $options: "i" } }],
        },
      },
      {
        $skip: (page - 1) * limit,
      },
      {
        $limit: Number(limit),
      },
    ]);

    const totalCategories = await Category.countDocuments({
      $or: [{ name: { $regex: query, $options: "i" } }],
    });

    const totalPages = Math.ceil(totalCategories / limit);

    return {
      categories,
      totalCategories,
      page,
      limit,
      totalPages,
      currentPage: page,
      hasMore: page < totalPages,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, "Error fetching categories");
  }
};

export const updateCategoryService = async (id, name, visibility, images) => {
  try {
    const existedCategory = await Category.findById(id);

    if (!existedCategory) {
      throw new ApiError(404, "Category not found");
    }

    const category = await Category.findByIdAndUpdate(
      id,
      { name, visibility, images },
      { new: true },
    );
    return category;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(500, "Error updating category");
  }
};

export const deleteCategoryService = async (id) => {
  try {
    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      throw new ApiError(404, "Category not found");
    }

    return category;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, "Error deleting category");
  }
};
