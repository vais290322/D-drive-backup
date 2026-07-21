/**
 * ================================================================
 * IMPLEMENTATION CHECKLIST - FOLLOW THESE STEPS IN ORDER
 * ================================================================
 */

// ================================================================
// PART 1: FILES & SETUP (5 minutes)
// ================================================================

/**
✅ STEP 1: Verify all files are in place
   
   Check these files exist in your project:
   
   New Service:
   □ src/services/PhonePeService.js
     (Should be ~445 lines with getAccessToken, createStaticQR, etc.)
   
   New Controller:
   □ src/controllers/phonepeController.js
     (Should be ~280+ lines with webhook handler, EMI update logic)
   
   New Routes:
   □ src/routes/phonepe.js
     (Should be ~45 lines with 4 route endpoints)
   
   New Utility:
   □ src/utils/logger.js
     (Should be ~40 lines with logging methods)
   
   Models Updated:
   □ src/models/Loan.js
   □ src/models/EmiSchedule.js
   □ src/models/Transaction.js
   
   Documentation:
   □ README_PHONEPE_INTEGRATION.md
   □ PHONEPE_QUICK_START.js
   □ PHONEPE_INTEGRATION_GUIDE.js
   □ INDEX_JS_ADDITIONS.js
   □ INTEGRATION_SUMMARY.js (this file)

✅ STEP 2: Add PhonePe credentials to .env

   Edit your .env file and add:
   
   PHONEPE_MERCHANT_ID=your_merchant_id
   PHONEPE_CLIENT_ID=your_client_id
   PHONEPE_CLIENT_SECRET=your_client_secret
   PHONEPE_SALT_KEY=your_salt_key
   PHONEPE_SALT_INDEX=1
   PHONEPE_ENV=sandbox
   
   Get credentials from PhonePe merchant dashboard:
   https://dashboard.phonepe.com/
*/

// ================================================================
// PART 2: INTEGRATE WITH index.js (2 minutes)
// ================================================================

/**
✅ STEP 3: Add PhonePe route import

   Open: src/index.js
   Find: Line with other route imports (like authRoutes, loansRoutes, etc.)
   
   ADD THIS LINE:
   const phonepeRoutes = require('./routes/phonepe');
   
   Example location (around line 20):
   
   const authRoutes = require('./routes/auth');
   const usersRoutes = require('./routes/users');
   const customersRoutes = require('./routes/customers');
   const loansRoutes = require('./routes/loans');
   const phonepeRoutes = require('./routes/phonepe');  // ✅ ADD THIS LINE

✅ STEP 4: Register PhonePe route

   Find: Where all routes are registered (app.use statements)
   
   ADD THIS LINE:
   app.use('/api/phonepe', phonepeRoutes);
   
   Example location (around line 55):
   
   app.use('/api/auth', authRoutes);
   app.use('/api/users', usersRoutes);
   app.use('/api/customers', customersRoutes);
   app.use('/api/loans', loansRoutes);
   app.use('/api/phonepe', phonepeRoutes);  // ✅ ADD THIS LINE

✅ STEP 5: (Optional but recommended) Add PhonePe config validation

   Find: Your start() function in index.js
   
   ADD THIS CODE after MongoDB connection:
   
   try {
     const PhonePeService = require('./services/PhonePeService');
     PhonePeService.validateConfig();
     console.log('✅ PhonePe configuration validated');
   } catch (error) {
     console.warn('⚠️ PhonePe configuration incomplete');
     console.warn(`   Error: ${error.message}`);
   }
   
   This will validate PhonePe setup on startup.
*/

// ================================================================
// PART 3: UPDATE LOAN CREATION (3 minutes)
// ================================================================

/**
✅ STEP 6: Locate loan creation route

   Open: src/routes/loans.js
   Find: POST route (line ~67, starts with "router.post('/', auth, async (req, res)")
   
   Inside this route, find: The section where loan is created (Loan.create or similar)

✅ STEP 7: Replace QR generation section

   FIND THIS (around line 70-95):
   
   // 3. Generate Static QR Token & URL
   const qrToken = crypto.randomBytes(16).toString('hex');
   data.qr_token = qrToken;
   
   const paymentUrl = `${process.env.BASE_URL}/api/payments/pay/q/${qrToken}`;
   try {
     data.qr_code_url = await QRCode.toDataURL(paymentUrl);
   } catch (qrErr) {
     console.error('Failed to generate static QR code image:', qrErr);
   }
   
   // 4. Create Loan
   const loan = await Loan.create(data);
   
   REPLACE WITH THIS:
   
   // 3. Create Loan
   const loan = await Loan.create(data);
   
   // 4. Generate PhonePe Static QR ✅ NEW
   try {
     const PhonePeService = require('../services/PhonePeService');
     
     console.log(`📱 Generating PhonePe Static QR for Loan: ${loan.loan_code}`);
     
     const qrData = await PhonePeService.createStaticQR(
       loan._id.toString(),
       loan.loan_code,
       loan.installment_amount
     );
     
     loan.phonepe_qr_data = qrData;
     await loan.save();
     
     console.log(`✅ PhonePe Static QR generated`);
     
   } catch (qrError) {
     console.warn(`⚠️ PhonePe QR generation failed: ${qrError.message}`);
     // Don't fail entire loan creation - user can regenerate later
   }
   
   Then continue with the existing EMI schedule generation code.

✅ STEP 8: Verify loans.js changes

   After the PhonePe QR generation, the rest of the loan creation code
   should remain unchanged:
   
   // 5. Generate EMI Schedule
   try {
     const schedule = await generateOrUpdateSchedule(loan, null, []);
     ...
   }
   
   The change is ONLY in the QR generation part.
*/

// ================================================================
// PART 4: VERIFY MODELS (1 minute)
// ================================================================

/**
✅ STEP 9: Verify Loan model has PhonePe field

   Open: src/models/Loan.js
   
   Check that this section exists:
   
   phonepe_qr_data: {
     qrId: { type: String },
     qrString: { type: String },
     url: { type: String },
     merchantTransactionId: { type: String },
     imageUrl: { type: String }
   }
   
   ✓ If it exists → No change needed
   ✓ If it doesn't exist → It was already added in the update

✅ STEP 10: Verify EmiSchedule model has payment fields

   Open: src/models/EmiSchedule.js
   
   Check that these fields exist:
   
   phonepe_transaction_id: { type: String },
   payment_method: { type: String },
   
   ✓ These were already added in the update

✅ STEP 11: Verify Transaction model has PhonePe fields

   Open: src/models/Transaction.js
   
   Check that these fields exist:
   
   phonepe_merchant_transaction_id: { type: String },
   phonepe_transaction_id: { type: String },
   phonepe_utr: { type: String },
   verified: { type: Boolean },
   webhook_id: { type: String },
   webhook_data: { type: Object },
   emi_updated: { ... },
   
   ✓ These were already added in the update
*/

// ================================================================
// PART 5: TEST SETUP (5 minutes)
// ================================================================

/**
✅ STEP 12: Restart server

   Terminal:
   npm start
   
   You should see:
   ✅ Connected to MongoDB
   ✅ PhonePe configuration validated (or warning if .env missing)
   ✓ Server listening on http://0.0.0.0:4000
   
   No errors should appear related to phonepe.

✅ STEP 13: Test loan creation

   Using Postman or curl:
   
   POST http://localhost:4000/api/loans
   
   Headers:
   Authorization: Bearer {your_token}
   Content-Type: application/json
   
   Body:
   {
     "loan_code": "TEST-001",
     "customer_id": "{customer_id}",
     "principal_amount": 50000,
     "installment_amount": 5000,
     "interest_rate": 12,
     "interest_type": "flat",
     "tenure_months": 12,
     "loan_type": "monthly",
     "start_date": "2024-03-02",
     "first_emi_date": "2024-04-01",
     "emi_day_of_month": 1,
     "created_by": "{admin_id}"
   }
   
   Response should include:
   {
     "_id": "...",
     "loan_code": "TEST-001",
     "phonepe_qr_data": {
       "qrId": "...",
       "qrString": "...",
       "url": "...",
       "imageUrl": "...",
       "merchantTransactionId": "..."
     },
     ...
   }
   
   ✅ If you see phonepe_qr_data → Integration successful!
   ❌ If missing → Check PhonePe credentials in .env

✅ STEP 14: Test webhook endpoint

   Using curl:
   
   curl -X POST http://localhost:4000/api/phonepe/webhook \
     -H "Content-Type: application/json" \
     -H "X-VERIFY: dummy_signature" \
     -d '{"data": {"merchantTransactionId": "123"}}'
   
   Response should be:
   HTTP 200 OK
   
   (Note: Signature validation will fail with dummy, but endpoint should respond)

✅ STEP 15: Check logs

   You should see in console:
   ✅ PhonePe configuration validated
   📱 Creating Static QR for Loan: TEST-001
   ✅ PhonePe Static QR generated
   
   No errors about missing files or services.
*/

// ================================================================
// PART 6: PRODUCTION SETUP (5 minutes)
// ================================================================

/**
✅ STEP 16: Register webhook in PhonePe dashboard

   1. Visit: https://dashboard.phonepe.com/
   2. Go to: Settings → Webhooks
   3. Add webhook URL:
      https://yourapi.com/api/phonepe/webhook
   4. Select events: Payment Success
   5. Save and test

✅ STEP 17: Switch to production

   In .env file, change:
   PHONEPE_ENV=sandbox  →  PHONEPE_ENV=production
   
   Or keep as 'sandbox' for testing first.

✅ STEP 18: Test with real payment (optional)

   1. Create a test loan
   2. Get the QR code (from loan response phonepe_qr_data.imageUrl)
   3. Scan with real UPI app
   4. Complete a small payment
   5. Check webhook received
   6. Verify EMI updated in database

✅ STEP 19: Set up monitoring

   Monitor these:
   - Webhook processing times (should be <1 second)
   - Payment success rate (should be 100%)
   - EMI update rate (should match payment rate)
   - Database transaction records
   - Error logs

✅ STEP 20: Document for team

   Create runbook documenting:
   - How QR code works
   - How to troubleshoot issues
   - How to regenerate QR
   - How to view payment history
   - Contact info for issues
*/

// ================================================================
// VERIFICATION CHECKLIST
// ================================================================

/**
After completing all steps, verify:

✅ FILES & LOCATIONS
[ ] src/services/PhonePeService.js exists
[ ] src/controllers/phonepeController.js exists
[ ] src/routes/phonepe.js exists
[ ] src/utils/logger.js exists

✅ CODE CHANGES
[ ] src/index.js: Added phonepeRoutes import
[ ] src/index.js: Added phonepeRoutes to app.use()
[ ] src/routes/loans.js: Updated loan creation with PhonePe QR
[ ] src/models/Loan.js: Has phonepe_qr_data field
[ ] src/models/EmiSchedule.js: Has payment fields
[ ] src/models/Transaction.js: Has PhonePe fields

✅ ENVIRONMENT
[ ] .env has PHONEPE_MERCHANT_ID
[ ] .env has PHONEPE_CLIENT_ID
[ ] .env has PHONEPE_CLIENT_SECRET
[ ] .env has PHONEPE_SALT_KEY
[ ] .env has PHONEPE_SALT_INDEX

✅ SERVER
[ ] npm start runs without errors
[ ] Server starts successfully
[ ] PhonePe config validates or warns appropriately
[ ] Routes registered (/api/phonepe/*)

✅ FUNCTIONALITY
[ ] Can create loan with phonepe_qr_data in response
[ ] QR code generated (either real or mock)
[ ] Webhook endpoint responds (HTTP 200)
[ ] Status check endpoint accessible
[ ] Logs show no PhonePe errors

✅ TESTING
[ ] Created test loan
[ ] Received phonepe_qr_data
[ ] QR image URL valid
[ ] Webhook test sends 200 OK
[ ] No errors in logs
[ ] Database updated correctly

If all green → Ready for production!
*/

// ================================================================
// TROUBLESHOOTING
// ================================================================

/**
❌ ERROR: "Cannot find module './routes/phonepe'"
✅ FIX: Verify file exists at src/routes/phonepe.js
      Check filename exactly matches (case-sensitive)

❌ ERROR: "PhonePe OAuth failed"
✅ FIX: Check PHONEPE_CLIENT_ID in .env
      Check PHONEPE_CLIENT_SECRET in .env
      Verify credentials are correct from dashboard

❌ ERROR: "PhonePe QR generation failed"
✅ FIX: Check PHONEPE_MERCHANT_ID is correct
      Verify PHONEPE_ENV matches credentials (sandbox or prod)
      Check OAuth token generation works

❌ ERROR: "phonepe_qr_data is null" in loan response
✅ FIX: Check console logs for QR generation errors
      Verify PhonePe service is being called
      Check credentials are valid

❌ ERROR: "Cannot read property 'createStaticQR' of undefined"
✅ FIX: Check PhonePeService is imported in loans.js
      Verify file path is correct: '../services/PhonePeService'

❌ ERROR: "Webhook signature validation failed"
✅ FIX: Check PHONEPE_SALT_KEY is exactly correct
      Copy/paste from dashboard carefully (include special chars)
      Verify PHONEPE_SALT_INDEX matches (usually '1')

❌ ERROR: "Loan creation fails after adding PhonePe code"
✅ FIX: Check error in console logs
      Verify PhonePeService.createStaticQR doesn't throw
      Make sure try/catch is correct
      Check loan is created even if QR fails
      Regenerate QR manually via API endpoint
*/

// ================================================================
// QUICK COMMANDS
// ================================================================

/**
Restart server:
$ npm start

View logs in real-time:
$ tail -f logs/app.log

Test webhook locally:
$ curl -X POST http://localhost:4000/api/phonepe/webhook \
    -H "Content-Type: application/json" \
    -H "X-VERIFY: test" \
    -d '{"data":{"merchantTransactionId":"123"}}'

Create test loan (assuming you have token and customer ID):
$ curl -X POST http://localhost:4000/api/loans \
    -H "Authorization: Bearer YOUR_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
      "loan_code": "TEST-001",
      "customer_id": "CUSTOMER_ID",
      "principal_amount": 50000,
      "installment_amount": 5000,
      "interest_rate": 12,
      "interest_type": "flat",
      "tenure_months": 12,
      "loan_type": "monthly",
      "start_date": "2024-03-02",
      "first_emi_date": "2024-04-01",
      "emi_day_of_month": 1
    }'

View PhonePe transactions:
$ mongo
  > use mitelectroworld
  > db.transactions.find({status: "SUCCESS"})

Check EMI status:
$ mongo
  > use mitelectroworld
  > db.emischedules.find({loan_id: ObjectId("...")})
*/

// ================================================================
// SUCCESS INDICATORS
// ================================================================

/**
✅ You'll know integration is working when:

1. Loan creation includes phonepe_qr_data
   Response includes:
   {
     "phonepe_qr_data": {
       "qrId": "...",
       "imageUrl": "...",
       "qrString": "upi://pay?..."
     }
   }

2. Webhook endpoint is accessible
   curl -X POST /api/phonepe/webhook → Returns 200 OK

3. Server logs show PhonePe initialization
   Console shows: "✅ PhonePe configuration validated"
   Or: "⚠️ PhonePe configuration incomplete" (if .env missing)

4. No module errors
   No "Cannot find module" errors
   No "PhonePeService is not defined" errors

5. Database has transaction records
   After payment, transactions table has entries with:
   phonepe_merchant_transaction_id: (loanId)
   status: "SUCCESS"
   verified: true

6. EMI auto-updated
   EmiSchedule table shows:
   status: "paid"
   paid_date: (current date)
   phonepe_transaction_id: (transaction Id)

When all these work → Integration is complete! ✅
*/

// ================================================================
// NEXT STEPS
// ================================================================

/**
After integration is working:

1. CONFIGURE SETTINGS
   - Set proper PhonePe environment (sandbox/prod)
   - Configure timeout values if needed
   - Set up error notifications

2. TRAIN TEAM
   - Admin: How to view QR codes
   - Admin: How to regenerate QR if needed
   - Support: How to handle payment issues
   - Support: How to view payment history

3. CUSTOMER COMMUNICATION
   - Explain QR payment process
   - How to scan and pay
   - What to do if payment fails
   - How to get receipt

4. MONITORING
   - Set up alerts for failed webhooks
   - Monitor payment success rate
   - Track average processing time
   - Monitor database size

5. DOCUMENTATION
   - Document payment flow
   - Create FAQ for customers
   - Document troubleshooting steps
   - Maintain audit logs

6. FUTURE ENHANCEMENTS
   - Refund handling
   - Recurring AutoPay setup
   - Payment reminders
   - SMS notifications
   - Receipt generation
*/

module.exports = {
    implementation_checklist: true,
    total_steps: 20,
    estimated_time_minutes: 25,
    difficulty: "Easy",
    prerequisites: [
        "PhonePe merchant account",
        "Node.js backend running",
        "MongoDB database",
        "Valid customers in system"
    ]
};
