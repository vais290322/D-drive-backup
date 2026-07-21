const News = require('../model/News');

// Create a news item
exports.createNews = async (req, res) => {
  try {
    const { title, content, readMoreLink } = req.body;
    const newsItem = await News.create({ title, content, readMoreLink });
    res.status(201).json({ success: true, newsItem });
  } catch (err) {
    console.error('CREATE NEWS ERROR:', err);
    if (err.name === 'ValidationError') {
      const details = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ success: false, error: 'Validation failed', details });
    }
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get all news items
exports.getNews = async (req, res) => {
  try {
    const newsList = await News.find().sort({ date: -1 });
    res.json({ success: true, news: newsList });
  } catch (err) {
    console.error('GET NEWS ERROR:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get single news by ID
exports.getNewsById = async (req, res) => {
  try {
    const { id } = req.params;
    const newsItem = await News.findById(id);
    if (!newsItem) return res.status(404).json({ success: false, error: 'News not found' });
    res.json({ success: true, newsItem });
  } catch (err) {
    console.error('GET NEWS BY ID ERROR:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// Update news by ID
exports.updateNews = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = (({ title, content, readMoreLink, date }) => ({ title, content, readMoreLink, date }))(req.body);
    const newsItem = await News.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    if (!newsItem) return res.status(404).json({ success: false, error: 'News not found' });
    res.json({ success: true, newsItem });
  } catch (err) {
    console.error('UPDATE NEWS ERROR:', err);
    if (err.name === 'ValidationError') {
      const details = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ success: false, error: 'Validation failed', details });
    }
    res.status(500).json({ success: false, error: err.message });
  }
};

// Delete news by ID
exports.deleteNews = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await News.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ success: false, error: 'News not found' });
    res.json({ success: true, message: 'News deleted' });
  } catch (err) {
    console.error('DELETE NEWS ERROR:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

