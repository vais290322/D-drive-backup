const MainCategory = require("../models/mainCategory.models.js");

// ✅ Create Main Category
exports.createMainCategory = async (req, res) => {
  try {
    // console.log("req.body", req.body);
    if(!req.body){
      return res.status(400).json({ message: "Request body is empty" });
    }
    const { name, description,image, subcategories } = req.body;

    if (!name || !description) {
      return res.status(400).json({ message: "Name and description are required" });
    }
    // Check if a category with the same name already exists
    const existingCategory = await MainCategory.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ message: "Same Category Allready Added" });
    }

    const mainCategory = await MainCategory({
      name,
      description,
      image,
      subcategories: subcategories ,
    });
    await mainCategory.save();

    res
      .status(201)
      .json({ message: "Main category created successfully", data:mainCategory });
  } catch (error) {
    console.error("Error creating main category:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

// ✅ Get All Main Categories
exports.getMainCategories = async (req, res) => {
  try {
    const { search = "", page = 1, limit = 5 } = req.query;

    // Convert page & limit to numbers
    const currentPage = parseInt(page, 10);
    const perPage = parseInt(limit, 10);

    // Build search filter
    const query = {
      $or: [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ],
    };

    // Fetch total count for pagination
    const totalCategories = await MainCategory.countDocuments(query);

    // Fetch paginated data
    const categories = await MainCategory.find(query)
      .populate("subcategories", "name description")
      .sort({ createdAt: -1 })
      .skip((currentPage - 1) * perPage)
      .limit(perPage);

    res.status(200).json({
      message: "Categories fetched successfully",
      data: categories,
      pagination: {
        totalItems: totalCategories,
        totalPages: Math.ceil(totalCategories / perPage),
        currentPage,
        limit: perPage,
      },
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Error fetching categories", error });
  }
};

exports.getMainCategoryall = async (req, res) => {
  try {
    
    const category = await MainCategory.find({}).populate(
      "subcategories",
      "name description"
    );

  

    res.status(200).json({message:"Main Category fetched successfully",data:category});
  } catch (error) {
    res.status(500).json({ message: "Error fetching category", error });
  }
};

exports.getMainCategoryByFilter = async (req, res) => {
  try {
    const name = req.params.name;
    const category = await MainCategory.findOne({name:name}).populate(
      "subcategories",
      "name description"
    );

    if (!category) {
      return res.status(404).json({ message: "Main category not found" });
    }

    res.status(200).json({message:"Main Category fetched successfully",data:category});
  } catch (error) {
    res.status(500).json({ message: "Error fetching category", error });
  }
};
// ✅ Get Single Main Category
exports.getMainCategoryById = async (req, res) => {
  try {
    const category = await MainCategory.findById(req.params.id).populate(
      "subcategories",
      "name description"
    );

    if (!category) {
      return res.status(404).json({ message: "Main category not found" });
    }

    res.status(200).json({message:"Category fetched successfully",data:category});
  } catch (error) {
    res.status(500).json({ message: "Error fetching category", error });
  }
};

// ✅ Update Main Category
exports.updateMainCategory = async (req, res) => {
  try {
    const { name, description, image, subcategories } = req.body;
    const category = await MainCategory.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: "Main category not found" });
    }
    // Check if a category with the same name already exists (excluding the current category)
    const existingCategory = await MainCategory.findOne({
      name,
      _id: { $ne: category._id },
    });
    if (existingCategory) {
      return res.status(400).json({ message: "Main category with this name already exists" });
    }
   

    const updateddata= await MainCategory.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        image,
        subcategories: subcategories,
      },
      { new: true }
    );

    res
      .status(200)
      .json({ message: "Main category updated successfully", data:updateddata });
  } catch (error) {
    console.error("Error updating main category:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

// ✅ Delete Main Category
exports.deleteMainCategory = async (req, res) => {
  try {
    const category = await MainCategory.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: "Main category not found" });
    }

    // Delete associated subcategories
    // if (category.subcategories.length > 0) {
    //   await SubCategory.deleteMany({ _id: { $in: category.subcategories } });
    // }

    // Delete the main category
   const deletedata= await MainCategory.findByIdAndDelete(req.params.id)

    res.status(200).json({ message: "Main category deleted successfully" ,data:deletedata});
  } catch (error) {
    res.status(500).json({ message: "Error deleting category", error });
  }
};
