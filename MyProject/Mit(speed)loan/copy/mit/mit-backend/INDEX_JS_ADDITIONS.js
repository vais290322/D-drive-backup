/**
 * ================================================================
 * EXACT CODE TO ADD TO src/index.js
 * Copy the imports and route registration sections below
 * ================================================================
 */

// ================================================================
// SECTION A: ADD THESE IMPORTS AT THE TOP (around line 10-30)
// ================================================================

/**
CURRENT src/index.js has:
  const authRoutes = require('./routes/auth');
  const usersRoutes = require('./routes/users');
  const customersRoutes = require('./routes/customers');
  const loansRoutes = require('./routes/loans');
  ... etc

ADD THIS LINE after the other route imports:
*/

const phonepeRoutes = require('./routes/phonepe');

/**
FULL IMPORT SECTION SHOULD LOOK LIKE:

const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');
const customersRoutes = require('./routes/customers');
const loansRoutes = require('./routes/loans');
const productsRoutes = require('./routes/products');
const paymentsRoutes = require('./routes/payments');
const reportsRoutes = require('./routes/reports');
const settingsRoutes = require('./routes/settings');
const uploadRoutes = require('./routes/upload');
const phonepeRoutes = require('./routes/phonepe');  // ✅ ADD THIS

// CRM Routes
const crmCompaniesRoutes = require('./routes/crm/companies');
... etc
*/

// ================================================================
// SECTION B: REGISTER ROUTE IN app.use() (around line 50-65)
// ================================================================

/**
CURRENT src/index.js has:
  app.use('/api/auth', authRoutes);
  app.use('/api/users', usersRoutes);
  app.use('/api/customers', customersRoutes);
  app.use('/api/loans', loansRoutes);
  ... etc

ADD THIS LINE after other route registrations:
*/

app.use('/api/phonepe', phonepeRoutes);

/**
FULL ROUTES SECTION SHOULD LOOK LIKE:

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/customers', customersRoutes);
app.use('/api/loans', loansRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/phonepe', phonepeRoutes);  // ✅ ADD THIS
app.use('/api/reports', reportsRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/upload', uploadRoutes);

// CRM Routes
app.use('/api/crm/companies', crmCompaniesRoutes);
... etc
*/

// ================================================================
// SECTION C: VALIDATE PHONEPE CONFIG ON STARTUP (optional)
// ================================================================

/**
Add this in your start() function for production safety:
*/

async function start() {
    try {
        const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/mitelectroworld';
        await mongoose.connect(uri, { autoIndex: true });
        console.log('Connected to MongoDB');

        // ✅ ADD THIS: Validate PhonePe configuration
        try {
            const PhonePeService = require('./services/PhonePeService');
            PhonePeService.validateConfig();
            console.log('✅ PhonePe configuration validated');
        } catch (error) {
            console.warn('⚠️ PhonePe not configured - QR generation will fail');
            console.warn(`   Error: ${error.message}`);
            console.warn('   Add PhonePe credentials to .env to enable');
            // Don't fail startup - PhonePe is optional
        }

        // Load cron
        require("./corn/emiReminderCron");

        app.listen(PORT, '0.0.0.0', () => {
            console.log(`Server listening on http://0.0.0.0:${PORT}`);
        });

    } catch (error) {
        console.error('Server startup error:', error);
        process.exit(1);
    }
}

// ================================================================
// COMPLETE UPDATED src/index.js EXAMPLE
// ================================================================

/**

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const axios = require("axios");

// ✅ All route imports
const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');
const customersRoutes = require('./routes/customers');
const loansRoutes = require('./routes/loans');
const productsRoutes = require('./routes/products');
const paymentsRoutes = require('./routes/payments');
const reportsRoutes = require('./routes/reports');
const settingsRoutes = require('./routes/settings');
const uploadRoutes = require('./routes/upload');
const phonepeRoutes = require('./routes/phonepe');  // ✅ PhonePe NEW

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
const { recoverImages } = require('./migrateImages');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json({ limit: '10mb' }));

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get('/', (req, res) => res.json({ ok: true, message: 'Mit Electro World API' }));

// ✅ API Routes (with PhonePe)
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/customers', customersRoutes);
app.use('/api/loans', loansRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/phonepe', phonepeRoutes);  // ✅ PhonePe NEW
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

// Other Routes
app.use('/api/pnl', require('./routes/profitAndLoss'));
app.use('/api/service-requests', require('./routes/serviceRequests'));

async function start() {
  try {
    const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/mitelectroworld';
    await mongoose.connect(uri, { autoIndex: true });
    console.log('Connected to MongoDB');

    // ✅ PhonePe Configuration Validation (NEW)
    try {
      const PhonePeService = require('./services/PhonePeService');
      PhonePeService.validateConfig();
      console.log('✅ PhonePe configuration validated');
    } catch (error) {
      console.warn('⚠️ PhonePe configuration incomplete');
      console.warn(`   Details: ${error.message}`);
    }

    require("./corn/emiReminderCron");

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server listening on http://0.0.0.0:${PORT}`);
      console.log(`Access from this device: http://localhost:${PORT}`);
      console.log(`Access from other devices: http://<YOUR_IP>:${PORT}`);
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

start();

*/

// ================================================================
// COMMON MISTAKES TO AVOID
// ================================================================

/**
❌ WRONG: Forgetting to require the route
❌ app.use('/api/phonepe', phonepeRoutes);
✅ CORRECT: Import first, then use
   const phonepeRoutes = require('./routes/phonepe');
   app.use('/api/phonepe', phonepeRoutes);

❌ WRONG: Using absolute path
❌ const phonepeRoutes = require('/absolute/path/routes/phonepe');
✅ CORRECT: Use relative path
   const phonepeRoutes = require('./routes/phonepe');

❌ WRONG: Wrong route order
❌ app.use('/api/phonepe', phonepeRoutes);
❌ const phonepeRoutes = require('./routes/phonepe');
✅ CORRECT: Import first, use second
   const phonepeRoutes = require('./routes/phonepe');
   app.use('/api/phonepe', phonepeRoutes);

❌ WRONG: Typo in route path
❌ app.use('/api/phonpe', phonepeRoutes);  // phonpe not phonepe
✅ CORRECT:
   app.use('/api/phonepe', phonepeRoutes);  // exact spelling

❌ WRONG: Missing .js extension
❌ const phonepeRoutes = require('./routes/phonepe');  // usually ok
✅ CORRECT: Both work, but explicit is clearer
   const phonepeRoutes = require('./routes/phonepe.js');

*/

// ================================================================
// VERIFICATION CHECKLIST
// ================================================================

/**
After adding code to index.js, verify:

[ ] Import statement added:
    const phonepeRoutes = require('./routes/phonepe');
    
[ ] Route registration added:
    app.use('/api/phonepe', phonepeRoutes);
    
[ ] No syntax errors (check line numbers match)
    
[ ] File saved
    
[ ] Restart server:
    npm start
    
[ ] Check logs for errors:
    Should NOT see any 'phonepe' related errors
    
[ ] Optional: Test endpoint
    curl http://localhost:4000/api/phonepe/webhook
    Should return 404 or method not allowed (expected)
    
[ ] Optional: Verify config validation
    Should either show "PhonePe configuration validated"
    Or warning about incomplete config (expected if .env not set yet)
*/

module.exports = {
    // This file is documentation only
};
