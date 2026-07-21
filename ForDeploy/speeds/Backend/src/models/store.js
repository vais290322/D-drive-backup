import mongoose from 'mongoose';
const StoreSchema = new mongoose.Schema({
  name: String,
  addressLine1: String,
  addressLine2: String,
  city: String,
  state: String,
  postalCode: String,
  country: String,
  phoneNumber: String,
  shippingCost: Number,
  freeShippingCost: Number,
  latitude: Number,
  longitude: Number,
  deliveryRadiusKm: Number
}, { collection: 'stores', timestamps: true });
export default mongoose.model('Store', StoreSchema);