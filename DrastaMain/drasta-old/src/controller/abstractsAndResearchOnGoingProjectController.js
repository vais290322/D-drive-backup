const AbstractsAndResearchOnGoingProject = require("../model/AbstractsAndResearchOnGoingProject");

// Create
const createAbstract = async (req, res) => {
    try {
        const { title, description } = req.body;
        if (!title || !description) {
            return res.status(400).json({ success: false, message: "Title and description are required" });
        }
        console.log("Creating abstract with title:", title);
        const abstract = await AbstractsAndResearchOnGoingProject.create({ title, description });
        res.status(201).json({ success: true, abstract });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
        console.error("Error creating abstract:", error);
    }
};

// Get all
const getAllAbstracts = async (req, res) => {
    try {
        const abstracts = await AbstractsAndResearchOnGoingProject.find();
        res.status(200).json({ success: true, abstracts });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get single
const getAbstract = async (req, res) => {
    try {
        const abstract = await AbstractsAndResearchOnGoingProject.findById(req.params.id);
        if (!abstract) {
            return res.status(404).json({ success: false, message: "Abstract not found" });
        }
        res.status(200).json({ success: true, abstract });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update
const updateAbstract = async (req, res) => {
    try {
        const { title, description } = req.body;
        const abstract = await AbstractsAndResearchOnGoingProject.findByIdAndUpdate(
            req.params.id,
            { title, description },
            { new: true, runValidators: true }
        );
        if (!abstract) {
            return res.status(404).json({ success: false, message: "Abstract not found" });
        }
        res.status(200).json({ success: true, abstract });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Delete
const deleteAbstract = async (req, res) => {
    try {
        const abstract = await AbstractsAndResearchOnGoingProject.findByIdAndDelete(req.params.id);
        if (!abstract) {
            return res.status(404).json({ success: false, message: "Abstract not found" });
        }
        res.status(200).json({ success: true, message: "Abstract deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    createAbstract,
    getAllAbstracts,
    getAbstract,
    updateAbstract,
    deleteAbstract
};