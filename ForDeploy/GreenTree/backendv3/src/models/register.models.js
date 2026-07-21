const mongoose = require("mongoose");

const RegisterSchema = new mongoose.Schema(
  {
    // userId: {
    //    type:mongoose.Schema.Types.ObjectId,
    //    ref:"OTP",
    //    required:true,
    //    unique:true
    // },
    name: {
      type: String,
    },
    email: {
      type: String,
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
    otp: {
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
