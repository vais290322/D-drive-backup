const SubCategory = require("../models/subCategory.models.js");

// Create SubCategory
exports.createSubCategory = async (req, res) => {
  try {
    const { name } = req.body;

    // Check if SubCategory already exists
    const existingSubCategory = await SubCategory.findOne({ name });
    if (existingSubCategory)
      return res.status(400).json({ error: "SubCategory already exists" });

    const subCategory = new SubCategory(req.body);
    await subCategory.save();
    res.status(201).json({ message: "SubCategory created", data: subCategory });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all SubCategories
exports.getSubCategories = async (req, res) => {
  try {
    const { search = "", page = 1, limit = 10 } = req.query;

    // Convert page and limit to numbers
    const currentPage = parseInt(page, 10);
    const perPage = parseInt(limit, 10);

    // Build query for search
    const query = search
      ? { name: { $regex: search, $options: "i" } } // case-insensitive search
      : {};

    // Get total count for pagination
    const total = await SubCategory.countDocuments(query);

    // Fetch paginated data
    const subCategories = await SubCategory.find(query)
      .skip((currentPage - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 }); // optional: sort by newest first

    res.status(200).json({
      message: "SubCategories fetched successfully",
      data: subCategories,
      pagination: {
        totalItems: total,
        totalPages: Math.ceil(total / perPage),
        currentPage,
        limit: perPage,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getSubCategory = async (req, res) => {
  try {
    // Fetch paginated data
    const subCategories = await SubCategory.find({})
      .sort({ createdAt: -1 }); // optional: sort by newest first

    res.status(200).json({
      message: "SubCategories fetched successfully",
      data: subCategories,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get single SubCategory
exports.getSubCategorybyid = async (req, res) => {
  try {
    const subCategory = await SubCategory.findById(req.params.id);
    if (!subCategory)
      return res.status(404).json({ error: "SubCategory not found" });
    res.status(200).json({ message: "SubCategory fetched", data: subCategory });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update SubCategory
exports.updateSubCategory = async (req, res) => {
  try {
    const subCategory = await SubCategory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!subCategory)
      return res.status(404).json({ error: "SubCategory not found" });
    res.status(200).json({ message: "SubCategory updated", data: subCategory });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete SubCategory
exports.deleteSubCategory = async (req, res) => {
  try {
    const subCategory = await SubCategory.findByIdAndDelete(req.params.id);
    if (!subCategory)
      return res.status(404).json({ error: "SubCategory not found" });
    res.status(200).json({ message: "SubCategory deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
