# Welcome to Your Miaoda Project
Miaoda Application Link URL
    URL:https://medo.dev/projects/app-8farl2rn17nl

# Maquam Holidays Pvt Ltd - Travel Booking Platform

> A comprehensive Islamic-friendly travel booking platform specializing in Hajj and Umrah pilgrimage packages to Makkah and Madinah.

[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white)](https://expressjs.com/)
[![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

---

## 🚨 Quick Fix: "Signup error - no response from server"

If you're seeing this error, the backend server is not running. Follow these steps:

```bash
# 1. Start MongoDB (if not running)
brew services start mongodb-community@7.0  # macOS
# OR
sudo systemctl start mongod  # Linux

# 2. Install server dependencies (first time only)
cd server
npm install

# 3. Start the backend server
npm run dev

# 4. In a new terminal, start the frontend
cd ..
npm run dev
```

**See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed setup instructions.**

---

## 📋 Table of Contents

- [Quick Fix](#-quick-fix-signup-error---no-response-from-server)
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Project Structure](#project-structure)
- [User Roles](#user-roles)
- [Payment Integration](#payment-integration)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

---

## 🌟 Overview

Maquam Holidays is a full-stack travel booking platform designed specifically for Islamic-friendly travel, with a focus on Hajj and Umrah pilgrimage packages. The platform provides:

- **Hotel Booking System** with Islamic-friendly filters (proximity to Haram, prayer facilities, halal food)
- **Flight Search & Booking** (integration ready)
- **Pre-designed Packages** (Hajj, Umrah, Economy/Standard/Premium tiers)
- **AI-Powered Custom Package Generator** (coming soon)
- **Razorpay Payment Integration** for secure transactions
- **Multi-role System** (Admin, Hotelier, Customer)
- **Educational Resources** for pilgrims

---

## ✨ Features

### Core Functionality
- ✅ **Hotel Management**: Create, search, filter, and book Islamic-friendly hotels
- ✅ **Booking System**: Complete booking workflow with payment integration
- ✅ **User Authentication**: JWT-based secure authentication with role-based access
- ✅ **Payment Processing**: Razorpay integration for payments and payouts
- ✅ **Multi-role Dashboards**: Separate interfaces for Admin, Hotelier, and Customer
- ✅ **Responsive Design**: Mobile-first design with Tailwind CSS
- ✅ **Islamic Features**: Prayer times, Qibla direction, proximity to holy sites

### Islamic-Friendly Features
- 🕌 Proximity to Haram (Makkah) and Masjid an-Nabawi (Madinah)
- 🙏 Prayer facilities in hotels
- 🥘 Halal food availability
- 👥 Gender-segregated facilities
- 📅 Islamic calendar integration
- 📖 Educational resources (Hajj/Umrah guides)

### User Roles
- **Admin**: Full platform management, user verification, analytics
- **Hotelier**: Hotel listing management, booking management, payout tracking
- **Customer**: Browse hotels, make bookings, manage trips, customer portal

---

## 🛠 Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **React Router** - Navigation
- **Axios** - HTTP client
- **React Hook Form** - Form management
- **Zod** - Schema validation

### Backend
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **Razorpay** - Payment gateway

### DevOps
- **TypeScript** - Full-stack type safety
- **Nodemon** - Development server
- **Concurrently** - Run multiple processes
- **Biome** - Linting and formatting

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v6 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **pnpm** (recommended) or npm - [Install pnpm](https://pnpm.io/installation)

### MongoDB Installation

#### macOS (using Homebrew)
```bash
brew tap mongodb/brew
brew install mongodb-community@7.0
brew services start mongodb-community@7.0
```

#### Ubuntu/Debian
```bash
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod
```

#### Windows
Download and install from [MongoDB Download Center](https://www.mongodb.com/try/download/community)

#### Verify Installation
```bash
mongosh --version
# Should show: 2.x.x or higher

# Connect to MongoDB
mongosh
# Should connect to: mongodb://localhost:27017
```

---

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd app-8farl2rn17nl
```

### 2. Install Frontend Dependencies
```bash
pnpm install
# or
npm install
```

### 3. Install Backend Dependencies
```bash
cd server
npm install
cd ..
```

---

## ⚙️ Configuration

### 1. Create Environment File
```bash
cp .env.example .env.local
```

### 2. Configure Environment Variables

Edit `.env.local` with your configuration:

```env
# ============================================
# MongoDB Configuration
# ============================================
MONGODB_URI=mongodb://localhost:27017/maquam_holidays

# ============================================
# Server Configuration
# ============================================
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# ============================================
# JWT Configuration
# ============================================
# IMPORTANT: Change this in production!
# Generate: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_SECRET=your-super-secret-jwt-key-change-in-production-minimum-32-characters

# ============================================
# Razorpay Configuration
# ============================================
# Get your keys from: https://dashboard.razorpay.com/app/keys
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_secret_here

# ============================================
# Frontend Environment Variables
# ============================================
VITE_API_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx

# ============================================
# App Configuration
# ============================================
VITE_APP_ID=app-8farl2rn17nl
VITE_API_ENV=development
```

### 3. Copy Environment to Server
```bash
cp .env.local server/.env
```

### 4. Generate Secure JWT Secret (Production)
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## 🏃 Running the Application

### Option 1: Run Both Frontend and Backend Together (Recommended)
```bash
npm run dev:all
```

### Option 2: Run Separately

**Terminal 1 - Backend Server:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev:client
```

### Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/health

---

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register new user | No |
| POST | `/auth/login` | Login user | No |
| POST | `/auth/logout` | Logout user | No |
| GET | `/auth/me` | Get current user | Yes |
| PUT | `/auth/profile` | Update profile | Yes |
| PUT | `/auth/change-password` | Change password | Yes |

### Hotel Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/hotels` | Get all hotels (with filters) | No |
| GET | `/hotels/:id` | Get hotel by ID | No |
| POST | `/hotels` | Create hotel | Yes (hotelier/admin) |
| PUT | `/hotels/:id` | Update hotel | Yes (owner/admin) |
| DELETE | `/hotels/:id` | Delete hotel | Yes (owner/admin) |
| GET | `/hotels/my/hotels` | Get my hotels | Yes (hotelier) |
| PUT | `/hotels/:id/verify` | Verify hotel | Yes (admin) |

### Booking Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/bookings` | Create booking | Yes |
| POST | `/bookings/verify-payment` | Verify Razorpay payment | No |
| GET | `/bookings/my/bookings` | Get my bookings | Yes |
| GET | `/bookings/:id` | Get booking by ID | Yes |
| PUT | `/bookings/:id/cancel` | Cancel booking | Yes |
| GET | `/bookings/admin/all` | Get all bookings | Yes (admin) |
| GET | `/bookings/hotelier/bookings` | Get hotelier bookings | Yes (hotelier) |

### Example API Calls

#### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "username": "johndoe",
    "full_name": "John Doe",
    "role": "user"
  }'
```

#### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

#### Get Hotels
```bash
curl http://localhost:5000/api/hotels?city=Makkah&prayer_facilities=true
```

---

## 🗄 Database Schema

### Collections

#### users
```javascript
{
  _id: ObjectId,
  email: String (unique, required),
  password: String (hashed, required),
  username: String (unique, required),
  full_name: String,
  phone: String,
  role: Enum ['user', 'admin', 'hotelier'] (default: 'user'),
  avatar_url: String,
  email_verified: Boolean (default: false),
  phone_verified: Boolean (default: false),
  created_at: Date,
  updated_at: Date,
  last_login: Date
}
```

#### hotels
```javascript
{
  _id: ObjectId,
  name: String (required),
  description: String,
  location: String (required),
  city: String (required),
  country: String (default: 'Saudi Arabia'),
  address: String,
  latitude: Number,
  longitude: Number,
  proximity_to_haram: Number, // in km
  proximity_to_masjid_nabawi: Number, // in km
  prayer_facilities: Boolean (default: false),
  halal_food: Boolean (default: false),
  gender_segregated_facilities: Boolean (default: false),
  star_rating: Number (1-5),
  images: [String],
  amenities: [String],
  check_in_time: String,
  check_out_time: String,
  price_per_night: Number (required),
  currency: String (default: 'INR'),
  is_active: Boolean (default: true),
  is_verified: Boolean (default: false),
  owner_id: ObjectId (ref: User),
  created_at: Date,
  updated_at: Date
}
```

#### bookings
```javascript
{
  _id: ObjectId,
  user_id: ObjectId (ref: User, required),
  hotel_id: ObjectId (ref: Hotel, required),
  check_in_date: Date (required),
  check_out_date: Date (required),
  nights: Number,
  guests: Number (required),
  room_type: String,
  guest_name: String,
  guest_email: String,
  guest_phone: String,
  special_requests: String,
  room_price: Number,
  total_amount: Number (required),
  currency: String (default: 'INR'),
  payment_id: String,
  payment_status: Enum ['pending', 'paid', 'failed', 'refunded'] (default: 'pending'),
  paid_at: Date,
  status: Enum ['pending', 'confirmed', 'cancelled', 'completed'] (default: 'pending'),
  created_at: Date,
  updated_at: Date
}
```

#### hotelierPayouts
```javascript
{
  _id: ObjectId,
  hotelier_id: ObjectId (ref: User, required),
  payout_id: String (Razorpay ID),
  amount: Number (required),
  currency: String (default: 'INR'),
  account_number: String (required),
  ifsc: String (required),
  account_holder_name: String (required),
  status: Enum ['queued', 'pending', 'processing', 'processed', 'reversed', 'cancelled', 'rejected'],
  purpose: String,
  reference: String,
  failure_reason: String,
  notes: Object,
  created_at: Date,
  updated_at: Date,
  processed_at: Date
}
```

### Database Management Commands

```bash
# Connect to MongoDB
mongosh

# Switch to database
use maquam_holidays

# View collections
show collections

# View users
db.users.find().pretty()

# View hotels
db.hotels.find().pretty()

# View bookings
db.bookings.find().pretty()

# Count documents
db.users.countDocuments()
db.hotels.countDocuments()
db.bookings.countDocuments()

# Clear all data (DEVELOPMENT ONLY!)
db.dropDatabase()
```

---

## 📁 Project Structure

```
app-8farl2rn17nl/
├── src/                          # Frontend source code
│   ├── components/               # React components
│   │   ├── ui/                   # shadcn/ui components
│   │   ├── layouts/              # Layout components
│   │   ├── admin/                # Admin components
│   │   ├── hotelier/             # Hotelier components
│   │   └── customer/             # Customer components
│   ├── contexts/                 # React contexts
│   │   └── AuthContext.tsx       # Authentication context
│   ├── hooks/                    # Custom React hooks
│   ├── lib/                      # Utility libraries
│   │   └── api.ts                # API client (Axios)
│   ├── pages/                    # Page components
│   │   ├── admin/                # Admin pages
│   │   ├── hotelier/             # Hotelier pages
│   │   ├── customer/             # Customer pages
│   │   ├── Home.tsx              # Homepage
│   │   ├── Login.tsx             # Login/Signup
│   │   ├── Hotels.tsx            # Hotel listing
│   │   └── Booking.tsx           # Booking page
│   ├── services/                 # API services
│   ├── types/                    # TypeScript types
│   ├── utils/                    # Utility functions
│   ├── App.tsx                   # Main app component
│   ├── main.tsx                  # Entry point
│   ├── routes.tsx                # Route definitions
│   └── index.css                 # Global styles
│
├── server/                       # Backend source code
│   ├── src/
│   │   ├── config/
│   │   │   └── database.ts       # MongoDB connection
│   │   ├── models/               # Mongoose models
│   │   │   ├── User.ts           # User model
│   │   │   ├── Hotel.ts          # Hotel model
│   │   │   ├── Booking.ts        # Booking model
│   │   │   └── HotelierPayout.ts # Payout model
│   │   ├── controllers/          # Route controllers
│   │   │   ├── authController.ts
│   │   │   ├── hotelController.ts
│   │   │   └── bookingController.ts
│   │   ├── routes/               # API routes
│   │   │   ├── authRoutes.ts
│   │   │   ├── hotelRoutes.ts
│   │   │   └── bookingRoutes.ts
│   │   ├── middleware/
│   │   │   └── auth.ts           # JWT authentication
│   │   └── server.ts             # Express server
│   ├── package.json
│   └── tsconfig.json
│
├── public/                       # Static assets
├── docs/                         # Documentation
│   └── prd.md                    # Product requirements
├── .env.example                  # Environment template
├── .env.local                    # Local environment (create this)
├── package.json                  # Frontend dependencies
├── tsconfig.json                 # TypeScript config
├── vite.config.ts                # Vite config
├── tailwind.config.js            # Tailwind config
├── components.json               # shadcn/ui config
└── README.md                     # This file
```

---

## 👥 User Roles

### Admin
- Full platform management
- User verification and management
- Hotel verification
- View all bookings
- Analytics and reports
- System configuration

**Test Admin Account:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@maquamholidays.com",
    "password": "admin123",
    "username": "admin",
    "full_name": "Admin User",
    "role": "admin"
  }'
```

### Hotelier
- Create and manage hotel listings
- View bookings for their hotels
- Update hotel information
- Track payouts
- Upload hotel images

**Test Hotelier Account:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "hotelier@maquamholidays.com",
    "password": "hotelier123",
    "username": "hotelier",
    "full_name": "Hotel Owner",
    "role": "hotelier"
  }'
```

### Customer (User)
- Browse hotels
- Search and filter hotels
- Make bookings
- Manage bookings
- View booking history
- Customer portal access

**Test Customer Account:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@maquamholidays.com",
    "password": "user123",
    "username": "testuser",
    "full_name": "Test User",
    "role": "user"
  }'
```

---

## 💳 Payment Integration

### Razorpay Setup

1. **Create Razorpay Account**
   - Visit [Razorpay Dashboard](https://dashboard.razorpay.com/)
   - Sign up for an account
   - Complete KYC verification

2. **Get API Keys**
   - Go to Settings → API Keys
   - Generate Test/Live keys
   - Copy Key ID and Key Secret

3. **Configure Environment**
   ```env
   RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx
   RAZORPAY_KEY_SECRET=your_secret_here
   VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx
   ```

### Payment Flow

1. **Customer Creates Booking**
   - Booking saved with `payment_status: 'pending'`
   - Razorpay checkout modal opens

2. **Customer Completes Payment**
   - Payment processed through Razorpay
   - Payment ID generated

3. **Payment Verification**
   - Frontend calls `/api/bookings/verify-payment`
   - Backend verifies signature using HMAC-SHA256
   - Booking status updated to `confirmed`

4. **Payout to Hotelier**
   - Admin/System triggers payout
   - Commission calculated (15% or 0% for first 3 months)
   - Payout processed via Razorpay Payouts API

### Commission Structure
- **Default**: 15% platform fee
- **Promotional**: 0% for first 3 months (configurable)

---

## 🚢 Deployment

### Production Checklist

#### 1. MongoDB Atlas (Cloud Database)
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/maquam_holidays?retryWrites=true&w=majority
```

#### 2. Generate Secure JWT Secret
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

#### 3. Environment Variables
```env
NODE_ENV=production
CLIENT_URL=https://yourdomain.com
JWT_SECRET=<generated-secret>
RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxx
RAZORPAY_KEY_SECRET=<live-secret>
```

#### 4. Build Frontend
```bash
npm run build
```

#### 5. Build Backend
```bash
cd server
npm run build
```

#### 6. Use PM2 for Process Management
```bash
npm install -g pm2

# Start backend
cd server
pm2 start dist/server.js --name maquam-api

# Save PM2 configuration
pm2 startup
pm2 save
```

#### 7. Enable HTTPS
- Use Let's Encrypt for SSL certificates
- Configure reverse proxy (Nginx/Apache)
- Update CLIENT_URL to HTTPS domain

#### 8. Set Up Monitoring
- PM2 monitoring: `pm2 monit`
- MongoDB Atlas monitoring
- Application logs: `pm2 logs`

---

## 🔧 Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```

**Solution:**
```bash
# macOS
brew services start mongodb-community@7.0

# Linux
sudo systemctl start mongod

# Windows
# Start MongoDB service from Services app
```

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solution:**
```bash
# Find process using port
lsof -i :5000

# Kill process
kill -9 <PID>
```

### JWT Authentication Error
```
Error: Invalid or expired token
```

**Solution:**
- Check JWT_SECRET in `.env` file (minimum 32 characters)
- Clear browser localStorage
- Re-login to get new token

### Razorpay Payment Fails
**Solution:**
1. Verify RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in `.env`
2. Use test mode keys for development
3. Check webhook signature secret matches
4. Verify payment signature calculation

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Clear server cache
cd server
rm -rf node_modules package-lock.json
npm install
```

---

## 📞 Support

For issues or questions:
- **MongoDB Docs**: https://docs.mongodb.com/
- **Express Docs**: https://expressjs.com/
- **React Docs**: https://react.dev/
- **Razorpay Docs**: https://razorpay.com/docs/

---

## 🎯 Roadmap

### Phase 1 (Current)
- ✅ Hotel booking system
- ✅ User authentication
- ✅ Payment integration
- ✅ Multi-role dashboards

### Phase 2 (Coming Soon)
- ⏳ Flight search integration
- ⏳ AI-powered package generator
- ⏳ Email notifications
- ⏳ Real-time updates (Socket.io)

### Phase 3 (Future)
- 📅 Mobile app (React Native)
- 📅 Multi-language support
- 📅 Advanced analytics
- 📅 Loyalty program

---

## 📄 License

Copyright © 2025 Maquam Holidays Pvt Ltd. All rights reserved.

---

**Built with ❤️ for the Muslim community**
