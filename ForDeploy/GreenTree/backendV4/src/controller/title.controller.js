const Title = require('../models/title.models');

// Create Title
exports.createTitle = async (req, res) => {
    try {
        const { title} = req.body;
        if (!title) {
            return res.status(400).json({ message: "Title is required" });
        }
        const existingTitle = await Title.find({});
        if (existingTitle.length > 0) {
            return res.status(400).json({ message: "Only Title Can be Added" });
        }
        const newTitle = new Title({title});
        await newTitle.save();
        res.status(201).json({ message: "Title created", data: newTitle });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all Titles
exports.getTitles = async (req, res) => {
    try {
        const titles = await Title.find().sort({ createdAt: -1 });
        res.status(200).json({ data: titles });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get single Title by ID
exports.getTitleById = async (req, res) => {
    try {
        const title = await Title.findById(req.params.id);
        if (!title) return res.status(404).json({ message: "Title not found" });
        res.status(200).json({ data: title });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update Title
exports.updateTitle = async (req, res) => {
    try {
        const { title } = req.body;
        const updatedTitle = await Title.findByIdAndUpdate(
            req.params.id,
            { title },
            { new: true }
        );
        if (!updatedTitle) return res.status(404).json({ message: "Title not found" });
        res.status(200).json({ message: "Title updated", data: updatedTitle });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete Title
exports.deleteTitle = async (req, res) => {
    try {
        const deletedTitle = await Title.findByIdAndDelete(req.params.id);
        if (!deletedTitle) return res.status(404).json({ message: "Title not found" });
        res.status(200).json({ message: "Title deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};