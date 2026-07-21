const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  phone: { type: String, 
    required: true
    },
  otp: {
    type: String,
    required: true,
  },
  otpExpires: Date,
});

module.exports = mongoose.model("OTPData", otpSchema);