import Categories from "../models/Categories.model.js";
import SubCategoriesModel from "../models/SubCategories.model.js";

const createCategory = async (req, res) => {
    try {
        const { name, description, schoolId } = req.body;
        if (!name || !schoolId) {
            return res.status(400).json({ status: false, message: "Name and schoolId are required", data: null, error: true });
        }
        const existingCategory = await Categories.findOne({ name, schoolId });
        if (existingCategory) {
            return res.status(400).json({ status: false, message: "Category already exists for this school", data: null, error: true });
        }
        const category = await Categories.create({ name, description, schoolId });
        res.status(201).json({ status: true, message: "Category created successfully", data: category, error: false });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message || "Internal Server Error", data: null, error: true });
    }
}

const getAllCategories = async (req, res) => {
    try {
        const { schoolId } = req.params;
        // console.log(schoolId);
        if (!schoolId) {
            return res.status(400).json({ status: false, message: "SchoolId is required", data: null, error: true });
        }

        const categories = await Categories.find({ schoolId });

        if (!categories) {
            return res.status(404).json({ status: false, message: "Categories not found for this school", data: null, error: true });
        }
        res.status(200).json({ status: true, message: "Categories fetched successfully", data: categories, error: false });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message || "Internal Server Error", data: null, error: true });
    }
}

const updateCategory = async (req, res) => {
    try {
        const { name, description, schoolId } = req.body;
        const { id } = req.params;
        // console.log(id);
        if (!id) {
            return res.status(400).json({ status: false, message: "Category Id is required", data: null, error: true });
        }
        if (!name || !schoolId) {
            return res.status(400).json({ status: false, message: "Name and schoolId are required", data: null, error: true });
        }
        const existingCategory = await Categories.findOne({ _id: id });
        if (!existingCategory) {
            return res.status(404).json({ status: false, message: "Category not found", data: null, error: true });
        }
        const category = await Categories.findOneAndUpdate({ _id: id }, { name, description, schoolId });
        res.status(201).json({ status: true, message: "Category updated successfully", data: category, error: false });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message || "Internal Server Error", data: null, error: true });
    }
}

const deleteCategory = async (req, res) => {
    try {
        const { schoolId,id } = req.params;
        if (!id || !schoolId) {
            return res.status(400).json({ status: false, message: "Category Id and schoolId are required", data: null, error: true });
        }

        const exitingSubCategories = await SubCategoriesModel.findOne({ categoryId:id,schoolId });
        if (exitingSubCategories) {
            return res.status(400).json({ status: false, message: "SubCategories exists for this category so you can't delete this category or delete subcategories first", data: null, error: true });
        }

        const category = await Categories.findOneAndDelete({ _id: id,schoolId });
        if (!category) {
            return res.status(404).json({ status: false, message: "Category not found", data: null, error: true });
        }
        res.status(201).json({ status: true, message: "Category deleted successfully", data: category, error: false });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message || "Internal Server Error", data: null, error: true });
    }
}

export {
    createCategory,
    getAllCategories,
    updateCategory,
    deleteCategory
}
