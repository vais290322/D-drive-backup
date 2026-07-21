#!/bin/bash

echo "🚀 Starting Maquam Holidays Backend Server..."
echo ""

cd /workspace/app-8farl2rn17nl/server

# Check if test server is already running
if lsof -Pi :5000 -sTCP:LISTEN -t >/dev/null ; then
    echo "✅ Backend server is already running on port 5000"
    exit 0
fi

# Start the simple test server
echo "📦 Starting backend server..."
node test-server.js > /tmp/backend.log 2>&1 &

# Wait for server to start
sleep 3

# Check if server is running
if curl -s http://localhost:5000/health > /dev/null; then
    echo "✅ Backend server started successfully!"
    echo "📍 API: http://localhost:5000"
    echo "🏥 Health: http://localhost:5000/health"
    echo ""
    echo "📝 Test the signup:"
    echo "   curl -X POST http://localhost:5000/api/auth/register \\"
    echo "     -H 'Content-Type: application/json' \\"
    echo "     -d '{\"email\":\"test@example.com\",\"username\":\"testuser\",\"password\":\"Test123!\"}'"
else
    echo "❌ Failed to start backend server"
    echo "Check logs: cat /tmp/backend.log"
    exit 1
fi
