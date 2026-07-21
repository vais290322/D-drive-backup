const Expert = require('../model/Expert');

exports.addExpert = async (req, res) => {
  try {
    console.log('📝 BODY:', req.body);
    // console.log('🖼 FILE:', req.file);
    console.log('🖼 FILE:', JSON.stringify(req.file, null, 2));

    const { name, title, expertise } = req.body;
    const image = req.file?.path;

    // Simple validation guard
    if (!name || !title || !expertise) {
      return res.status(400).json({
        error: 'Missing required fields: name, title, and expertise are all required',
      });
    }

    const expert = await Expert.create({ name, title, expertise, image });
    return res.status(201).json({ expert });
  } catch (err) {
    console.error('🔥 ADD EXPERT ERROR:', err);

    // Mongoose validation errors
    if (err.name === 'ValidationError') {
      const details = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ error: 'Validation failed', details });
    }

    // Multer errors (just in case)
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({ error: err.message });
    }

    // Fallback
    return res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
};

exports.getExperts = async (req, res) => {
  try {
    const experts = await Expert.find().sort({ createdAt: -1 });
    res.json({ experts });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteExpert = async (req, res) => {
  try {
    const { id } = req.params;
    const expert = await Expert.findByIdAndDelete(id);
    if (!expert) {
      return res.status(404).json({ message: 'Expert not found' });
    }
    res.json({ message: 'Expert deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
