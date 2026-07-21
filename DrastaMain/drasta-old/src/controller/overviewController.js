const Overview = require('../model/Overview');

// CREATE
exports.createOverview = async (req, res) => {
  try {
    const { overview } = req.body;
    const entry = await Overview.create({ overview });
    res.status(201).json({ success: true, entry });
  } catch (err) {
    console.error('CREATE ERROR:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// READ ALL
exports.getAllOverviews = async (req, res) => {
  try {
    const entries = await Overview.find();
    res.json({ success: true, entries });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// READ BY ID
exports.getOverviewById = async (req, res) => {
  try {
    const entry = await Overview.findById(req.params.id);
    if (!entry) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, entry });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// UPDATE
exports.updateOverview = async (req, res) => {
  try {
    const entry = await Overview.findByIdAndUpdate(req.params.id, { overview: req.body.overview }, { new: true, runValidators: true });
    if (!entry) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, entry });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE
exports.deleteOverview = async (req, res) => {
  try {
    const deleted = await Overview.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
