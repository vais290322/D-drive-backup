import Notification from '../models/Notification.js';

// Create a new notification
export const createNotification = async (notificationData) => {
  try {
    const notification = await Notification.create(notificationData);
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    return null;
  }
};

// Get all notifications for a user
export const getNotifications = async (req, res) => {
  try {

    const userId = req.query.userId;
    const schoolId = req.query.schoolId;
    const userRole = req.query.userRole; 

    const notifications = await Notification.find({
      $or: [
        { recipient: userId },
        { 
          recipient: 'all', 
          schoolId: schoolId,
          deletedBy: { $nin: [userId] }
        },
        { 
          recipient: 'allTeachers', 
          schoolId: schoolId,
          deletedBy: { $nin: [userId] }
        },
        { 
          recipient: 'admin', 
          schoolId: schoolId,
          deletedBy: { $nin: [userId] }
        }
      ]
    })
    .sort({ createdAt: -1 })
    .limit(50);

     // Filter notifications based on user role
     const filteredNotifications = notifications.filter(notification => {
      if (notification.recipient === userId) return true;
      if (notification.recipient === 'all') return true;
      if (notification.recipient === 'allTeachers' && userRole === 'teacher') return true;
      if (notification.recipient === 'admin' && userRole === 'admin') return true;
      return false;
    });
    
    res.status(200).json({
      success: true,
      count: filteredNotifications.length,
      data: filteredNotifications
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Mark notification as read
export const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }
    
    // Check if user is the recipient
    if (notification.recipient.toString() !== req.query.userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this notification'
      });
    }
    
    notification.read = true;
    await notification.save();
    
    res.status(200).json({
      success: true,
      data: notification
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Mark all notifications as read
export const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { 
        recipient: req.query.userId,
        schoolId: req.query.schoolId,
        read: false
      },
      { read: true }
    );
    
    res.status(200).json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Delete a notification
export const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }
    
    // Check if user is the recipient or if it's a broadcast notification
    const isBroadcast = ['all', 'allTeachers', 'admin'].includes(notification.recipient);
    const isRecipient = notification.recipient.toString() === req.query.userId;
    
    if (!isRecipient && !isBroadcast) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this notification'
      });
    }
    
    // For broadcast notifications, we don't actually delete them
    // Instead, we'll track which users have deleted them
    if (isBroadcast) {
      // If this is the first user deleting this notification, create the deletedBy array
      if (!notification.deletedBy) {
        notification.deletedBy = [];
      }
      
      // Add this user to the deletedBy array if not already there
      if (!notification.deletedBy.includes(req.query.userId)) {
        notification.deletedBy.push(req.query.userId);
        await notification.save();
      }
      
      return res.status(200).json({
        success: true,
        message: 'Notification hidden successfully'
      });
    }
    
    // For personal notifications, actually delete them
    await notification.deleteOne();
    
    res.status(200).json({
      success: true,
      message: 'Notification deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Delete all notifications for a user
export const deleteAllNotifications = async (req, res) => {
  try {
    const userId = req.query.userId;
    const schoolId = req.query.schoolId;
    
    // First, delete all personal notifications
    await Notification.deleteMany({
      recipient: userId,
      schoolId: schoolId
    });
    
    // Then, mark all broadcast notifications as deleted for this user
    const broadcastNotifications = await Notification.find({
      recipient: { $in: ['all', 'allTeachers', 'admin'] },
      schoolId: schoolId
    });
    
    for (const notification of broadcastNotifications) {
      if (!notification.deletedBy) {
        notification.deletedBy = [];
      }
      
      if (!notification.deletedBy.includes(userId)) {
        notification.deletedBy.push(userId);
        await notification.save();
      }
    }
    
    res.status(200).json({
      success: true,
      message: 'All notifications deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};