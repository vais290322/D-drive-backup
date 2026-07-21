const mongoose = require('mongoose');

const advisorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  position: { type: String, required: true },
  education: { type: String, required: true },
  bio: { type: String },
  cvLink: { type: String },
  image: { type: String }, 
}, { timestamps: true });

module.exports = mongoose.model('Advisor', advisorSchema);
