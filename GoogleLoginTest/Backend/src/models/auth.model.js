import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: function () {
        return this.authProvider === "local";
      },
      trim: true,
      minlength: 3,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: function (v) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: "Invalid email format",
      },
    },
    role: {
      type: String,
      enum: ["user", "admin", "superAdmin", "editor", "viewer", "guest", "developer", "tester", "designer", "manager", "support", "sales", "marketing", "finance", "hr", "legal", "operations", "product", "research", "training", "hotelier", "restaurant", "traveler", "foodie", "flight"],
      default: "user",
    },
    password: {
      type: String,
      // Not required for Google users
      minlength: 6,
    },
    mobileNumber: {
      type: String,
      trim: true,
    },
    googleId: {
      type: String,
    },
    githubId: {
      type: String,
    },
    avatar: {
      type: String, // URL from Google profile picture
    },
    authProvider: {
      type: String,
      enum: ["local", "google", "github"],
      default: "local",
    },
  },
  { timestamps: true }
);

// Hash password before saving (only for local auth)
userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare entered password with hashed password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

// Don't return password in JSON
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.googleId;
  delete obj.githubId;
  return obj;
};

const User = mongoose.model("User", userSchema);

export default User;
