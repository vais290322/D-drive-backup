import Category from "../models/category.js";

export async function createCategory(req, res) {
  try {
    const { name } = req.body;

    if (!name || name.trim() === "") {
      return res
        .status(400)
        .json({ success: false, message: "Category name is required" });
    }

    // Check if category with same name already exists
    const existing = await Category.findOne({ name: name.trim() });
    if (existing) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Category with this name already exists",
        });
    }

    const category = await Category.create({ name: name.trim() });

    res
      .status(201)
      .json({
        success: true,
        message: "Category created successfully",
        data: category,
      });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
}

export async function getAllCategories(req, res) {
  try {
    const categories = await Category.find();
    res.json({
      success: true,
      message: "Categories fetched successfully",
      data: categories,
    });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
}

export async function updateCategory(req, res) {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name || name.trim() === "") {
      return res
        .status(400)
        .json({ success: false, message: "Category name is required" });
    }

    const updated = await Category.findByIdAndUpdate(
      id,
      { name: name.trim() },
      { new: true }
    );
    if (!updated)
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    res.json({
      success: true,
      message: "Category updated successfully",
      data: updated,
    });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
}

export async function deleteCategory(req, res) {
  try {
    const { id } = req.params;
    const deleted = await Category.findByIdAndDelete(id);
    if (!deleted)
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    res.json({ success: true, message: "Category deleted successfully" });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
}
