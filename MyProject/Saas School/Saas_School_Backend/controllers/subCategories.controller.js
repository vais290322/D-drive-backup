import SubCategoriesModel from "../models/SubCategories.model.js";

const createSubCategories = async (req, res) => {
    try {
        const { name, categoryId,schoolId } = req.body;
        if(!name || !categoryId || !schoolId){
            return res.status(400).json({success:false, message: "All fields are required",data:null, error:true });
        }
        const existingSubCategories = await SubCategoriesModel.findOne({ name, categoryId,schoolId });
        if(existingSubCategories){
            return res.status(400).json({success:false, message: "SubCategories already exists",data:null, error:true });
        }
        const subCategories = await SubCategoriesModel.create({ name, categoryId,schoolId });
        res.status(201).json({success:true, message: "SubCategories created successfully",data:subCategories, error:false });
    } catch (error) {
        res.status(500).json({success:false, message: error.message || "SubCategories creation failed",data:null, error:true });
    }
};


const getAllSubCategories = async (req, res) => {
    const { schoolId } = req.params;
    if(!schoolId){
        return res.status(400).json({success:false, message: "School ID is required",data:null, error:true });
    }
    try {
        const subCategories = await SubCategoriesModel.find({ schoolId }).populate("categoryId");
        res.status(200).json({success:true, message: "SubCategories fetched successfully",data:subCategories, error:false });
    } catch (error) {
        res.status(500).json({success:false, message: error.message || "SubCategories fetching failed",data:null, error:true });
    }
};

const getSubCategoriesByCategoryId = async (req, res) => {
    const { categoryId,schoolId } = req.params;
    if(!categoryId || !schoolId){
        return res.status(400).json({success:false, message: "Category ID and School ID are required",data:null, error:true });
    }
    try {
        const subCategories = await SubCategoriesModel.find({ categoryId,schoolId }).populate("categoryId");
        if(!subCategories){
            return res.status(404).json({success:false, message: "SubCategories not found for this category and school",data:null, error:true });
        }
        res.status(200).json({success:true, message: "SubCategories fetched successfully",data:subCategories, error:false });
    } catch (error) {
        res.status(500).json({success:false, message: error.message || "SubCategories fetching failed",data:null, error:true });
    }
};

const updateSubCategories = async (req, res) => {
    const { id } = req.params;
    const { name, categoryId,schoolId } = req.body;
    if(!id){
        return res.status(400).json({success:false, message: "SubCategories ID is required",data:null, error:true });
    }
    if(!name || !categoryId || !schoolId){
        return res.status(400).json({success:false, message: "All fields are required",data:null, error:true });
    }
    try {
        const subCategories = await SubCategoriesModel.findByIdAndUpdate({ _id:id }, { name, categoryId,schoolId }, { new: true });
        if(!subCategories){
            return res.status(404).json({success:false, message: "SubCategories not found",data:null, error:true });
        }
        res.status(200).json({success:true, message: "SubCategories updated successfully",data:subCategories, error:false });
    } catch (error) {
        res.status(500).json({success:false, message: error.message || "SubCategories updating failed",data:null, error:true });
    }
};

const deleteSubCategories = async (req, res) => {
    const { id, schoolId } = req.params;
    if(!id || !schoolId){
        return res.status(400).json({success:false, message: "SubCategories ID and School ID are required",data:null, error:true });
    }
    try {
        const subCategories = await SubCategoriesModel.findByIdAndDelete({ _id:id }, {schoolId});
        if(!subCategories){
            return res.status(404).json({success:false, message: "SubCategories not found for this school",data:null, error:true });
        }
        res.status(200).json({success:true, message: "SubCategories deleted successfully",data:subCategories, error:false });
    } catch (error) {
        res.status(500).json({success:false, message: error.message || "SubCategories deleting failed",data:null, error:true });
    }
};

export { createSubCategories, getAllSubCategories, getSubCategoriesByCategoryId, updateSubCategories, deleteSubCategories };
