const mongoose = require('mongoose');

const trusteeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required']
  },
  img: {
    type: String,
    required: [true, 'Image URL is required']
  },
  desc: {
    type: String,
    required: [true, 'Description is required']
  }
}, { timestamps: true });

module.exports = mongoose.model('Trustee', trusteeSchema);
