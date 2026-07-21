import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  userName: {
    type: String,
    default: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const likeSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  userName: {
    type: String,
    default: 'User'
  }
});

const postSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  schoolId: {
    type: String,
    required: true
  },
  media: {
    url: String,
    publicId: String,
    type: {
      type: String,
      enum: ['image', 'video', 'document']
    },
    format: String,
  },
  audience: {
    type: {
      type: String,
      enum: ['all', 'class', 'section', 'student', 'teacher', 'allTeachers', 'specificTeacher','admin','librarian', 'edp', 'accountant'],
      default: 'all'
    },
    classes: [String],
    sections: [String],
    students: [String],
    teachers: [String]
  },
  likes: [likeSchema],
  comments: [commentSchema]
}, { timestamps: true });

const Post = mongoose.model('Post', postSchema);

export default Post;