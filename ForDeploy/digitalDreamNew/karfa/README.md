# Digital Dreems - Loan Management CRM

A comprehensive loan management system with CRM and banking capabilities, built with React + Vite frontend and Node.js + MongoDB backend.

## 🚀 Features

### Core Loan Management
- **Customer Management** - Complete customer profiles with KYC verification
- **Loan Processing** - Create, track, and manage loans with automated EMI calculations
- **Payment Collections** - Record and track EMI payments
- **Customer Ledger** - Detailed transaction history
- **Reports & Analytics** - Financial reports, delayed EMIs, active loans

### CRM Module
- **Contact Management** - Track customer contacts
- **Deal Pipeline** - Manage sales opportunities
- **Tasks & Activities** - Track interactions and follow-ups
- **Dashboard Analytics** - Pipeline metrics and performance KPIs

### Banking Module
- **Bank Customer Management** - Separate banking customer profiles
- **Account Management** - Multiple account types per customer
- **Transactions** - Deposits, withdrawals, transfers
- **Banking Reports** - Transaction history, balance summaries

### Additional Features
- **User Management** - Role-based access control (Super Admin, Admin, Manager, Staff)
- **Settings** - Company branding, logo upload, business information
- **Premium UI** - Modern gradient design with dark sidebar
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Network Access** - Access from multiple devices on the same network

## 📋 Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **Shadcn/UI** - Component library
- **React Router** - Navigation
- **Recharts** - Data visualization
- **Lucide React** - Icons

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Multer** - File uploads
- **bcrypt** - Password hashing

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ installed
- MongoDB installed and running
- Git (optional)

### Backend Setup

1. Navigate to backend directory:
   ```bash
   cd digitaldreams-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file:
   ```env
   PORT=4000
   MONGO_URI=mongodb://localhost:27017/digitaldreams
   JWT_SECRET=your_jwt_secret_key_here
   ```

4. Initialize admin user:
   ```bash
   node src/init-admin.js
   ```
   Default credentials:
   - Email: admin@digitaldreams.com
   - Password: admin123

5. Start development server:
   ```bash
   npm run dev
   ```
   Backend will run on `http://localhost:4000`

### Frontend Setup

1. Navigate to frontend directory:
   ```bash
   cd digitaldreams-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file (for local access):
   ```env
   VITE_API_BASE_URL=http://localhost:4000/api
   ```

   **For network access from other devices:**
   ```env
   VITE_API_BASE_URL=http://YOUR_IP_ADDRESS:4000/api
   ```
   (Replace YOUR_IP_ADDRESS with your computer's IP)

4. Start development server:
   ```bash
   npm run dev
   ```
   Frontend will run on `http://localhost:5173`

## 🌐 Network Access

To access from other devices on the same network:

1. Find your computer's IP address:
   ```bash
   ipconfig  # Windows
   ifconfig  # Mac/Linux
   ```

2. Update frontend `.env`:
   ```env
   VITE_API_BASE_URL=http://192.168.0.135:4000/api
   ```

3. Access from other device:
   - Frontend: `http://192.168.0.135:5173`
   - Both devices must be on the same WiFi/network

## 📁 Project Structure

```
digitaldreams-backend/
├── src/
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   │   ├── crm/        # CRM endpoints
│   │   └── banking/    # Banking endpoints
│   ├── middleware/      # Auth middleware
│   └── index.js        # Server entry point
├── uploads/            # Uploaded files
└── package.json

digitaldreams-frontend/
├── src/
│   ├── components/     # React components
│   │   ├── ui/        # Shadcn components
│   │   └── common/    # Shared components
│   ├── pages/         # Page components
│   │   ├── crm/       # CRM pages
│   │   └── banking/   # Banking pages
│   ├── db/            # API clients
│   ├── lib/           # Utilities
│   └── types/         # TypeScript types
└── package.json
```

## 🔐 User Roles & Permissions

- **Super Admin** - Full system access
- **Admin** - Manage users, all features except system settings
- **Manager** - Create/edit loans, customers, limited reports
- **Staff** - View customers, collect payments, basic access

## 📊 Key Features Breakdown

### Dashboard
- 10+ KPIs with real-time data
- Trend indicators and percentages
- Interactive charts (Pie, Bar)
- Quick action buttons
- Premium gradient design

### Customer Management
- Full KYC details (Aadhar, PAN, address proof)
- Photo upload
- KYC verification workflow
- Customer search and filtering
- Detailed customer ledger

### Loan Processing
- Multiple product types
- Flexible EMI calculations
- Interest rate configuration
- Processing fee support
- Automated schedule generation
- Loan status tracking

### Collections
- Pending EMI list
- Quick payment recording
- Partial payment support
- Receipt generation
- Delayed EMI tracking

### CRM Features
- Contact management (removed company linkage for simplicity)
- Deal pipeline management
- Task tracking
- Activity logging
- Dashboard with metrics

### Banking Features
- Customer accounts
- Deposit/withdrawal processing
- Account balance tracking
- Transaction history
- Daily summaries

## 🎨 UI Features

- **Premium Gradient Cards** - Modern, colorful design
- **Dark Sidebar** - Professional gradient sidebar
- **Compact Tables** - Efficient data display
- **Hover Effects** - Interactive animations
- **Responsive Layout** - Mobile-friendly
- **Gradient Badges** - Status indicators

## 🔧 API Endpoints

### Authentication
- POST `/auth/register` - Register new user
- POST `/auth/login` - Login

### Customers
- GET `/api/customers` - List all customers
- GET `/api/customers/:id` - Get customer details
- POST `/api/customers` - Create customer
- PUT `/api/customers/:id` - Update customer
- GET `/api/customers/search?q=` - Search customers

### Loans
- GET `/api/loans` - List all loans
- GET `/api/loans/:id` - Get loan details
- POST `/api/loans` - Create loan
- PUT `/api/loans/:id` - Update loan

### Payments
- GET `/api/payments` - List payments
- POST `/api/payments` - Record payment
- GET `/api/payments/loan/:loanId` - Get loan payments

### Reports
- GET `/api/reports/dashboard` - Dashboard stats
- Various report endpoints

### CRM
- `/api/crm/contacts` - Contact management
- `/api/crm/deals` - Deal management
- `/api/crm/tasks` - Task management
- `/api/crm/activities` - Activity tracking
- `/api/crm/stats` - CRM analytics

### Banking
- `/api/banking/customers` - Bank customers
- `/api/banking/accounts` - Bank accounts
- `/api/banking/transactions` - Transactions
- `/api/banking/stats` - Banking analytics

## 🐛 Troubleshooting

### Backend won't start
- Ensure MongoDB is running
- Check `.env` file exists and has correct values
- Verify port 4000 is not in use

### Frontend can't connect to backend
- Verify backend is running on port 4000
- Check `.env` file has correct API URL
- Check browser console for CORS errors

### Login fails
- Ensure admin user is initialized (`node src/init-admin.js`)
- Check MongoDB connection
- Verify JWT_SECRET is set

### Network access doesn't work
- Both devices must be on same network
- Check Windows Firewall allows ports 4000, 5173
- Verify IP address in frontend `.env`
- Test backend: `http://YOUR_IP:4000` should show API message

## 📝 Development Notes

- All backend routes require JWT authentication (except login/register)
- File uploads stored in `digitaldreams-backend/uploads/`
- Settings logo uploads limited to 5MB image files
- Default MongoDB database name: `digitaldreams`
- Session timeout: Based on JWT expiration

## 🚀 Production Deployment

1. Build frontend:
   ```bash
   cd digitaldreams-frontend
   npm run build
   ```

2. Serve `dist` folder with a web server (nginx, Apache, etc.)

3. Set production environment variables:
   ```env
   NODE_ENV=production
   MONGO_URI=mongodb://production-server:27017/digitaldreams
   JWT_SECRET=strong_production_secret
   ```

4. Use PM2 or similar to run backend:
   ```bash
   pm2 start src/index.js --name digitaldreams-api
   ```

## 📄 License

Proprietary - Vais Engineering Pvt Ltd

## 👥 Credits

Designed & Developed by **Vais Engineering Pvt Ltd**

Version: 1.0.0

---

For support or questions, contact your system administrator.

