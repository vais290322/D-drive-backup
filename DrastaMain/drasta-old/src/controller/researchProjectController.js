const ResearchProject = require("../model/ResearchProject");
const { cloudinary } = require("../config/cloudinary");

// Create ResearchProject
const createResearchProject = async (req, res) => {
    try {
        const { title, description, pdfLink } = req.body;
        if (!req.file) {
            return res.status(400).json({ success: false, message: "Image is required" });
        }
        const image = req.file.path;
        const public_id = req.file.filename;
        const project = await ResearchProject.create({
            title,
            description,
            image,
            pdfLink,
            public_id
        });
        res.status(201).json({ success: true, project });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Get all ResearchProjects
const getAllResearchProjects = async (req, res) => {
    try {
        const projects = await ResearchProject.find();
        res.status(200).json({ success: true, projects });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get single ResearchProject
const getResearchProject = async (req, res) => {
    try {
        const project = await ResearchProject.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ success: false, message: "ResearchProject not found" });
        }
        res.status(200).json({ success: true, project });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update ResearchProject
const updateResearchProject = async (req, res) => {
    try {
        const { title, description, pdfLink } = req.body;
        const project = await ResearchProject.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ success: false, message: "ResearchProject not found" });
        }

        if (req.file) {
            // Delete old image from Cloudinary
            if (project.public_id) {
                await cloudinary.uploader.destroy(project.public_id);
            }
            project.image = req.file.path;
            project.public_id = req.file.filename;
        }

        project.title = title || project.title;
        project.description = description || project.description;
        project.pdfLink = pdfLink || project.pdfLink;

        await project.save();
        res.status(200).json({ success: true, project });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Delete ResearchProject
const deleteResearchProject = async (req, res) => {
    try {
        const project = await ResearchProject.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ success: false, message: "ResearchProject not found" });
        }
        // Delete image from Cloudinary
        if (project.public_id) {
            await cloudinary.uploader.destroy(project.public_id);
        }
        await project.deleteOne();
        res.status(200).json({ success: true, message: "ResearchProject deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    createResearchProject,
    getAllResearchProjects,
    getResearchProject,
    updateResearchProject,
    deleteResearchProject
};