const Administration = require("../model/Administration");
const { cloudinary } = require("../config/cloudinary");

// Create Administration
const createAdministration = async (req, res) => {
    try {
        const { name, position, description } = req.body;
        const image = req.file ? req.file.path : null;
        const public_id = req.file ? req.file.filename : null;
        if (!image) {
            return res.status(400).json({ success: false, message: "Image is required" });
        }
        const admin = await Administration.create({
            name,
            image,
            position,
            description,
            public_id
        });
        res.status(201).json({ success: true, admin });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Get all Administrations
const getAllAdministrations = async (req, res) => {
    try {
        const admins = await Administration.find();
        res.status(200).json({ success: true, admins });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get single Administration
const getAdministration = async (req, res) => {
    try {
        const admin = await Administration.findById(req.params.id);
        if (!admin) {
            return res.status(404).json({ success: false, message: "Administration not found" });
        }
        res.status(200).json({ success: true, admin });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update Administration
const updateAdministration = async (req, res) => {
    try {
        const { name, position, description } = req.body;
        const admin = await Administration.findById(req.params.id);
        if (!admin) {
            return res.status(404).json({ success: false, message: "Administration not found" });
        }

        // If new image, delete old from Cloudinary and update
        if (req.file) {
            if (admin.public_id) {
                await cloudinary.uploader.destroy(admin.public_id);
            }
            admin.image = req.file.path;
            admin.public_id = req.file.filename;
        }

        admin.name = name || admin.name;
        admin.position = position || admin.position;
        admin.description = description || admin.description;

        await admin.save();
        res.status(200).json({ success: true, admin });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Delete Administration
const deleteAdministration = async (req, res) => {
    try {
        const admin = await Administration.findById(req.params.id);
        if (!admin) {
            return res.status(404).json({ success: false, message: "Administration not found" });
        }
        // Delete image from Cloudinary
        if (admin.public_id) {
            await cloudinary.uploader.destroy(admin.public_id);
        }
        await admin.deleteOne();
        res.status(200).json({ success: true, message: "Administration deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    createAdministration,
    getAllAdministrations,
    getAdministration,
    updateAdministration,
    deleteAdministration
};