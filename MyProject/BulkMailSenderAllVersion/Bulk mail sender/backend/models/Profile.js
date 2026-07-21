import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  companyName: {
    type: String,
    default: '',
  },
  address: {
    type: String,
    default: '',
  },
  phone: {
    type: String,
    default: '',
  },
  website: {
    type: String,
    default: '',
  },
  facebook: {
    type: String,
    default: '',
  },
  instagram: {
    type: String,
    default: '',
  },
  youtube: {
    type: String,
    default: '',
  },
  logo: {
    type: String, // path to saved logo file
    default: null,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

profileSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('Profile', profileSchema);
