import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  employeeId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 6,
  },
  role: {
    type: String,
    enum: ["admin", "employee"],
    default: "employee",
  },
});

const UserModel = mongoose.model("User", userSchema);

export default UserModel;
