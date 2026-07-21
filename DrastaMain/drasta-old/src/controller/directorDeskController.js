const DirectorsDesk = require("../model/DirectorsDesk");
const { cloudinary } = require("../config/cloudinary");

// Create DirectorsDesk
const createDirectorsDesk = async (req, res) => {
    try {
        const { name, description } = req.body;
        let image = null;
        let public_id = null;
        if (req.file) {
            image = req.file.path;
            public_id = req.file.filename;
        }
        const director = await DirectorsDesk.create({
            name,
            image,
            description,
            public_id
        });
        res.status(201).json({ success: true, director });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Get all DirectorsDesk entries
const getAllDirectorsDesk = async (req, res) => {
    try {
        const directors = await DirectorsDesk.find();
        res.status(200).json({ success: true, directors });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get single DirectorsDesk entry
const getDirectorsDesk = async (req, res) => {
    try {
        const director = await DirectorsDesk.findById(req.params.id);
        if (!director) {
            return res.status(404).json({ success: false, message: "DirectorsDesk not found" });
        }
        res.status(200).json({ success: true, director });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update DirectorsDesk
const updateDirectorsDesk = async (req, res) => {
    try {
        const { name, description } = req.body;
        const director = await DirectorsDesk.findById(req.params.id);
        if (!director) {
            return res.status(404).json({ success: false, message: "DirectorsDesk not found" });
        }

        if (req.file) {
            // Delete old image from Cloudinary
            if (director.public_id) {
                await cloudinary.uploader.destroy(director.public_id);
            }
            director.image = req.file.path;
            director.public_id = req.file.filename;
        }

        director.name = name || director.name;
        director.description = description || director.description;

        await director.save();
        res.status(200).json({ success: true, director });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Delete DirectorsDesk
const deleteDirectorsDesk = async (req, res) => {
    try {
        const director = await DirectorsDesk.findById(req.params.id);
        if (!director) {
            return res.status(404).json({ success: false, message: "DirectorsDesk not found" });
        }
        // Delete image from Cloudinary
        if (director.public_id) {
            await cloudinary.uploader.destroy(director.public_id);
        }
        await director.deleteOne();
        res.status(200).json({ success: true, message: "DirectorsDesk deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    createDirectorsDesk,
    getAllDirectorsDesk,
    getDirectorsDesk,
    updateDirectorsDesk,
    deleteDirectorsDesk
};