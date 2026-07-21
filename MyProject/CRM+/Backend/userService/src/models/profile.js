const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    userId: { type: Number, required: true, unique: true }, // Relationship with User table id
    address: { type: String, required: true },
    phoneNo: { type: String, required: true },
    plan_validate: { type: String, required: true },
    isvalidate: { type: Boolean, default: false }, 
  });
  
  const Profile = mongoose.model('Profile', profileSchema);
  
  module.exports = Profile;