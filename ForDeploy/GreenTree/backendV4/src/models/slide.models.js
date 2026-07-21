const mongoose = require('mongoose');

const slideSchema = new mongoose.Schema({
    image: {
        type: String, // Cloudinary URL
        required: true
    },
    imagePublicId: {
        type: String // Cloudinary public_id
    },
    category: {
        type: String,
        required: true
    }
},{
    timestamps: true
});

module.exports = mongoose.model('Slide', slideSchema);