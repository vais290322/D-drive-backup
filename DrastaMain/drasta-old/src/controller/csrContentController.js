const CSRContent = require("../model/CSRContent");

// Create CSRContent
const createCSRContent = async (req, res) => {
    try {
        const { title, author, pdfLink } = req.body;
        const content = await CSRContent.create({ title, author, pdfLink });
        res.status(201).json({ success: true, content });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Get all CSRContents
const getAllCSRContents = async (req, res) => {
    try {
        const contents = await CSRContent.find();
        res.status(200).json({ success: true, contents });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get single CSRContent
const getCSRContent = async (req, res) => {
    try {
        const content = await CSRContent.findById(req.params.id);
        if (!content) {
            return res.status(404).json({ success: false, message: "CSRContent not found" });
        }
        res.status(200).json({ success: true, content });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update CSRContent
const updateCSRContent = async (req, res) => {
    try {
        const { title, author, pdfLink } = req.body;
        const content = await CSRContent.findByIdAndUpdate(
            req.params.id,
            { title, author, pdfLink },
            { new: true, runValidators: true }
        );
        if (!content) {
            return res.status(404).json({ success: false, message: "CSRContent not found" });
        }
        res.status(200).json({ success: true, content });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Delete CSRContent
const deleteCSRContent = async (req, res) => {
    try {
        const content = await CSRContent.findByIdAndDelete(req.params.id);
        if (!content) {
            return res.status(404).json({ success: false, message: "CSRContent not found" });
        }
        res.status(200).json({ success: true, message: "CSRContent deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    createCSRContent,
    getAllCSRContents,
    getCSRContent,
    updateCSRContent,
    deleteCSRContent
};