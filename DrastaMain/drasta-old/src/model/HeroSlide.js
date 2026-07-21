const mongoose = require('mongoose');

const heroSlideSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    // required: true
  },
  image: {
    type: String,
    required: true
  },
  buttonText: {
    type: String,
    default: null
  },
  buttonLink: {
    type: String,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('HeroSlide', heroSlideSchema);
