import SubCategory from "../models/subCategory.js";
import { cloudinary } from "../service/cloudinary.js";

export async function createSubCategory(req, res) {
  try {
    const { name, description, categoryId, active } = req.body;

    if (!name || !categoryId) {
      return res
        .status(400)
        .json({ success: false, message: "Name and categoryId are required" });
    }

    const data = { name, description, categoryId, active };

    // Handle image upload
    if (req.file) {
      data.image = req.file.path;
      data.imagePublicId = req.file.filename;
    }

    const created = await SubCategory.create(data);
    res.status(201).json({
      success: true,
      message: "SubCategory created successfully",
      data: created,
    });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
}

export async function updateSubCategory(req, res) {
  try {
    const { id } = req.params;
    const { name, description, categoryId, active } = req.body;

    const data = { name, description, categoryId, active };

    // Handle image upload
    if (req.file) {
      const subCategory = await SubCategory.findById(id);
      if (subCategory && subCategory.imagePublicId) {
        await cloudinary.uploader.destroy(subCategory.imagePublicId);
      }
      data.image = req.file.path;
      data.imagePublicId = req.file.filename;
    }

    const updated = await SubCategory.findByIdAndUpdate(id, data, {
      new: true,
    });
    if (!updated) {
      return res
        .status(404)
        .json({ success: false, message: "SubCategory not found" });
    }

    res.json({
      success: true,
      message: "SubCategory updated successfully",
      data: updated,
    });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
}

export async function getSubCategoryById(req, res) {
  try {
    const subCategory = await SubCategory.findById(req.params.id).populate(
      "categoryId"
    );
    if (!subCategory) {
      return res
        .status(404)
        .json({ success: false, message: "SubCategory not found" });
    }
    res.json({
      success: true,
      message: "SubCategory fetched successfully",
      data: subCategory,
    });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
}

export async function getAllSubCategories(req, res) {
  try {
    const subCategories = await SubCategory.find().populate("categoryId");
    res.json({
      success: true,
      message: "SubCategories fetched successfully",
      data: subCategories,
    });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
}

export async function getSubCategoriesByCategoryId(req, res) {
  try {
    const { categoryId } = req.params;
    const subCategories = await SubCategory.find({ categoryId });
    res.json({
      success: true,
      message: "SubCategories fetched by categoryId",
      data: subCategories,
    });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
}

export async function deleteSubCategory(req, res) {
  try {
    const { id } = req.params;
    const subCategory = await SubCategory.findById(id);

    if (!subCategory) {
      return res
        .status(404)
        .json({ success: false, message: "SubCategory not found" });
    }

    // Delete image from Cloudinary if exists
    if (subCategory.imagePublicId) {
      await cloudinary.uploader.destroy(subCategory.imagePublicId);
    }

    await SubCategory.findByIdAndDelete(id);
    res.json({ success: true, message: "SubCategory deleted successfully" });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
}

export async function searchSubCategories(req, res) {
  try {
    const query = req.query.query || "";
    const regex = new RegExp(query, "i");
    const subCategories = await SubCategory.find({
      $or: [{ name: regex }, { description: regex }],
    }).populate("categoryId");
    res.json({ success: true, message: "Search results", data: subCategories });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
}
