const CSRBlog = require("../model/CSRBlog");

// Create CSRBlog
const createCSRBlog = async (req, res) => {
    try {
        const { abstract, details, references } = req.body;
        const blog = await CSRBlog.create({ abstract, details, references });
        res.status(201).json({ success: true, blog });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Get all CSRBlogs
const getAllCSRBlogs = async (req, res) => {
    try {
        const blogs = await CSRBlog.find();
        res.status(200).json({ success: true, blogs });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get single CSRBlog
const getCSRBlog = async (req, res) => {
    try {
        const blog = await CSRBlog.findById(req.params.id);
        if (!blog) {
            return res.status(404).json({ success: false, message: "CSRBlog not found" });
        }
        res.status(200).json({ success: true, blog });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update CSRBlog
const updateCSRBlog = async (req, res) => {
    try {
        const { abstract, details, references } = req.body;
        const blog = await CSRBlog.findByIdAndUpdate(
            req.params.id,
            { abstract, details, references },
            { new: true, runValidators: true }
        );
        if (!blog) {
            return res.status(404).json({ success: false, message: "CSRBlog not found" });
        }
        res.status(200).json({ success: true, blog });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Delete CSRBlog
const deleteCSRBlog = async (req, res) => {
    try {
        const blog = await CSRBlog.findByIdAndDelete(req.params.id);
        if (!blog) {
            return res.status(404).json({ success: false, message: "CSRBlog not found" });
        }
        res.status(200).json({ success: true, message: "CSRBlog deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    createCSRBlog,
    getAllCSRBlogs,
    getCSRBlog,
    updateCSRBlog,
    deleteCSRBlog
};