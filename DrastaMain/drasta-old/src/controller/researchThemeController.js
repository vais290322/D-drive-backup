const ResearchTheme = require("../model/ResearchTheme");
const { cloudinary } = require("../config/cloudinary");

// Create ResearchTheme
const createResearchTheme = async (req, res) => {
    try {
        const { contentHeader, contentFooter } = req.body;
        if (!req.file) {
            return res.status(400).json({ success: false, message: "Image is required" });
        }
        const image = req.file.path;
        const public_id = req.file.filename;
        const theme = await ResearchTheme.create({
            contentHeader,
            image,
            contentFooter,
            public_id
        });
        res.status(201).json({ success: true, theme });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Get all ResearchThemes
const getAllResearchThemes = async (req, res) => {
    try {
        const themes = await ResearchTheme.find();
        res.status(200).json({ success: true, themes });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get single ResearchTheme
const getResearchTheme = async (req, res) => {
    try {
        const theme = await ResearchTheme.findById(req.params.id);
        if (!theme) {
            return res.status(404).json({ success: false, message: "ResearchTheme not found" });
        }
        res.status(200).json({ success: true, theme });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update ResearchTheme
const updateResearchTheme = async (req, res) => {
    try {
        const { contentHeader, contentFooter } = req.body;
        const theme = await ResearchTheme.findById(req.params.id);
        if (!theme) {
            return res.status(404).json({ success: false, message: "ResearchTheme not found" });
        }

        if (req.file) {
            // Delete old image from Cloudinary
            if (theme.public_id) {
                await cloudinary.uploader.destroy(theme.public_id);
            }
            theme.image = req.file.path;
            theme.public_id = req.file.filename;
        }

        theme.contentHeader = contentHeader || theme.contentHeader;
        theme.contentFooter = contentFooter || theme.contentFooter;

        await theme.save();
        res.status(200).json({ success: true, theme });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Delete ResearchTheme
const deleteResearchTheme = async (req, res) => {
    try {
        const theme = await ResearchTheme.findById(req.params.id);
        if (!theme) {
            return res.status(404).json({ success: false, message: "ResearchTheme not found" });
        }
        // Delete image from Cloudinary
        if (theme.public_id) {
            await cloudinary.uploader.destroy(theme.public_id);
        }
        await theme.deleteOne();
        res.status(200).json({ success: true, message: "ResearchTheme deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    createResearchTheme,
    getAllResearchThemes,
    getResearchTheme,
    updateResearchTheme,
    deleteResearchTheme
};