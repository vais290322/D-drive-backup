const SuperAdvisor = require("../model/SuperAdvior");
const { cloudinary } = require("../config/cloudinary");

const createSuperAdvisor = async (req, res) => {
    try {
        const { name, qualification } = req.body;
        const image = req.file ? req.file.path : null;
        if (!image) {
            return res.status(400).json({ success: false, message: "Image is required" });
        }
        const superAdvisor = await SuperAdvisor.create({
            name,
            image,
            qualification
        });
        res.status(201).json({ success: true, superAdvisor });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

const getAllSuperAdvisors = async (req, res) => {
    try {
        const superAdvisors = await SuperAdvisor.find();
        res.status(200).json({ success: true, superAdvisors });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getSuperAdvisor = async (req, res) => {
    try {
        const superAdvisor = await SuperAdvisor.findById(req.params.id);
        if (!superAdvisor) {
            return res.status(404).json({ success: false, message: "Super Advisor not found" });
        }
        res.status(200).json({ success: true, superAdvisor });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateSuperAdvisor = async (req, res) => {
    try {
        const { name, qualification } = req.body;
        const updateData = { name, qualification };

        if (req.file) {
            // Find old advisor to delete old image
            const oldAdvisor = await SuperAdvisor.findById(req.params.id);
            if (oldAdvisor && oldAdvisor.image) {
                // Extract public_id from URL
                const publicId = oldAdvisor.image.split("/").pop().split(".")[0];
                await cloudinary.uploader.destroy(`cdrasta/${publicId}`);
            }
            updateData.image = req.file.path;
        }

        const superAdvisor = await SuperAdvisor.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );
        if (!superAdvisor) {
            return res.status(404).json({ success: false, message: "Super Advisor not found" });
        }
        res.status(200).json({ success: true, superAdvisor });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

const deleteSuperAdvisor = async (req, res) => {
    try {
        const superAdvisor = await SuperAdvisor.findByIdAndDelete(req.params.id);
        if (!superAdvisor) {
            return res.status(404).json({ success: false, message: "Super Advisor not found" });
        }
        // Delete image from Cloudinary
        if (superAdvisor.image) {
            const publicId = superAdvisor.image.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(`cdrasta/${publicId}`);
        }
        res.status(200).json({ success: true, message: "Super Advisor deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    createSuperAdvisor,
    getAllSuperAdvisors,
    getSuperAdvisor,
    updateSuperAdvisor,
    deleteSuperAdvisor
};