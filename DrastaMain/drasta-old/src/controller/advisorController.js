const Advisor = require('../model/Advisor');


exports.createAdvisor = async (req, res) => {
  try {
    // 1) Log incoming form data + file
    console.log('📝 req.body =', req.body);
    console.log('🖼 req.file =', req.file);

    const { name, position, education, bio, cvLink } = req.body;
    const image = req.file?.path;

    // 2) Create in Mongo
    const advisor = await Advisor.create({
      name,
      position,
      education,
      bio,
      cvLink,
      image,
    });

    // 3) Return JSON on success
    return res.status(201).json({ advisor });
  } catch (err) {
    // 4) Fix error logging - stringify the error object
    console.error('❌ CREATE ADVISOR ERROR:');
    console.error('Error message:', err.message);
    console.error('Error stack:', err.stack);
    console.error('Full error object:', JSON.stringify(err, Object.getOwnPropertyNames(err), 2));

    // 5) If Mongoose validation error, extract messages
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res
        .status(400)
        .json({ error: 'Validation failed', details: messages });
    }

    // 6) Otherwise, send JSON
    return res
      .status(500)
      .json({ error: err.message || 'Internal Server Error' });
  }
};


exports.getAdvisors = async (req, res) => {
  try {
    const advisors = await Advisor.find().sort({ createdAt: -1 });
    res.json({ advisors });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.deleteAdvisor = async (req, res) => {
  try {
    const { id } = req.params;

    const advisor = await Advisor.findByIdAndDelete(id);

    if (!advisor) {
      return res.status(404).json({ error: 'Advisor not found' });
    }

    return res.status(200).json({ message: 'Advisor deleted successfully' });
  } catch (err) {
    console.error('❌ DELETE ADVISOR ERROR:');
    console.error('Error message:', err.message);
    console.error('Error stack:', err.stack);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};