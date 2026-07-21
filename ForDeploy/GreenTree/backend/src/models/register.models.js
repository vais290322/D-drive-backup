const mongoose = require("mongoose");

const RegisterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
    },
    phone: {
      type: String,
    },
    gender:{
      type:String
    },
    dateOfBirth:{
      type:Date  
    },
    anniversaryDate:{
      type:Date 
    },
    password: {
      type: String,   
    },
    role: {
      type: String,
      default: "user",
    },
    address: {
      type: String,
    },
    street: {
      type: String,
    },
    city: {
      type: String,
    },
    state: {
      type: String,   
    },
    postalCode: {
      type: String,
    },
    district: {
      type: String,
    },
    landmark: {
      type: String,
    },
    isAdmin: {
      type: Boolean,
      default: false, 
    }
  },
  {
    timestamps: true,
  }
);
const registerschema = new mongoose.model("Register", RegisterSchema);

module.exports = registerschema;
