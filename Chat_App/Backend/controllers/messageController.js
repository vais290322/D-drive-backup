import Message from '../models/Message.js';
import User from '../models/User.js';

// Send a message
export const sendMessage = async (req, res) => {
  try {
    const { recipientId, content } = req.body;
    
    // Check if recipient exists
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ message: 'Recipient not found' });
    }
    
    // Create new message
    const newMessage = new Message({
      sender: req.user.id,
      recipient: recipientId,
      content
    });
    
    await newMessage.save();
    
    res.status(201).json(newMessage);
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get conversation between two users
export const getConversation = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Get messages between current user and specified user
    const messages = await Message.find({
      $or: [
        { sender: req.user.id, recipient: userId },
        { sender: userId, recipient: req.user.id }
      ]
    }).sort({ createdAt: 1 });
    
    // Mark messages as read
    await Message.updateMany(
      { sender: userId, recipient: req.user.id, read: false },
      { read: true }
    );
    
    res.json(messages);
  } catch (error) {
    console.error('Get conversation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get unread message count
export const getUnreadCount = async (req, res) => {
  try {
    const unreadCounts = await Message.aggregate([
      {
        $match: {
          recipient: req.user.id,
          read: false
        }
      },
      {
        $group: {
          _id: '$sender',
          count: { $sum: 1 }
        }
      }
    ]);
    
    res.json(unreadCounts);
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add this function to your existing controller
// Mark messages as read
export const markAsRead = async (req, res) => {
  try {
    const { senderId } = req.params;
    
    // Update all unread messages from this sender to this recipient
    const result = await Message.updateMany(
      { 
        sender: senderId, 
        recipient: req.user.id, 
        read: false 
      },
      { read: true }
    );
    
    res.json({ success: true, messagesUpdated: result.modifiedCount });
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getRecentMessages = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Get messages between current user and specified user
    const messages = await Message.find({
      $or: [
        { sender: req.user.id, recipient: userId },
        { sender: userId, recipient: req.user.id }
      ]
    }).sort({ createdAt: 1 });
    
    // Mark messages as read
    await Message.updateMany(
      { sender: userId, recipient: req.user.id, read: false },
      { read: true }
    );
    
    res.json(messages);
  } catch (error) {
    console.error('Get conversation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};