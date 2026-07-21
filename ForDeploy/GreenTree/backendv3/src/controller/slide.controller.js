const Slide = require('../models/slide.models');
const { cloudinary } = require('../config/cloudinary');

// Create Slide
exports.createSlide = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No image uploaded" });
        }
        const result = await cloudinary.uploader.upload(req.file.path);
        const slide = new Slide({
            image: result.secure_url,
            imagePublicId: result.public_id,
            category: req.body.category
        });
        await slide.save();
        res.status(201).json({ message: "Slide created", data: slide });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all slides
exports.getSlides = async (req, res) => {
    try {
        const slides = await Slide.find().sort({ createdAt: -1 });
        res.status(200).json({message: "Slide fetched successfully ", data: slides });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete slide
exports.deleteSlide = async (req, res) => {
    try {
        const slide = await Slide.findById(req.params.id);
        if (!slide) return res.status(404).json({ message: "Slide not found" });
        if (slide.imagePublicId) {
            await cloudinary.uploader.destroy(slide.imagePublicId);
        }
        await Slide.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Slide deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};