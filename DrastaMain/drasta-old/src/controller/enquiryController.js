const Enquiry = require('../model/Enquiry');

exports.createEnquiry = async (req, res) => {
  try {
    const { name, email, contactNo, subject, message } = req.body;
    const enquiry = await Enquiry.create({ name, email, contactNo, subject, message });
    res.status(201).json({ success: true, enquiry });
  } catch (err) {
    console.error('CREATE ENQUIRY ERROR:', err);
    if (err.name === 'ValidationError') {
      const details = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ success: false, error: 'Validation failed', details });
    }
    res.status(500).json({ success: false, error: err.message || 'Server Error' });
  }
};

exports.getEnquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 });
    res.json({ success: true, enquiries });
  } catch (err) {
    console.error('GET ENQUIRIES ERROR:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.deleteEnquiry = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Enquiry.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Enquiry not found' });
    }
    res.json({ success: true, message: 'Enquiry deleted' });
  } catch (err) {
    console.error('DELETE ENQUIRY ERROR:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};