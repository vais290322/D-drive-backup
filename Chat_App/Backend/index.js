import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import messageRoutes from './routes/messages.js';
import User from './models/User.js';  // Add this import

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/chat_app')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);
// Add this line to serve uploaded files
app.use('/uploads', express.static('uploads'));

// Socket.io connection
const connectedUsers = {};

io.on('connection', (socket) => {
  console.log('New client connected with ID:', socket.id);
  
  // User authentication
  socket.on('authenticate', async (userId) => {
    if (!userId) {
      console.error('Authentication failed: No user ID provided');
      return;
    }
    
    connectedUsers[userId] = socket.id;
    console.log(`User ${userId} connected with socket ID: ${socket.id}`);
    console.log('Currently connected users:', Object.keys(connectedUsers));
    
    // Update user's online status in database
    try {
      await User.findByIdAndUpdate(userId, { isOnline: true });
      
      // Broadcast to all clients that this user is online
      io.emit('user-status-change', { userId, isOnline: true });
      console.log(`Broadcasted online status for user ${userId}`);
      
      // Send current online users to the newly connected client
      const onlineUsers = Object.keys(connectedUsers);
      socket.emit('online-users', onlineUsers);
    } catch (error) {
      console.error('Error updating online status:', error);
    }
  });
  
  // Handle private messages
  socket.on('private-message', async (data) => {
    try {
      if (!data || !data.from || !data.to) {
        console.error('Invalid message data received:', data);
        return;
      }
      
      console.log(`Message from ${data.from} to ${data.to}: ${data.message}`);
      const receiverSocketId = connectedUsers[data.to];
      
      // Get sender username for notification
      const sender = await User.findById(data.from).select('username');
      const username = sender ? sender.username : 'Unknown';
      
      if (receiverSocketId) {
        console.log(`Sending message to socket ${receiverSocketId}`);
        
        // Forward the complete message data including file information
        // Use socket.to() instead of io.to() to avoid sending to the sender
        socket.to(receiverSocketId).emit('private-message', {
          from: data.from,
          username,
          message: data.message,
          timestamp: new Date(),
          hasAttachment: data.hasAttachment,
          messageId: data.messageId,
          fileUrl: data.fileUrl,
          fileName: data.fileName,
          fileType: data.fileType
        });
      } else {
        console.log(`User ${data.to} is not connected, message will be delivered when they connect`);
      }
    } catch (error) {
      console.error('Error handling private message:', error);
    }
  });
  
  // Handle typing indicator
  socket.on('typing', ({ to, from, isTyping }) => {
    console.log(`User ${from} is ${isTyping ? 'typing to' : 'stopped typing to'} ${to}`);
    const receiverSocketId = connectedUsers[to];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('typing', { from, isTyping });
    }
  });
  
  // Add the message-reaction handler here, inside the connection scope
  socket.on('message-reaction', ({ to, from, messageId, reaction }) => {
    console.log(`Reaction from ${from} to message ${messageId}: ${reaction}`);
    const receiverSocketId = connectedUsers[to];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('message-reaction', {
        messageId,
        reaction
      });
    }
  });
  
  // Handle disconnection
  socket.on('disconnect', async () => {
    console.log('Client disconnected:', socket.id);
    // Remove user from connected users and update online status
    let disconnectedUserId = null;
    
    for (const userId in connectedUsers) {
      if (connectedUsers[userId] === socket.id) {
        disconnectedUserId = userId;
        delete connectedUsers[userId];
        console.log(`User ${userId} disconnected`);
        break;
      }
    }
    
    if (disconnectedUserId) {
      // Update user's online status in database
      try {
        await User.findByIdAndUpdate(disconnectedUserId, { isOnline: false });
        
        // Broadcast to all clients that this user is offline
        io.emit('user-status-change', { userId: disconnectedUserId, isOnline: false });
        console.log(`Broadcasted offline status for user ${disconnectedUserId}`);
      } catch (error) {
        console.error('Error updating offline status:', error);
      }
    }
    
    console.log('Currently connected users:', Object.keys(connectedUsers));
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
