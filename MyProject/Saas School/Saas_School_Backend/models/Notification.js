import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.Mixed, // Changed from ObjectId to Mixed
    required: true
  },
  audienceType: {
    type: String,
    enum: ['all', 'allTeachers', 'admin', 'specific', 'class'],
    default: 'specific'
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['post', 'comment', 'like', 'assignment', 'system'],
    default: 'system'
  },
  read: {
    type: Boolean,
    default: false
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  },
  schoolId: {
    type: String,
    required: true
  },
  deletedBy: {
    type: [String], // Array of user IDs who have deleted this notification
    default: []
  },
}, { timestamps: true });

// Add a method to check if a notification is relevant for a specific user
notificationSchema.methods.isRelevantForUser = function(userId, userRole, schoolId) {
  // If recipient is a specific user ID
  if (this.recipient.toString() === userId.toString()) {
    return true;
  }
  
  // For broadcast notifications
  if (this.audienceType === 'all' && this.schoolId === schoolId) {
    return true;
  }
  
  // For teacher-specific broadcasts
  if (this.audienceType === 'allTeachers' && userRole === 'teacher' && this.schoolId === schoolId) {
    return true;
  }
  
  // For admin-specific broadcasts
  if (this.audienceType === 'admin' && userRole === 'admin' && this.schoolId === schoolId) {
    return true;
  }
  
  return false;
};

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;