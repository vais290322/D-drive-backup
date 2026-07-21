const HeroSlide = require('../model/HeroSlide');

exports.createHeroSlide = async (req, res) => {
  try {
    const { title, subtitle, buttonText, buttonLink } = req.body;
    const image = req.file?.path;

    if (!title || !subtitle || !image) {
      return res.status(400).json({ error: 'Title, subtitle, and image are required.' });
    }

    const slide = await HeroSlide.create({ title, subtitle, buttonText, buttonLink, image });
    res.status(201).json({ success: true, slide });
  } catch (err) {
    console.error('CREATE HERO SLIDE ERROR:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getHeroSlides = async (req, res) => {
  try {
    const slides = await HeroSlide.find({ isActive: true }).sort({ createdAt: -1 });
    res.json({ success: true, slides });
  } catch (err) {
    console.error('GET HERO SLIDES ERROR:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.updateHeroSlide = async (req, res) => {
  try {
    const updates = { ...req.body };
    if (req.file?.path) updates.image = req.file.path;

    const slide = await HeroSlide.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!slide) return res.status(404).json({ success: false, error: 'Slide not found' });
    res.json({ success: true, slide });
  } catch (err) {
    console.error('UPDATE HERO SLIDE ERROR:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.deleteHeroSlide = async (req, res) => {
  try {
    const slide = await HeroSlide.findByIdAndDelete(req.params.id);
    if (!slide) return res.status(404).json({ success: false, error: 'Slide not found' });
    res.json({ success: true, message: 'Slide deleted' });
  } catch (err) {
    console.error('DELETE HERO SLIDE ERROR:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};


exports.getHeroSlideById = async (req, res) => {
  try {
    const slide = await HeroSlide.findById(req.params.id);
    if (!slide) {
      return res.status(404).json({ success: false, error: 'Slide not found' });
    }
    res.json({ success: true, slide });
  } catch (err) {
    console.error('GET HERO SLIDE BY ID ERROR:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};