const mongoose = require('mongoose');

const overviewSchema = new mongoose.Schema({
  overview: {
    type: String,
    required: [true, 'Overview is required']
  }
}, { timestamps: true });

module.exports = mongoose.model('Overview', overviewSchema);
