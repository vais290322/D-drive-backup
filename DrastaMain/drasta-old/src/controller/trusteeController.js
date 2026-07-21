const Trustee = require('../model/Trustee');
const { cloudinary } = require('../config/cloudinary');

// Create a trustee with image upload
exports.createTrustee = async (req, res) => {
  try {
    console.log('📝 req.body =', req.body);
    console.log('🖼 req.file =', req.file);
    console.log('🔧 Multer storage path:', req.file?.path);

    const { name, desc } = req.body;
    const img = req.file?.path;

    // Validation
    if (!name || !desc) {
      return res.status(400).json({ 
        success: false, 
        message: 'Name and description are required.' 
      });
    }

    if (!img) {
      return res.status(400).json({ 
        success: false, 
        message: 'Image is required.' 
      });
    }

    console.log('Creating trustee with data:', { name, desc, img });

    const trustee = await Trustee.create({ name, desc, img });

    console.log('✅ Trustee created successfully:', trustee);

    res.status(201).json({ success: true, data: trustee });
  } catch (err) {
    console.error('❌ CREATE TRUSTEE ERROR:');
    console.error('Error message:', err.message);
    console.error('Error stack:', err.stack);
    console.error('Full error:', JSON.stringify(err, Object.getOwnPropertyNames(err), 2));

    // Handle mongoose validation errors
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ 
        success: false, 
        message: 'Validation failed', 
        details: messages 
      });
    }

    res.status(500).json({ success: false, message: err.message });
  }
};
// Get all trustees
exports.getTrustees = async (req, res) => {
  try {
    const trustees = await Trustee.find().sort({ createdAt: -1 });
    res.json({ success: true, data: trustees });
  } catch (err) {
    console.error('GET TRUSTEES ERROR:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get single trustee by ID
exports.getTrusteeById = async (req, res) => {
  try {
    const trustee = await Trustee.findById(req.params.id);
    if (!trustee) return res.status(404).json({ success: false, message: 'Trustee not found' });

    res.json({ success: true, data: trustee });
  } catch (err) {
    console.error('GET TRUSTEE BY ID ERROR:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update trustee by ID, supports optional image update
exports.updateTrustee = async (req, res) => {
  try {
    const { name, desc } = req.body;
    const trustee = await Trustee.findById(req.params.id);

    if (!trustee) {
      return res.status(404).json({ success: false, message: 'Trustee not found' });
    }

    // If a new image is uploaded
    if (req.file?.path) {
      // Optional: Extract public_id and delete old image
      const publicId = trustee.img.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`trustees/${publicId}`);

      trustee.img = req.file.path;
    }

    trustee.name = name || trustee.name;
    trustee.desc = desc || trustee.desc;

    await trustee.save();

    res.json({ success: true, data: trustee });
  } catch (err) {
    console.error('UPDATE TRUSTEE ERROR:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Delete trustee by ID (optional: delete image from cloudinary)
exports.deleteTrustee = async (req, res) => {
  try {
    const trustee = await Trustee.findById(req.params.id);
    if (!trustee) {
      return res.status(404).json({ success: false, message: 'Trustee not found' });
    }

    console.log("trustee : ", trustee);

    // Optional: Extract public_id and delete from Cloudinary
    const publicId = trustee.img.split('/').pop().split('.')[0];
    await cloudinary.uploader.destroy(`trustees/${publicId}`);

    await trustee.deleteOne();

    res.json({ success: true, message: 'Trustee deleted successfully' });
  } catch (err) {
    console.error('DELETE TRUSTEE ERROR:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};
