# Welcome to Your Miaoda Project
Miaoda Application Link URL
    URL:https://medo.dev/projects/app-7mzgg63hukg1

# Digital Dreems - Loan Management CRM System

A comprehensive loan management CRM system for managing customer information, loan products, EMI collections, KYC verification, and business analytics.

**Designed & Developed By:** Vais Engineering Pvt Ltd

## 🚀 Features

### Core Functionality
- **Customer Management**: Complete customer lifecycle management with KYC verification
- **Product Inventory**: Track mobile phones, laptops, TVs, vehicles, and other assets
- **Loan Management**: Create and manage loans with automatic EMI calculation
- **EMI Collections**: Record payments with multiple payment modes (Cash, UPI, Bank Transfer)
- **Penalty Management**: Apply and track penalties for late payments, cheque bounces, etc.
- **User Management**: Role-based access control with 6 different user roles
- **Dashboard Analytics**: Real-time insights into loan portfolio performance

### User Roles
1. **Super Admin** - Full system access
2. **Admin** - Manage customers, products, loans, and collections
3. **Loan Manager** - Create and manage loans, collect payments
4. **Collection Agent** - Collect EMI payments and view loan details
5. **Data Entry Staff** - Add and edit customers and products
6. **KYC Verifier** - Verify customer KYC documents

### Key Features
- ✅ Google SSO Authentication
- ✅ Automatic EMI calculation (Flat & Reducing interest)
- ✅ Complete loan ledger with payment history
- ✅ KYC verification workflow
- ✅ Penalty tracking and management
- ✅ Guarantor information management
- ✅ Mobile-responsive design
- ✅ Dark mode support

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **UI Framework**: shadcn/ui + Tailwind CSS
- **Backend**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth with Google OAuth
- **State Management**: React Context + Hooks
- **Form Validation**: React Hook Form + Zod
- **Icons**: Lucide React

## 📋 Prerequisites

- Node.js ≥ 20
- npm ≥ 10
- Supabase account

## 🚀 Getting Started

### 1. Environment Setup

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Database Setup

The database schema is already configured in `supabase/migrations/`. The system includes:
- User profiles with role management
- Customer master with KYC fields
- Product inventory
- Loans with EMI tracking
- Payment history
- Penalty records

### 4. Run Development Server

```bash
npm run dev -- --host 127.0.0.1
```

Or alternatively:

```bash
npx vite --host 127.0.0.1
```

### 5. First Time Login

1. Visit the application URL
2. Click "Sign in with Google"
3. The first user to register will automatically become **Super Admin**
4. Super Admin can then assign roles to other users

## 📁 Project Structure

```
├── src/
│   ├── components/
│   │   ├── auth/          # Authentication components
│   │   ├── common/        # Shared components (Header, Footer)
│   │   └── ui/            # shadcn/ui components
│   ├── db/
│   │   ├── api.ts         # API layer for database operations
│   │   └── supabase.ts    # Supabase client configuration
│   ├── pages/
│   │   ├── Dashboard.tsx       # Main dashboard
│   │   ├── Customers.tsx       # Customer list
│   │   ├── CustomerForm.tsx    # Add/Edit customer
│   │   ├── CustomerDetail.tsx  # Customer details with KYC
│   │   ├── Products.tsx        # Product list
│   │   ├── ProductForm.tsx     # Add/Edit product
│   │   ├── Loans.tsx           # Loan list
│   │   ├── LoanForm.tsx        # Create loan with EMI calculator
│   │   ├── LoanDetail.tsx      # Loan details with ledger
│   │   ├── Collections.tsx     # EMI collection interface
│   │   └── Users.tsx           # User management
│   ├── types/
│   │   └── types.ts       # TypeScript type definitions
│   ├── App.tsx            # Main app component
│   └── routes.tsx         # Route configuration
├── supabase/
│   └── migrations/        # Database migration files
├── docs/
│   └── SYSTEM_GUIDE.md    # Detailed user guide
└── TODO.md                # Implementation tracking
```

## 🎨 Design System

### Color Palette
- **Primary**: Deep Blue (#1e3a8a) - Trust and professionalism
- **Accent**: Green (#10b981) - Positive actions and success
- **Background**: White with subtle secondary tones

### Typography
- Clean, modern sans-serif fonts
- Clear visual hierarchy
- Responsive text sizing

## 📊 Database Schema

### Main Tables
1. **profiles** - User accounts and roles
2. **customers** - Customer master with KYC
3. **products** - Product inventory
4. **loans** - Loan accounts
5. **emi_payments** - Payment history
6. **penalties** - Penalty records

### Key Features
- Auto-generated codes (CUST000001, PROD000001, LOAN000001)
- Row-level security (RLS) for data protection
- Automatic timestamp tracking
- Referential integrity with foreign keys

## 🔐 Security

- Google OAuth authentication
- Role-based access control (RBAC)
- Row-level security on all tables
- Secure API endpoints
- Environment variable protection

## 📱 Responsive Design

The application is optimized for:
- Desktop computers (1920x1080, 1366x768)
- Laptops (1280x720, 1536x864)
- Tablets (768x1024)
- Mobile devices (375x667, 414x896)

## 🧪 Testing

Run linting:

```bash
npm run lint
```

## 🔍 Troubleshooting

### Blank Screen Issue

If you see a blank screen after deployment:

1. **Check System Health**
   - Visit `/health.html` to run diagnostics
   - This will check browser compatibility, network, and Supabase connectivity

2. **Check Browser Console**
   - Open Developer Tools (F12)
   - Look for error messages in the Console tab
   - Common issues:
     - Missing environment variables
     - Supabase connection errors
     - Network connectivity issues

3. **Verify Environment Variables**
   ```bash
   # Check .env file exists and has correct values
   cat .env
   ```

4. **Clear Browser Cache**
   - Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
   - Clear all browser data
   - Try incognito/private mode

5. **Check Auth Timeout**
   - The app has a 5-second auth initialization timeout
   - If auth fails, it will redirect to login page
   - Check console for "Auth initialization timeout" message

6. **Verify Supabase Connection**
   - Check Supabase dashboard is accessible
   - Verify project is not paused
   - Test API endpoint: `https://your-project.supabase.co/rest/v1/`

For detailed troubleshooting steps, see [PRODUCTION_CHECKLIST.md](PRODUCTION_CHECKLIST.md)

## 📖 User Guide

For detailed usage instructions, see [QUICK_START.md](QUICK_START.md)

## 📚 Documentation

- **[QUICK_START.md](QUICK_START.md)** - User guide and getting started
- **[PRODUCTION_CHECKLIST.md](PRODUCTION_CHECKLIST.md)** - Production deployment checklist
- **[DEPLOYMENT_NOTES.md](DEPLOYMENT_NOTES.md)** - Technical deployment details
- **[TODO.md](TODO.md)** - Implementation tracking
- **[/health.html](public/health.html)** - System health check page

## 🚀 Deployment

The application is ready for production deployment. Ensure:
1. Environment variables are configured
2. Supabase project is set up
3. Google OAuth is configured in Supabase
4. Database migrations are applied

## 📝 License

Proprietary - Vais Engineering Pvt Ltd

## 🤝 Support

For technical support or feature requests, contact Vais Engineering Pvt Ltd.

---

**Digital Dreems Loan Management CRM**  
Version 1.0.0  
© 2025 Vais Engineering Pvt Ltd
