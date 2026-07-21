# Quick Reference - Maquam Holidays

## 🚨 Error: "Signup error - no response from server"

### Cause
Backend server is not running or MongoDB is not connected.

### Quick Fix
```bash
# 1. Start MongoDB
brew services start mongodb-community@7.0  # macOS
sudo systemctl start mongod                # Linux

# 2. Start backend
cd server && npm run dev

# 3. Start frontend (new terminal)
cd .. && npm run dev
```

---

## 📋 Common Commands

### First Time Setup
```bash
# Install MongoDB (macOS)
brew install mongodb-community@7.0
brew services start mongodb-community@7.0

# Install dependencies
pnpm install
cd server && npm install && cd ..
```

### Daily Development
```bash
# Option 1: Use helper script
./start.sh

# Option 2: Manual start
# Terminal 1: Backend
cd server && npm run dev

# Terminal 2: Frontend
npm run dev

# Option 3: Both at once
npm run dev:all
```

### System Check
```bash
./check-system.sh
```

---

## 🔗 URLs

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000/api
- **Health Check:** http://localhost:5000/health

---

## 👤 Test Accounts

After first run, use these accounts:

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

---

## 🛠️ Troubleshooting

### MongoDB not running
```bash
# Check status
brew services list | grep mongodb  # macOS
systemctl status mongod            # Linux

# Start MongoDB
brew services start mongodb-community@7.0  # macOS
sudo systemctl start mongod                # Linux
```

### Port already in use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
```

### Dependencies issues
```bash
# Clean install
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Backend
cd server
rm -rf node_modules package-lock.json
npm install
```

### Cannot connect to MongoDB
```bash
# Test connection
mongosh --eval "db.version()"

# Check if running
pgrep -x mongod

# View logs (macOS)
tail -f /usr/local/var/log/mongodb/mongo.log

# View logs (Linux)
sudo journalctl -u mongod -f
```

---

## 📚 Documentation

- **SETUP_GUIDE.md** - Detailed setup instructions
- **README.md** - Full project documentation
- **REQUIREMENTS.txt** - System requirements

---

## 🔧 Environment Variables

Required in `.env`:
```env
VITE_API_URL=http://localhost:5000/api
MONGODB_URI=mongodb://localhost:27017/maquam_holidays
JWT_SECRET=your-secret-key
PORT=5000
```

---

## 📦 Project Structure

```
maquam-holidays/
├── src/              # Frontend React app
│   ├── pages/        # Page components
│   ├── components/   # Reusable components
│   ├── lib/          # API client
│   └── contexts/     # Auth context
├── server/           # Backend Express app
│   ├── src/
│   │   ├── controllers/  # Request handlers
│   │   ├── models/       # MongoDB models
│   │   ├── routes/       # API routes
│   │   └── middleware/   # Auth middleware
│   └── package.json
└── package.json      # Frontend dependencies
```

---

## 🚀 Deployment Checklist

- [ ] MongoDB production instance ready
- [ ] Update MONGODB_URI in production .env
- [ ] Set strong JWT_SECRET
- [ ] Configure Razorpay keys
- [ ] Build frontend: `npm run build`
- [ ] Build backend: `cd server && npm run build`
- [ ] Set NODE_ENV=production
- [ ] Configure reverse proxy (nginx)
- [ ] Enable HTTPS/SSL
- [ ] Set up backup strategy

---

## 💡 Tips

1. **Always start MongoDB first** before backend
2. **Check system status** with `./check-system.sh`
3. **Use helper scripts** for easier development
4. **Check logs** if something doesn't work
5. **Read error messages** carefully - they usually tell you what's wrong

---

**Need more help?** See SETUP_GUIDE.md or README.md
