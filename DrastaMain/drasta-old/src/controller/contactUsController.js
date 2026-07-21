const ContactUs = require("../model/ContactUs");

// Create ContactUs
const createContact = async (req, res) => {
    try {
        const { name, email, contact, subject, enquiry } = req.body;
        const contactEntry = await ContactUs.create({ name, email, contact, subject, enquiry });
        res.status(201).json({ success: true, contact: contactEntry });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Get all ContactUs entries
const getAllContacts = async (req, res) => {
    try {
        const contacts = await ContactUs.find();
        res.status(200).json({ success: true, contacts });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete ContactUs entry
const deleteContact = async (req, res) => {
    try {
        const contact = await ContactUs.findByIdAndDelete(req.params.id);
        if (!contact) {
            return res.status(404).json({ success: false, message: "Contact entry not found" });
        }
        res.status(200).json({ success: true, message: "Contact entry deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    createContact,
    getAllContacts,
    deleteContact
};