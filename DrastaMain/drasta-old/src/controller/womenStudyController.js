const WomenStudy = require('../model/WomenStudy');

// POST /api/v1/womenstudy - create a new entry
exports.createWomenStudy = async (req, res) => {
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

    const entry = await WomenStudy.create({
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
    console.error('CREATE WOMEN STUDY ERROR:', err);
    if (err.name === 'ValidationError') {
      const details = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ success: false, error: 'Validation failed', details });
    }
    res.status(500).json({ success: false, error: err.message || 'Server Error' });
  }
};

// GET /api/v1/womenstudy - retrieve all entries
exports.getWomenStudies = async (req, res) => {
  try {
    const entries = await WomenStudy.find().sort({ createdAt: -1 });
    res.json({ success: true, entries });
  } catch (err) {
    console.error('GET WOMEN STUDY ERR:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// DELETE /api/v1/womenstudy/:id - delete an entry by ID
exports.deleteWomenStudy = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await WomenStudy.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Entry not found' });
    }
    res.json({ success: true, message: 'Entry deleted' });
  } catch (err) {
    console.error('DELETE WOMEN STUDY ERR:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

