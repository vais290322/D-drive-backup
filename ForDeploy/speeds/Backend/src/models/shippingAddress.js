import mongoose from "mongoose";

const shippingAddressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AuthUser",
      required: true,
      unique: true,
    },
    addresses: [
      {
        fullName: {
          type: String,
        },
        phone: {
          type: String,
        },
        altPhone: {
          type: String,
        },
        landmark: {
          type: String,
        },
        type: {
          type: String,
        },
        email: {
          type: String,
        },
        addressLine1: {
          type: String,
        },
        addressLine2: {
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
        latitude: {
          type: Number,
        },
        longitude: {
          type: Number,
        },
        isDefault: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  { collection: "user_addresses", timestamps: true }
);

// Check if model already exists before creating
const UserAddresses =
  mongoose.models.UserAddresses ||
  mongoose.model("UserAddresses", shippingAddressSchema);

export default UserAddresses;
