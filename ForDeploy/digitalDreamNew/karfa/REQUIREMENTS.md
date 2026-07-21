# Project Requirements

## System Requirements

### Development Environment

**Node.js**
- Version: 18.x or higher
- Download: https://nodejs.org/

**MongoDB**
- Version: 6.x or higher
- Download: https://www.mongodb.com/try/download/community

**Package Manager**
- npm (comes with Node.js)

### Hardware Requirements

**Minimum**
- CPU: Dual-core processor
-RAM: 4GB
- Storage: 2GB free space
- Network: WiFi/LAN for multi-device access

**Recommended**
- CPU: Quad-core processor
- RAM: 8GB or higher
- Storage: 5GB free space
- SSD for better performance

## Dependencies

### Frontend Dependencies

```json
{
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "react-router-dom": "^7.1.1",
  "typescript": "~5.6.2",
  "@radix-ui/react-*": "Latest",
  "tailwindcss": "^3.4.17",
  "recharts": "^2.15.0",
  "lucide-react": "^0.468.0",
  "class-variance-authority": "^0.7.1",
  "clsx": "^2.1.1",
  "tailwind-merge": "^2.6.0"
}
```

### Backend Dependencies

```json
{
  "express": "^4.21.2",
  "mongoose": "^8.9.3",
  "cors": "^2.8.5",
  "bcrypt": "^5.1.1",
  "jsonwebtoken": "^9.0.2",
  "dotenv": "^16.4.7",
  "multer": "^1.4.5-lts.1",
  "body-parser": "^1.20.3"
}
```

### Development Dependencies

```json
{
  "nodemon": "^3.1.9",
  "vite": "^6.0.5",
  "@vitejs/plugin-react": "^4.3.4",
  "eslint": "^9.17.0",
  "tailwindcss": "^3.4.17",
  "typescript": "~5.6.2"
}
```

## Environment Variables

### Backend (.env)

```env
# Server Configuration
PORT=4000

# Database
MONGO_URI=mongodb://localhost:27017/digitaldreams

# Authentication
JWT_SECRET=your_secure_random_string_here_min_32_chars

# Optional
NODE_ENV=development
```

### Frontend (.env)

```env
# Local Development
VITE_API_BASE_URL=http://localhost:4000/api

# Network Access (replace with your IP)
# VITE_API_BASE_URL=http://192.168.0.135:4000/api
```

## Installation Steps

### 1. Clone/Download Project
```bash
# Option 1: Clone from repository
git clone <repository-url>
cd digitaldreams

# Option 2: Extract downloaded ZIP
# Extract to: C:\Users\Dell\Desktop\123456789
```

### 2. Install MongoDB
```bash
# Windows: Download installer from mongodb.com
# Install MongoDB Community Server
# Start MongoDB service
```

### 3. Install Backend
```bash
cd digitaldreams-backend
npm install
cp .env.example .env  # Create .env file
# Edit .env with your values
node src/init-admin.js  # Create admin user
npm run dev  # Start server
```

### 4. Install Frontend
```bash
cd digitaldreams-frontend
npm install
cp .env.example .env  # Create .env file
# Edit .env with API URL
npm run dev  # Start development server
```

## Network Configuration

### For Local Access Only
- Backend: Listen on localhost (default)
- Frontend .env: `VITE_API_BASE_URL=http://localhost:4000/api`

### For Network Access (Multiple Devices)

**Backend:**
- Already configured to listen on 0.0.0.0 (all interfaces)
- CORS enabled for all origins

**Frontend:**
1. Find your computer's IP address:
   ```bash
   ipconfig  # Windows
   ifconfig  # Mac/Linux
   ```

2. Update frontend .env:
   ```env
   VITE_API_BASE_URL=http://YOUR_IP:4000/api
   ```

3. Restart frontend dev server

**Firewall Rules:**
- Allow incoming connections on port 4000 (Backend)
- Allow incoming connections on port 5173 (Frontend)

## Database Setup

### MongoDB Collections

The following collections will be created automatically:

- `profiles` - User accounts
- `customers` - Loan customers
- `loans` - Loan records
- `payments` - Payment transactions
- `products` - Loan products
- `settings` - Business settings
- `crmcontacts` - CRM contacts
- `crmcompanies` - CRM companies
- `crmdeals` - CRM deals
- `crmactivities` - CRM activities
- `crmtasks` - CRM tasks
- `bankcustomers` - Banking customers
- `bankaccounts` - Bank accounts
- `banktransactions` - Bank transactions

### Initial Data

**Default Admin User:**
- Email: admin@digitaldreams.com
- Password: admin123
- Role: super_admin
- Status: approved

Run `node src/init-admin.js` to create this user.

## Browser Compatibility

**Supported Browsers:**
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**Recommended:** Latest version of Chrome or Firefox

## Operating System Support

**Supported:**
- Windows 10/11
- macOS 10.15+
- Linux (Ubuntu 20.04+, Fedora, etc.)

**Tested On:**
- Windows 11
- Ubuntu 22.04

## Port Requirements

**Default Ports:**
- Backend API: 4000
- Frontend Dev: 5173
- MongoDB: 27017

**Note:** Ensure these ports are not in use by other applications.

## Optional Tools

**Development:**
- MongoDB Compass - GUI for MongoDB
- Postman - API testing
- VS Code - Code editor

**Production:**
- PM2 - Process manager for Node.js
- Nginx - Reverse proxy and web server
- Docker - Containerization (optional)

## Troubleshooting Requirements

### Node.js Version Issues
```bash
node --version  # Should be 18.x or higher
npm --version   # Should be 9.x or higher
```

### MongoDB Connection Issues
```bash
# Check if MongoDB is running
# Windows: Services -> MongoDB Server
# Linux: sudo systemctl status mongod
```

### Port Already in Use
```bash
# Windows: Find process using port
netstat -ano | findstr :4000
taskkill /PID <process_id> /F

# Change port in .env if needed
PORT=4001
```

### Module Installation Issues
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm-rf node_modules
npm install
```

## Update Instructions

To update dependencies:

```bash
# Check for outdated packages
npm outdated

# Update all packages
npm update

# Or update specific package
npm install package-name@latest
```

## Production Build

### Frontend Production Build
```bash
cd digitaldreams-frontend
npm run build
# Output in dist/ folder
```

### Backend Production
```bash
cd digitaldreams-backend
# Set environment to production
NODE_ENV=production

# Use PM2 for process management
npm install -g pm2
pm2 start src/index.js --name digitaldreams-api
```

## Security Requirements

**For Production:**
- Change default admin password
- Use strong JWT_SECRET (min 32 characters)
- Enable HTTPS
- Configure proper CORS origins
- Set up firewall rules
- Regular backups of MongoDB
- Keep dependencies updated
- Use environment-specific .env files

## Support

For installation issues:
1. Check Node.js and MongoDB versions
2. Verify .env files are configured correctly
3. Check firewall and port availability
4. Review console logs for errors
5. Ensure all dependencies installed successfully

---

**Version:** 1.0.0  
**Last Updated:** December 2025  
**Maintained By:** Vais Engineering Pvt Ltd

