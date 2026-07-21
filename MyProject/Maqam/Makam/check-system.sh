#!/bin/bash

# System Check Script for Maquam Holidays
# Checks if all requirements are met

echo "🔍 Maquam Holidays - System Check"
echo "=================================="
echo ""

# Check Node.js
echo "📦 Checking Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    echo "✅ Node.js installed: $NODE_VERSION"
else
    echo "❌ Node.js not found. Please install Node.js 18+ from https://nodejs.org/"
fi
echo ""

# Check pnpm
echo "📦 Checking pnpm..."
if command -v pnpm &> /dev/null; then
    PNPM_VERSION=$(pnpm -v)
    echo "✅ pnpm installed: $PNPM_VERSION"
else
    echo "⚠️  pnpm not found. Install with: npm install -g pnpm"
fi
echo ""

# Check MongoDB
echo "📊 Checking MongoDB..."
if command -v mongosh &> /dev/null; then
    MONGO_VERSION=$(mongosh --version | head -1)
    echo "✅ MongoDB Shell installed: $MONGO_VERSION"
    
    # Check if MongoDB is running
    if pgrep -x "mongod" > /dev/null; then
        echo "✅ MongoDB is running"
        
        # Try to connect
        if mongosh --eval "db.version()" --quiet &> /dev/null; then
            MONGO_DB_VERSION=$(mongosh --eval "db.version()" --quiet)
            echo "✅ MongoDB connection successful: v$MONGO_DB_VERSION"
        else
            echo "⚠️  Cannot connect to MongoDB"
        fi
    else
        echo "❌ MongoDB is not running"
        echo "   Start with:"
        echo "   macOS:  brew services start mongodb-community@7.0"
        echo "   Linux:  sudo systemctl start mongod"
    fi
else
    echo "❌ MongoDB not found. Please install MongoDB from https://www.mongodb.com/try/download/community"
fi
echo ""

# Check dependencies
echo "📦 Checking dependencies..."
if [ -d "node_modules" ]; then
    echo "✅ Frontend dependencies installed"
else
    echo "❌ Frontend dependencies not installed. Run: pnpm install"
fi

if [ -d "server/node_modules" ]; then
    echo "✅ Backend dependencies installed"
else
    echo "❌ Backend dependencies not installed. Run: cd server && npm install"
fi
echo ""

# Check environment files
echo "⚙️  Checking configuration..."
if [ -f ".env" ]; then
    echo "✅ .env file exists"
    if grep -q "VITE_API_URL" .env; then
        echo "✅ VITE_API_URL configured"
    else
        echo "⚠️  VITE_API_URL not found in .env"
    fi
else
    echo "❌ .env file not found. Copy from .env.example"
fi

if [ -f ".env.local" ]; then
    echo "✅ .env.local file exists"
else
    echo "⚠️  .env.local file not found (optional)"
fi
echo ""

# Check ports
echo "🔌 Checking ports..."
if lsof -Pi :5173 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "⚠️  Port 5173 (frontend) is in use"
else
    echo "✅ Port 5173 (frontend) is available"
fi

if lsof -Pi :5000 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "⚠️  Port 5000 (backend) is in use"
else
    echo "✅ Port 5000 (backend) is available"
fi
echo ""

# Summary
echo "=================================="
echo "📋 Summary"
echo "=================================="
echo ""

# Count issues
ISSUES=0

if ! command -v node &> /dev/null; then ((ISSUES++)); fi
if ! command -v mongosh &> /dev/null; then ((ISSUES++)); fi
if ! pgrep -x "mongod" > /dev/null; then ((ISSUES++)); fi
if [ ! -d "node_modules" ]; then ((ISSUES++)); fi
if [ ! -d "server/node_modules" ]; then ((ISSUES++)); fi
if [ ! -f ".env" ]; then ((ISSUES++)); fi

if [ $ISSUES -eq 0 ]; then
    echo "✅ All checks passed! You're ready to start."
    echo ""
    echo "Run: ./start.sh"
    echo "Or:  npm run dev:all"
else
    echo "⚠️  Found $ISSUES issue(s). Please fix them before starting."
    echo ""
    echo "See SETUP_GUIDE.md for detailed instructions."
fi
echo ""
