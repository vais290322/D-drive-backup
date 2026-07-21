import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true }
}, { collection: 'service_categories', timestamps: true });

export default mongoose.model('Category', CategorySchema);