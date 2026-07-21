import { io } from 'socket.io-client';

let socket = null;

export const initSocket = (userId) => {
  if (!socket) {
    console.log('Initializing socket connection for user:', userId);
    const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    socket = io(SOCKET_URL);
    
    socket.on('connect', () => {
      console.log('Connected to socket server with ID:', socket.id);
      socket.emit('authenticate', userId);
    });
    
    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });
    
    socket.on('disconnect', () => {
      console.log('Disconnected from socket server');
    });
  } else {
    console.log('Socket already initialized, re-authenticating user:', userId);
    socket.emit('authenticate', userId);
  }
  
  return socket;
};

export const getSocket = () => {
  if (!socket) {
    console.warn('Socket not initialized. Initializing with default settings.');
    const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    socket = io(SOCKET_URL);
  }
  return socket;
};

export const closeSocket = () => {
  if (socket) {
    console.log('Closing socket connection');
    socket.disconnect();
    socket = null;
  }
};