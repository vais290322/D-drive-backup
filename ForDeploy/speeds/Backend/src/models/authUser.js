import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const AuthUserSchema = new mongoose.Schema(
  {
    fullName: { type: String, trim: true },
    phoneNumber: { type: String, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true },
    userId: { type: String },
    role: {
      type: String,
      default: "USER",
      enum: ["USER", "ADMIN", "STAFF", "DELIVERY"],
    },
    enabled: { type: Boolean, default: true },
    resetToken: { type: String },
    resetTokenExpiry: { type: Date },
    isVerified: { type: Boolean, default: false },
    walletBalance: { type: Number, default: 0 },
    referralCode: { type: String },
    buyerId: { type: String },
  },
  { collection: "auth_users", timestamps: true }
);

AuthUserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

AuthUserSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.password);
};

export default mongoose.model("AuthUser", AuthUserSchema);
