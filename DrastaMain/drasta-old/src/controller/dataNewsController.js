const DataNews = require("../model/DataNews");
const { cloudinary } = require("../config/cloudinary");

// Create DataNews
const createDataNews = async (req, res) => {
    try {
        const { title, content } = req.body;
        let image = null;
        let public_id = null;
        if (req.file) {
            image = req.file.path;
            public_id = req.file.filename;
        }
        const news = await DataNews.create({
            title,
            content,
            image,
            public_id
        });
        res.status(201).json({ success: true, news });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Get all DataNews
const getAllDataNews = async (req, res) => {
    try {
        const newsList = await DataNews.find();
        res.status(200).json({ success: true, news: newsList });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get single DataNews
const getDataNews = async (req, res) => {
    try {
        const news = await DataNews.findById(req.params.id);
        if (!news) {
            return res.status(404).json({ success: false, message: "DataNews not found" });
        }
        res.status(200).json({ success: true, news });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update DataNews
const updateDataNews = async (req, res) => {
    try {
        const { title, content } = req.body;
        const news = await DataNews.findById(req.params.id);
        if (!news) {
            return res.status(404).json({ success: false, message: "DataNews not found" });
        }

        if (req.file) {
            // Delete old image from Cloudinary
            if (news.public_id) {
                await cloudinary.uploader.destroy(news.public_id);
            }
            news.image = req.file.path;
            news.public_id = req.file.filename;
        }

        news.title = title || news.title;
        news.content = content || news.content;

        await news.save();
        res.status(200).json({ success: true, news });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Delete DataNews
const deleteDataNews = async (req, res) => {
    try {
        const news = await DataNews.findById(req.params.id);
        if (!news) {
            return res.status(404).json({ success: false, message: "DataNews not found" });
        }
        // Delete image from Cloudinary
        if (news.public_id) {
            await cloudinary.uploader.destroy(news.public_id);
        }
        await news.deleteOne();
        res.status(200).json({ success: true, message: "DataNews deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    createDataNews,
    getAllDataNews,
    getDataNews,
    updateDataNews,
    deleteDataNews
};