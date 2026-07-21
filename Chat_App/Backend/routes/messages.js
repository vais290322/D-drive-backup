import express from 'express';
import auth from '../middleware/auth.js';
import Message from '../models/Message.js';
import User from '../models/User.js';
import { getConversation, getRecentMessages } from '../controllers/messageController.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Now you can use the upload middleware in your routes
router.post('/', auth, upload.single('file'), async (req, res) => {
  try {
    const { recipientId, content } = req.body;
    
    if (!recipientId) {
      return res.status(400).json({ msg: 'Recipient ID is required' });
    }
    
    if (!content && !req.file) {
      return res.status(400).json({ msg: 'Message content or file is required' });
    }
    
    // Check if recipient exists
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ msg: 'Recipient not found' });
    }
    
    const newMessage = new Message({
      sender: req.user.id,
      recipient: recipientId,
      content: content || '',
      read: false
    });
    
    // If a file was uploaded, add file information
    if (req.file) {
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      newMessage.fileUrl = `${baseUrl}/uploads/${req.file.filename}`;
      newMessage.fileName = req.body.fileName || req.file.originalname;
      newMessage.fileType = req.body.fileType || req.file.mimetype;
    }
    
    await newMessage.save();
    res.json(newMessage);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Mark messages as read
router.post('/read/:senderId', auth, async (req, res) => {
  try {
    await Message.updateMany(
      { sender: req.params.senderId, recipient: req.user.id, read: false },
      { $set: { read: true } }
    );
    
    res.json({ msg: 'Messages marked as read' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get unread message counts
router.get('/unread/count', auth, async (req, res) => {
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
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Add reaction to a message
router.post('/react/:messageId', auth, async (req, res) => {
  try {
    const { reaction } = req.body;
    
    if (!reaction) {
      return res.status(400).json({ msg: 'Reaction is required' });
    }
    
    const message = await Message.findById(req.params.messageId);
    
    if (!message) {
      return res.status(404).json({ msg: 'Message not found' });
    }
    
    // Check if user is either sender or recipient
    if (message.sender.toString() !== req.user.id && message.recipient.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized to react to this message' });
    }
    
    message.reaction = reaction;
    await message.save();
    
    res.json(message);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get conversation between two users
// router.get('/:userId', auth, getConversation);

// Get recent messages
router.get('/:userId', auth, getRecentMessages);


export default router;
