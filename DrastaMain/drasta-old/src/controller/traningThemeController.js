const TraningTheme = require("../model/TraningTheme");
const { cloudinary } = require("../config/cloudinary");

// Create TraningTheme
const createTraningTheme = async (req, res) => {
    try {
        const { content } = req.body;
        if (!req.file) {
            return res.status(400).json({ success: false, message: "Image is required" });
        }
        const image = req.file.path;
        const public_id = req.file.filename;
        const theme = await TraningTheme.create({ content, image, public_id });
        res.status(201).json({ success: true, theme });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Get all TraningThemes
const getAllTraningThemes = async (req, res) => {
    try {
        const themes = await TraningTheme.find();
        res.status(200).json({ success: true, themes });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get single TraningTheme
const getTraningTheme = async (req, res) => {
    try {
        const theme = await TraningTheme.findById(req.params.id);
        if (!theme) {
            return res.status(404).json({ success: false, message: "TraningTheme not found" });
        }
        res.status(200).json({ success: true, theme });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update TraningTheme
const updateTraningTheme = async (req, res) => {
    try {
        const { content } = req.body;
        const theme = await TraningTheme.findById(req.params.id);
        if (!theme) {
            return res.status(404).json({ success: false, message: "TraningTheme not found" });
        }

        if (req.file) {
            // Delete old image from Cloudinary
            if (theme.public_id) {
                await cloudinary.uploader.destroy(theme.public_id);
            }
            theme.image = req.file.path;
            theme.public_id = req.file.filename;
        }

        theme.content = content || theme.content;

        await theme.save();
        res.status(200).json({ success: true, theme });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Delete TraningTheme
const deleteTraningTheme = async (req, res) => {
    try {
        const theme = await TraningTheme.findById(req.params.id);
        if (!theme) {
            return res.status(404).json({ success: false, message: "TraningTheme not found" });
        }
        // Delete image from Cloudinary
        if (theme.public_id) {
            await cloudinary.uploader.destroy(theme.public_id);
        }
        await theme.deleteOne();
        res.status(200).json({ success: true, message: "TraningTheme deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    createTraningTheme,
    getAllTraningThemes,
    getTraningTheme,
    updateTraningTheme,
    deleteTraningTheme
};