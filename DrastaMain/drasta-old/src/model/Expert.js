const mongoose = require('mongoose');

const expertSchema = new mongoose.Schema({
  name: { type: String, required: true },
  title: { type: String }, // e.g., "Expert & Head, Project Management & ESG"
  expertise: { type: String }, // A short paragraph or bullet points
  image: { type: String }, // URL or local file path
}, { timestamps: true });

module.exports = mongoose.model('Expert', expertSchema);
