# Quick Setup Guide - Maquam Holidays

## Issue: "Signup error - no response from server"

This error occurs because the backend server is not running or MongoDB is not connected.

## Solution: Start the Backend Server

### Step 1: Install MongoDB

#### On macOS:
```bash
brew tap mongodb/brew
brew install mongodb-community@7.0
brew services start mongodb-community@7.0
```

#### On Ubuntu/Linux:
```bash
# Import MongoDB public GPG key
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -

# Add MongoDB repository
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Install MongoDB
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

#### On Windows:
1. Download MongoDB Community Server from https://www.mongodb.com/try/download/community
2. Run the installer
3. MongoDB will start automatically as a Windows service

### Step 2: Verify MongoDB is Running

```bash
# Check if MongoDB is running
mongosh --eval "db.version()"

# You should see output like: 7.0.x
```

### Step 3: Install Server Dependencies

```bash
cd server
npm install
```

### Step 4: Start the Backend Server

```bash
# From the server directory
npm run dev

# OR from the root directory
cd ..
npm run dev:server
```

You should see:
```
✅ MongoDB Connected: localhost
📊 Database: maquam_holidays
🚀 Server running on port 5000
📍 API: http://localhost:5000
```

### Step 5: Start the Frontend

In a new terminal:

```bash
# From the root directory
npm run dev

# OR
npm run dev:all  # Starts both frontend and backend
```

### Step 6: Test Signup

1. Open http://localhost:5173
2. Click "Login" in the navigation
3. Switch to "Sign Up" tab
4. Enter username and password
5. Click "Sign Up"

## Troubleshooting

### Error: "ECONNREFUSED 127.0.0.1:27017"
**Cause:** MongoDB is not running

**Solution:**
```bash
# macOS
brew services start mongodb-community@7.0

# Linux
sudo systemctl start mongod

# Windows
# Start MongoDB service from Services app
```

### Error: "No response from server"
**Cause:** Backend server is not running

**Solution:**
```bash
cd server
npm run dev
```

### Error: "Port 5000 already in use"
**Cause:** Another process is using port 5000

**Solution:**
```bash
# Find and kill the process
lsof -ti:5000 | xargs kill -9

# OR change the port in .env
PORT=5001
```

### Error: "Cannot find module"
**Cause:** Dependencies not installed

**Solution:**
```bash
# Install frontend dependencies
pnpm install

# Install backend dependencies
cd server
npm install
```

## Quick Start (All-in-One)

```bash
# 1. Start MongoDB
brew services start mongodb-community@7.0  # macOS
# OR
sudo systemctl start mongod  # Linux

# 2. Install all dependencies
pnpm install
cd server && npm install && cd ..

# 3. Start both frontend and backend
npm run dev:all
```

## Environment Variables

Make sure `.env` and `.env.local` files exist with:

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/maquam_holidays

# Server
PORT=5000
JWT_SECRET=maquam-holidays-super-secret-jwt-key-2025

# Frontend
VITE_API_URL=http://localhost:5000/api
```

## Test Accounts (After First Run)

The system will create default accounts on first startup:

```
Admin:
Email: admin@maquamholidays.com
Password: admin123

Hotelier:
Email: hotelier@maquamholidays.com
Password: hotelier123

Customer:
Email: user@maquamholidays.com
Password: user123
```

## Architecture

```
Frontend (React + Vite)
  ↓ HTTP Requests
  ↓ http://localhost:5173
  ↓
Backend (Express + MongoDB)
  ↓ Port 5000
  ↓ /api/auth/register
  ↓ /api/auth/login
  ↓
MongoDB Database
  ↓ Port 27017
  ↓ maquam_holidays database
```

## Next Steps

1. ✅ Start MongoDB
2. ✅ Start backend server
3. ✅ Start frontend
4. ✅ Test signup/login
5. 📚 Read README.md for full documentation
6. 🚀 Start developing!

---

**Need Help?**
- Check README.md for detailed documentation
- Check REQUIREMENTS.txt for system requirements
- Check server logs: `cd server && npm run dev`
- Check MongoDB: `mongosh`
