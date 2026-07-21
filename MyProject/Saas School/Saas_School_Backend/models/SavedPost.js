import mongoose from 'mongoose';

const savedPostSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  postId: {
    type: String,
    required: true
  },
  schoolId: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Create a compound index to ensure a user can't save the same post twice
savedPostSchema.index({ userId: 1, postId: 1 }, { unique: true });

const SavedPost = mongoose.model('SavedPost', savedPostSchema);

export default SavedPost;