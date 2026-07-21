#!/bin/bash

# Maquam Holidays - Startup Script
# This script starts both frontend and backend servers

echo "🚀 Starting Maquam Holidays..."
echo ""

# Check if MongoDB is running
echo "📊 Checking MongoDB..."
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  MongoDB is not running!"
    echo ""
    echo "Please start MongoDB first:"
    echo "  macOS:  brew services start mongodb-community@7.0"
    echo "  Linux:  sudo systemctl start mongod"
    echo "  Windows: Start MongoDB service from Services app"
    echo ""
    exit 1
fi

echo "✅ MongoDB is running"
echo ""

# Check if server dependencies are installed
if [ ! -d "server/node_modules" ]; then
    echo "📦 Installing server dependencies..."
    cd server && npm install && cd ..
fi

# Check if frontend dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    pnpm install
fi

echo "🎯 Starting servers..."
echo ""
echo "Frontend: http://localhost:5173"
echo "Backend:  http://localhost:5000"
echo ""
echo "Press Ctrl+C to stop all servers"
echo ""

# Start both servers
npm run dev:all
