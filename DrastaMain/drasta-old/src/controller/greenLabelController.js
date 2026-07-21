const GreenLabel = require('../model/GreenLabel');

// Create a new Green Label submission
exports.createGreenLabel = async (req, res) => {
  try {
    const {
      name,
      sex,
      occupation,
      stateOfResidence,
      contactDetails,
      cellNo,
      email,
      comments
    } = req.body;

    const entry = await GreenLabel.create({
      name,
      sex,
      occupation,
      stateOfResidence,
      contactDetails,
      cellNo,
      email,
      comments
    });

    res.status(201).json({ success: true, entry });
  } catch (err) {
    console.error('CREATE GREEN LABEL ERROR:', err);
    if (err.name === 'ValidationError') {
      const details = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ success: false, error: 'Validation failed', details });
    }
    res.status(500).json({ success: false, error: err.message || 'Server Error' });
  }
};

// Get all submissions
exports.getGreenLabels = async (req, res) => {
  try {
    const entries = await GreenLabel.find().sort({ createdAt: -1 });
    res.json({ success: true, entries });
  } catch (err) {
    console.error('GET GREEN LABELS ERROR:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};


// Delete a submission by ID
exports.deleteGreenLabel = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await GreenLabel.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Entry not found' });
    }
    res.json({ success: true, message: 'Entry deleted' });
  } catch (err) {
    console.error('DELETE GREEN LABEL ERROR:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};
