require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const axios = require("axios");


const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');
const customersRoutes = require('./routes/customers');
const loansRoutes = require('./routes/loans');
const productsRoutes = require('./routes/products');
const paymentsRoutes = require('./routes/payments');
const reportsRoutes = require('./routes/reports');
const settingsRoutes = require('./routes/settings');
const uploadRoutes = require('./routes/upload');

// CRM Routes
const crmCompaniesRoutes = require('./routes/crm/companies');
const crmContactsRoutes = require('./routes/crm/contacts');
const crmDealsRoutes = require('./routes/crm/deals');
const crmActivitiesRoutes = require('./routes/crm/activities');
const crmTasksRoutes = require('./routes/crm/tasks');
const crmStatsRoutes = require('./routes/crm/stats');

// Banking Routes
const bankingCustomersRoutes = require('./routes/banking/customers');
const bankingAccountsRoutes = require('./routes/banking/accounts');
const bankingTransactionsRoutes = require('./routes/banking/transactions');
const bankingStatsRoutes = require('./routes/banking/stats');

const app = express();
const PORT = process.env.PORT || 4000;

// Enable CORS for all origins (for development)
app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json({ limit: '10mb' }));

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get('/', (req, res) => res.json({ ok: true, message: 'Mit Electro World API' }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/customers', customersRoutes);
app.use('/api/loans', loansRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/upload', uploadRoutes);

// CRM Routes
app.use('/api/crm/companies', crmCompaniesRoutes);
app.use('/api/crm/contacts', crmContactsRoutes);
app.use('/api/crm/deals', crmDealsRoutes);
app.use('/api/crm/activities', crmActivitiesRoutes);
app.use('/api/crm/tasks', crmTasksRoutes);
app.use('/api/crm/stats', crmStatsRoutes);

// Banking Routes
app.use('/api/banking/customers', bankingCustomersRoutes);
app.use('/api/banking/accounts', bankingAccountsRoutes);
app.use('/api/banking/transactions', bankingTransactionsRoutes);
app.use('/api/banking/stats', bankingStatsRoutes);

// Profit And Loss Route
app.use('/api/pnl', require('./routes/profitAndLoss'));
app.use('/api/service-requests', require('./routes/serviceRequests'));


async function start() {
  // Server startup
  try {
    const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/mitelectroworld';
    await mongoose.connect(uri, { autoIndex: true });
    console.log('Connected to MongoDB');

    // ✅ Load cron AFTER DB connection
    require("./corn/emiReminderCron");

    // Listen on all network interfaces (0.0.0.0) to accept connections from other devices
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server listening on http://0.0.0.0:${PORT}`);
      console.log(`Access from this device: http://localhost:${PORT}`);
      console.log(`Access from other devices: http://<YOUR_IP>:${PORT}`);

    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();