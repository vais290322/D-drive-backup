# Maquam Holidays - System Architecture

## Overview

Maquam Holidays is a full-stack MERN application with MongoDB, Express, React, and Node.js.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         USER BROWSER                        │
│                    http://localhost:5173                    │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ HTTP Requests
                         │
┌────────────────────────▼────────────────────────────────────┐
│                    FRONTEND (React)                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Pages: Home, Hotels, Flights, Packages, Login       │  │
│  │  Components: UI components (shadcn/ui)               │  │
│  │  Context: AuthContext (user state)                   │  │
│  │  API Client: Axios (src/lib/api.ts)                  │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  Tech Stack:                                                │
│  - React 18 + TypeScript                                    │
│  - Vite (build tool)                                        │
│  - Tailwind CSS + shadcn/ui                                 │
│  - React Router (navigation)                                │
│  - Axios (HTTP client)                                      │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ API Calls
                         │ http://localhost:5000/api
                         │
┌────────────────────────▼────────────────────────────────────┐
│                   BACKEND (Express)                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Routes:                                              │  │
│  │  - /api/auth/*      (login, register, profile)       │  │
│  │  - /api/hotels/*    (CRUD operations)                │  │
│  │  - /api/bookings/*  (booking management)             │  │
│  │  - /api/flights/*   (flight search)                  │  │
│  │  - /api/packages/*  (package management)             │  │
│  │  - /api/payments/*  (Razorpay integration)           │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Middleware:                                          │  │
│  │  - CORS (cross-origin)                                │  │
│  │  - JWT Authentication                                 │  │
│  │  - Error handling                                     │  │
│  │  - Request logging                                    │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Controllers:                                         │  │
│  │  - authController (user auth)                         │  │
│  │  - hotelController (hotel CRUD)                       │  │
│  │  - bookingController (booking logic)                  │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  Tech Stack:                                                │
│  - Node.js + Express                                        │
│  - TypeScript                                               │
│  - JWT (authentication)                                     │
│  - bcryptjs (password hashing)                              │
│  - Mongoose (MongoDB ODM)                                   │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ Database Queries
                         │ mongodb://localhost:27017
                         │
┌────────────────────────▼────────────────────────────────────┐
│                    DATABASE (MongoDB)                       │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Collections:                                         │  │
│  │  - users         (user accounts)                      │  │
│  │  - hotels        (hotel listings)                     │  │
│  │  - bookings      (booking records)                    │  │
│  │  - flights       (flight data)                        │  │
│  │  - packages      (travel packages)                    │  │
│  │  - payments      (payment records)                    │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  Database: maquam_holidays                                  │
│  Port: 27017                                                │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. User Signup Flow

```
User fills signup form
    ↓
Frontend validates input
    ↓
POST /api/auth/register
    ↓
Backend validates data
    ↓
Hash password (bcryptjs)
    ↓
Save to MongoDB (users collection)
    ↓
Generate JWT token
    ↓
Return user + token
    ↓
Frontend stores token in localStorage
    ↓
Redirect to dashboard
```

### 2. Hotel Booking Flow

```
User searches hotels
    ↓
GET /api/hotels?location=Makkah
    ↓
Backend queries MongoDB
    ↓
Return filtered hotels
    ↓
User selects hotel
    ↓
POST /api/bookings
    ↓
Backend creates booking record
    ↓
Initiate Razorpay payment
    ↓
Payment success callback
    ↓
Update booking status
    ↓
Send confirmation email
```

### 3. Authentication Flow

```
User logs in
    ↓
POST /api/auth/login
    ↓
Backend finds user by email
    ↓
Compare password hash
    ↓
Generate JWT token
    ↓
Return token + user data
    ↓
Frontend stores in localStorage
    ↓
All subsequent requests include:
Authorization: Bearer <token>
    ↓
Backend middleware verifies token
    ↓
Attach user to request
    ↓
Controller processes request
```

## Security Layers

```
┌─────────────────────────────────────────┐
│  1. CORS Protection                     │
│     - Only allow localhost:5173         │
└─────────────────────────────────────────┘
            ↓
┌─────────────────────────────────────────┐
│  2. JWT Authentication                  │
│     - Verify token on protected routes  │
└─────────────────────────────────────────┘
            ↓
┌─────────────────────────────────────────┐
│  3. Password Hashing                    │
│     - bcryptjs with salt rounds         │
└─────────────────────────────────────────┘
            ↓
┌─────────────────────────────────────────┐
│  4. Input Validation                    │
│     - Validate all user inputs          │
└─────────────────────────────────────────┘
            ↓
┌─────────────────────────────────────────┐
│  5. Role-Based Access Control           │
│     - Admin, Hotelier, Customer roles   │
└─────────────────────────────────────────┘
```

## File Structure

```
maquam-holidays/
│
├── Frontend (React)
│   ├── src/
│   │   ├── pages/              # Page components
│   │   │   ├── Home.tsx
│   │   │   ├── Hotels.tsx
│   │   │   ├── Login.tsx
│   │   │   └── ...
│   │   ├── components/         # Reusable components
│   │   │   ├── ui/            # shadcn/ui components
│   │   │   ├── layouts/       # Layout components
│   │   │   └── ...
│   │   ├── contexts/          # React contexts
│   │   │   └── AuthContext.tsx
│   │   ├── lib/               # Utilities
│   │   │   └── api.ts         # API client
│   │   ├── hooks/             # Custom hooks
│   │   └── types/             # TypeScript types
│   ├── public/                # Static assets
│   └── package.json
│
├── Backend (Express)
│   └── server/
│       ├── src/
│       │   ├── controllers/   # Request handlers
│       │   │   ├── authController.ts
│       │   │   ├── hotelController.ts
│       │   │   └── bookingController.ts
│       │   ├── models/        # MongoDB models
│       │   │   ├── User.ts
│       │   │   ├── Hotel.ts
│       │   │   └── Booking.ts
│       │   ├── routes/        # API routes
│       │   │   ├── authRoutes.ts
│       │   │   ├── hotelRoutes.ts
│       │   │   └── bookingRoutes.ts
│       │   ├── middleware/    # Middleware
│       │   │   └── auth.ts
│       │   ├── config/        # Configuration
│       │   │   └── database.ts
│       │   └── server.ts      # Entry point
│       └── package.json
│
├── Documentation
│   ├── README.md              # Main documentation
│   ├── SETUP_GUIDE.md         # Setup instructions
│   ├── QUICK_REFERENCE.md     # Quick commands
│   ├── ARCHITECTURE.md        # This file
│   └── REQUIREMENTS.txt       # System requirements
│
└── Configuration
    ├── .env                   # Environment variables
    ├── .env.example           # Example env file
    ├── package.json           # Frontend dependencies
    ├── tsconfig.json          # TypeScript config
    └── vite.config.ts         # Vite config
```

## Technology Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS
- **shadcn/ui** - Component library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **React Hook Form** - Form handling
- **Zod** - Schema validation

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **TypeScript** - Type safety
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

### Development Tools
- **pnpm** - Package manager (frontend)
- **npm** - Package manager (backend)
- **nodemon** - Auto-restart server
- **ts-node** - TypeScript execution
- **Biome** - Linter and formatter

### Third-Party Services
- **Razorpay** - Payment gateway
- **MongoDB Atlas** - Cloud database (production)

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         PRODUCTION                          │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  Domain: maquamholidays.com                                 │
│  SSL/TLS: Let's Encrypt                                     │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│  Nginx Reverse Proxy                                        │
│  - SSL termination                                          │
│  - Load balancing                                           │
│  - Static file serving                                      │
└────────┬────────────────────────────────────┬───────────────┘
         │                                    │
         │ /api/*                             │ /*
         │                                    │
┌────────▼────────────────┐      ┌───────────▼───────────────┐
│  Backend (Node.js)      │      │  Frontend (Static Files)  │
│  - Express server       │      │  - Built React app        │
│  - Port 5000            │      │  - Served by Nginx        │
└────────┬────────────────┘      └───────────────────────────┘
         │
         │
┌────────▼────────────────┐
│  MongoDB Atlas          │
│  - Cloud database       │
│  - Replica set          │
│  - Automated backups    │
└─────────────────────────┘
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/change-password` - Change password

### Hotels
- `GET /api/hotels` - List all hotels
- `GET /api/hotels/:id` - Get hotel details
- `POST /api/hotels` - Create hotel (hotelier/admin)
- `PUT /api/hotels/:id` - Update hotel (hotelier/admin)
- `DELETE /api/hotels/:id` - Delete hotel (admin)

### Bookings
- `GET /api/bookings` - List user bookings
- `GET /api/bookings/:id` - Get booking details
- `POST /api/bookings` - Create booking
- `PUT /api/bookings/:id` - Update booking
- `DELETE /api/bookings/:id` - Cancel booking

### Payments
- `POST /api/payments/create-order` - Create Razorpay order
- `POST /api/payments/verify` - Verify payment
- `GET /api/payments/:id` - Get payment details

## Environment Variables

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxx
```

### Backend (.env)
```env
MONGODB_URI=mongodb://localhost:27017/maquam_holidays
PORT=5000
NODE_ENV=development
JWT_SECRET=your-secret-key
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=your-secret
CLIENT_URL=http://localhost:5173
```

## Development Workflow

```
1. Start MongoDB
   ↓
2. Start Backend (Terminal 1)
   cd server && npm run dev
   ↓
3. Start Frontend (Terminal 2)
   npm run dev
   ↓
4. Open Browser
   http://localhost:5173
   ↓
5. Make Changes
   - Frontend: Hot reload
   - Backend: Auto restart (nodemon)
   ↓
6. Test Features
   - Signup/Login
   - Browse hotels
   - Make bookings
   ↓
7. Commit Changes
   git add .
   git commit -m "message"
```

## Troubleshooting Flow

```
Issue: Signup not working
    ↓
Check: Is MongoDB running?
    ↓ No → Start MongoDB
    ↓ Yes
    ↓
Check: Is backend running?
    ↓ No → Start backend
    ↓ Yes
    ↓
Check: Backend logs for errors
    ↓
Check: Network tab in browser
    ↓
Check: Environment variables
    ↓
Check: Database connection
    ↓
Issue resolved ✓
```

---

**For more details, see:**
- [README.md](./README.md) - Full documentation
- [SETUP_GUIDE.md](./SETUP_GUIDE.md) - Setup instructions
- [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) - Quick commands
