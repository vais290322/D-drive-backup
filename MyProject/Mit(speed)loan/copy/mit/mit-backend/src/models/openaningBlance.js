const mongoose = require('mongoose');


const openingBalanceSchema = new mongoose.Schema({

  balance: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now,
    required: true
  }
});

module.exports = mongoose.model('OpeningBalance', openingBalanceSchema);
