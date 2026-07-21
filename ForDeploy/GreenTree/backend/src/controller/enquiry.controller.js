const Enquiry = require('../models/enquiry.models');

// Create Enquiry
exports.createEnquiry = async (req, res) => {
    try {
        const {product, name, email, phone, message } = req.body;
        if (!name || !email || !message) {
            return res.status(400).json({ message: "Name, email, and message are required" });
        }
        const enquiry = new Enquiry({ product,name, email, phone, message });
        await enquiry.save();
        res.status(201).json({ message: "Enquiry submitted successfully", data: enquiry });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all Enquiries
exports.getAllEnquiries = async (req, res) => {
    try {
      const { search } = req.query;
  
      // 🔍 Build dynamic search filter
      let filter = {};
      if (search) {
        filter = {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
            { phone: { $regex: search, $options: "i" } },
            { message: { $regex: search, $options: "i" } },
          ],
        };
      }
  
      const enquiries = await Enquiry.find(filter)
        .sort({ createdAt: -1 })
        .populate("product");
  
      res.status(200).json({
        message: "Enquiries fetched successfully",
        data: enquiries,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  

// Get single Enquiry by ID
exports.getEnquiryById = async (req, res) => {
    try {
        const enquiry = await Enquiry.findById(req.params.id).populate("product");
        if (!enquiry) return res.status(404).json({ message: "Enquiry not found" });
        res.status(200).json({message:"fetch suceessfull" ,data: enquiry });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Delete Enquiry
exports.deleteEnquiry = async (req, res) => {
    try {
        const enquiry = await Enquiry.findByIdAndDelete(req.params.id);
        if (!enquiry) return res.status(404).json({ message: "Enquiry not found" });
        res.status(200).json({ message: "Enquiry deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};