const VisitorAndIntern = require("../model/VisitorAndIntern");
const { cloudinary } = require("../config/cloudinary");

// Add intern to a year (create year if not exists)
const addIntern = async (req, res) => {
    try {
        const { year, name, details } = req.body;
        if (!req.file) return res.status(400).json({ success: false, message: "Image is required" });
        const image = req.file.path;
        const public_id = req.file.filename;

        let doc = await VisitorAndIntern.findOne();
        if (!doc) {
            doc = await VisitorAndIntern.create({ years: [] });
        }
        let yearObj = doc.years.find(y => y.year === year);
        if (!yearObj) {
            yearObj = { year, interns: [] };
            doc.years.push(yearObj);
        }
        yearObj.interns.push({ name, details, image, public_id });
        await doc.save();
        res.status(201).json({ success: true, data: doc });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Get all years and interns
const getAll = async (req, res) => {
    try {
        const doc = await VisitorAndIntern.findOne();
        res.status(200).json({ success: true, data: doc });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update an intern (by year and intern id)
const updateIntern = async (req, res) => {
    try {
        const { year, internId } = req.params;
        const { name, details } = req.body;
        const doc = await VisitorAndIntern.findOne();
        if (!doc) return res.status(404).json({ success: false, message: "Not found" });

        const yearObj = doc.years.find(y => y.year === year);
        if (!yearObj) return res.status(404).json({ success: false, message: "Year not found" });

        const intern = yearObj.interns.id(internId);
        if (!intern) return res.status(404).json({ success: false, message: "Intern not found" });

        if (req.file) {
            // Delete old image from Cloudinary
            await cloudinary.uploader.destroy(intern.public_id);
            intern.image = req.file.path;
            intern.public_id = req.file.filename;
        }
        intern.name = name || intern.name;
        intern.details = details || intern.details;

        await doc.save();
        res.status(200).json({ success: true, data: doc });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Delete an intern (by year and intern id)
const deleteIntern = async (req, res) => {
    try {
        const { year, internId } = req.params;
        const doc = await VisitorAndIntern.findOne();
        if (!doc) return res.status(404).json({ success: false, message: "Not found" });

        const yearObj = doc.years.find(y => y.year === year);
        if (!yearObj) return res.status(404).json({ success: false, message: "Year not found" });

        const intern = yearObj.interns.id(internId);
        if (!intern) return res.status(404).json({ success: false, message: "Intern not found" });

        // Delete image from Cloudinary
        await cloudinary.uploader.destroy(intern.public_id);

        // Remove intern
        yearObj.interns.pull({ _id: internId });
        await doc.save();

        res.status(200).json({ success: true, data: doc });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

module.exports = {
    addIntern,
    getAll,
    updateIntern,
    deleteIntern
};