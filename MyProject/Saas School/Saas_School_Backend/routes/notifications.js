import express from 'express';
import { 
  getNotifications, 
  markAsRead, 
  markAllAsRead, 
  deleteNotification, 
  deleteAllNotifications 
} from '../controllers/notifications.js';

const router = express.Router();

// @route   GET /api/notifications
// @desc    Get all notifications for a user
// @access  Public
router.get('/', getNotifications);

// @route   PUT /api/notifications/:id/read
// @desc    Mark notification as read
// @access  Public
router.put('/:id/read', markAsRead);

// @route   PUT /api/notifications/mark-all-read
// @desc    Mark all notifications as read
// @access  Public
router.put('/mark-all-read', markAllAsRead);

// @route   DELETE /api/notifications/:id
// @desc    Delete a notification
// @access  Public
router.delete('/:id', deleteNotification);

// @route   DELETE /api/notifications
// @desc    Delete all notifications for a user
// @access  Public
router.delete('/', deleteAllNotifications);

export default router;