const AboutGallery = require("../model/AboutGallery");
const { cloudinary } = require("../config/cloudinary");

// Add image to carousel
const addImage = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ success: false, message: "Image is required" });
        const { path, filename } = req.file;
        let gallery = await AboutGallery.findOne();
        if (!gallery) {
            gallery = await AboutGallery.create({ images: [{ url: path, public_id: filename }] });
        } else {
            gallery.images.push({ url: path, public_id: filename });
            await gallery.save();
        }
        res.status(201).json({ success: true, gallery });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Get all images
const getGallery = async (req, res) => {
    try {
        const gallery = await AboutGallery.findOne();
        res.status(200).json({ success: true, gallery });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update a specific image (replace)
const updateImage = async (req, res) => {
    try {
        const { imageId } = req.params;
        if (!req.file) return res.status(400).json({ success: false, message: "Image is required" });
        const gallery = await AboutGallery.findOne();
        if (!gallery) return res.status(404).json({ success: false, message: "Gallery not found" });

        const image = gallery.images.id(imageId);
        if (!image) return res.status(404).json({ success: false, message: "Image not found" });

        // Delete old image from Cloudinary
        await cloudinary.uploader.destroy(image.public_id);

        // Update with new image
        image.url = req.file.path;
        image.public_id = req.file.filename;
        await gallery.save();

        res.status(200).json({ success: true, gallery });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Delete a specific image
const deleteImage = async (req, res) => {
    try {
        const { imageId } = req.params;
        const gallery = await AboutGallery.findOne();
        if (!gallery) return res.status(404).json({ success: false, message: "Gallery not found" });

        const image = gallery.images.find(img => img._id.toString() === imageId);
        if (!image) return res.status(404).json({ success: false, message: "Image not found" });

        // Delete from Cloudinary
        await cloudinary.uploader.destroy(image.public_id);

        // Remove from array
        gallery.images.pull({ _id: imageId });
        await gallery.save();

        res.status(200).json({ success: true, gallery });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

module.exports = {
    addImage,
    getGallery,
    updateImage,
    deleteImage
};