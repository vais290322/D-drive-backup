const Category = require("../models/category.models");
const { cloudinary } = require("../config/cloudinary");

// CREATE CATEGORY
exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!req.file)
      return res.status(400).json({ message: "Image is required" });

    // Check if category already exists
    const existingCategory = await Category.findOne({ name });
    if (existingCategory)
      return res.status(400).json({ message: "Category already exists" });

    const category = await Category.create({
      name,
      description,
      image: {
        public_id: req.file.filename,
        url: req.file.path,
      },
    });

    res
      .status(201)
      .json({ message: "Category created successfully", category });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating category", error });
  }
};

// GET ALL CATEGORIES
exports.getCategories = async (req, res) => {
  try {
    const { search = "", page = 1, limit = 10 } = req.query;

    const currentPage = parseInt(page, 10);
    const perPage = parseInt(limit, 10);

    // Build search query (case-insensitive)
    const query = {
      $or: [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ],
    };

    // Get total count for pagination
    const total = await Category.countDocuments(query);

    // Fetch paginated results
    const categories = await Category.find(query)
      .sort({ createdAt: -1 })
      .skip((currentPage - 1) * perPage)
      .limit(perPage);

    res.status(200).json({
      message: "Categories fetched successfully",
      data: categories,
      pagination: {
        totalItems: total,
        totalPages: Math.ceil(total / perPage),
        currentPage,
        limit: perPage,
      },
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Error fetching categories", error });
  }
};

exports.getCategoryall = async (req, res) => {
  try {
   
    // Fetch paginated results
    const categories = await Category.find({})
      .sort({ createdAt: -1 })
     
    res.status(200).json({
      message: "Categories fetched successfully",
      data: categories,
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Error fetching categories", error });
  }
};

// GET SINGLE CATEGORY
exports.getCategorybyid = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category)
      return res.status(404).json({ message: "Category not found" });
    res.status(200).json({ message: "Category fetched successfully",data: category });
  } catch (error) {
    res.status(500).json({ message: "Error fetching category", error });
  }
};

// UPDATE CATEGORY
exports.updateCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const category = await Category.findById(req.params.id);

    if (!category)
      return res.status(404).json({ message: "Category not found" });
    // Check if category name already exists
    const existingCategory = await Category.findOne({ name });
    if (existingCategory && existingCategory._id.toString() !== category._id.toString())
      return res.status(400).json({ message: "Category name already exists" });

    // If new image uploaded, delete old and replace
    if (req.file) {
      await cloudinary.uploader.destroy(category.image.public_id);
      category.image = {
        public_id: req.file.filename,
        url: req.file.path,
      };
    }

    category.name = name || category.name;
    category.description = description || category.description;

    await category.save();

    res
      .status(200)
      .json({ message: "Category updated successfully", data: category });
  } catch (error) {
    res.status(500).json({ message: "Error updating category", error });
  }
};

// DELETE CATEGORY
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category)
      return res.status(404).json({ message: "Category not found" });

    await cloudinary.uploader.destroy(category.image.public_id);
    await category.deleteOne();

    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting category", error });
  }
};
