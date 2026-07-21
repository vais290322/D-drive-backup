import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const initSocket = (io) => {
  // Store active users
  const activeUsers = new Map();

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      socket.schoolId = decoded.schoolId;
      
      const user = await User.findById(decoded.id);
      if (!user) {
        return next(new Error('User not found'));
      }
      
      socket.user = {
        id: user._id,
        name: user.name,
        role: user.role,
        schoolId: user.schoolId
      };
      
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.userId}`);
    
    // Add user to active users
    activeUsers.set(socket.userId.toString(), socket.id);
    
    // Join school-specific room
    socket.join(`school:${socket.schoolId}`);
    
    // Join role-specific room
    socket.join(`school:${socket.schoolId}:${socket.user.role}`);
    
    // If teacher or student, join class-specific rooms
    if (socket.user.role === 'teacher' && socket.user.classes) {
      socket.user.classes.forEach(className => {
        socket.join(`school:${socket.schoolId}:class:${className}`);
      });
    }
    
    if (socket.user.role === 'student' && socket.user.className) {
      socket.join(`school:${socket.schoolId}:class:${socket.user.className}`);
      if (socket.user.section) {
        socket.join(`school:${socket.schoolId}:class:${socket.user.className}:section:${socket.user.section}`);
      }
    }

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.userId}`);
      activeUsers.delete(socket.userId.toString());
    });
  });

  // Utility function to send notification to specific user
  const sendNotificationToUser = (userId, notification) => {
    const socketId = activeUsers.get(userId.toString());
    if (socketId) {
      io.to(socketId).emit('notification', notification);
    }
  };

  // Utility function to send notification to school
  const sendNotificationToSchool = (schoolId, notification) => {
    io.to(`school:${schoolId}`).emit('notification', notification);
  };

  // Utility function to send notification to specific role in a school
  const sendNotificationToRole = (schoolId, role, notification) => {
    io.to(`school:${schoolId}:${role}`).emit('notification', notification);
  };

  // Utility function to send notification to specific class
  const sendNotificationToClass = (schoolId, className, notification) => {
    io.to(`school:${schoolId}:class:${className}`).emit('notification', notification);
  };

  // Utility function to send notification to specific section
  const sendNotificationToSection = (schoolId, className, section, notification) => {
    io.to(`school:${schoolId}:class:${className}:section:${section}`).emit('notification', notification);
  };

  return {
    activeUsers,
    sendNotificationToUser,
    sendNotificationToSchool,
    sendNotificationToRole,
    sendNotificationToClass,
    sendNotificationToSection
  };
};

export default initSocket;