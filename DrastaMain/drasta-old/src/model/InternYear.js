const mongoose = require('mongoose');

const internSchema = new mongoose.Schema({
  name: { type: String, required: true },
  details: { type: String }, // e.g. "M.A, Environmental Studies ..."
  image: { type: String },   // Path or URL to image
});

const internYearSchema = new mongoose.Schema({
  year: { type: String, required: true, unique: true },
  interns: [internSchema]
}, { timestamps: true });

module.exports = mongoose.model('InternYear', internYearSchema);
