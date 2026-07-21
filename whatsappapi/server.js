require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./src/config/db');

const BASE_URL = process.env.BASE_URL || '';

// ── Routes ──
const inboxRoutes = require('./src/routes/inbox');
const historyRoutes = require('./src/routes/history'); // Keep historyRoutes as a const if it's not directly required in app.use
const authRoutes = require('./src/routes/auth');
const whatsappRoutes = require('./src/routes/whatsapp');
const templateRoutes = require('./src/routes/templates');
const messageRoutes = require('./src/routes/messages');
const publicRoutes = require('./src/routes/public');
const bulkRoutes = require('./src/routes/bulk');
const contactsRoutes = require('./src/routes/contacts');
const settingsRoutes = require('./src/routes/settings');
const waMgr = require('./src/services/whatsappManager');

const http = require('http');
const os = require('os');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

// Provide the Socket.io instance to the WhatsApp manager so it can emit events
waMgr.setSocketIO(io);

// Socket.io JWT Authentication Middleware
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error('Authentication error'));
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // JWT is signed as { id: userId } in auth.js — decoded IS the user object
    socket.user = decoded;
    // Join a room based on user ID to isolate events
    socket.join(socket.user.id);
    next();
  } catch (err) {
    next(new Error('Authentication error'));
  }
});

io.on('connection', (socket) => {
  console.log(`[Socket] User connected: ${socket.user.id}`);
  socket.on('disconnect', () => {
    console.log(`[Socket] User disconnected: ${socket.user.id}`);
  });
});

// Connect Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Content Security Policy — allow unsafe-eval (required by Socket.IO) and unsafe-inline
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; connect-src 'self' ws: wss:; img-src 'self' data: blob:; font-src 'self' data:;"
  );
  next();
});

// Serve static frontend files
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.get('/whatsapp', (req, res) => {
  res.redirect('/');
});

app.get('/whatsapp/', (req, res) => {
  res.redirect('/');
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/whatsapp', whatsappRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/bulk', bulkRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/inbox', inboxRoutes);
app.use('/api/contacts', contactsRoutes);
app.use('/api/settings', settingsRoutes);

// Fallback: serve index.html for unknown routes
app.get(BASE_URL + '*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running locally at:   http://localhost:${PORT}`);

  // Find local network IP to display for LAN access
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        console.log(`🌍 Available on your Network: http://${iface.address}:${PORT}`);
      }
    }
  }

  // Auto-boot WhatsApp clients in the background
  waMgr.restoreAllSessions();
});
