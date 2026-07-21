const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ResearchProjectSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image:{
    type: String,
  },
  pdfLink: {
    type: String,
  },
  public_id: {
    type: String,
  },
}, {
  timestamps: true
});

module.exports = mongoose.model('ResearchProject', ResearchProjectSchema);