/**
 * ================================================================
 * PHONEPE INTEGRATION - QUICK START (5 MINUTES)
 * ================================================================
 * 
 * FILES CREATED FOR YOU:
 * 1. src/services/PhonePeService.js ✅
 * 2. src/controllers/phonepeController.js ✅
 * 3. src/routes/phonepe.js ✅
 * 4. src/utils/logger.js ✅
 * 
 * MODELS UPDATED:
 * 5. src/models/Loan.js ✅ (phonepe_qr_data field)
 * 6. src/models/EmiSchedule.js ✅ (payment tracking fields)
 * 7. src/models/Transaction.js ✅ (PhonePe transaction fields)
 */

// ================================================================
// STEP 1: UPDATE YOUR .env FILE
// ================================================================

/*
Add these lines to your .env:

PHONEPE_MERCHANT_ID=your_merchant_id
PHONEPE_CLIENT_ID=your_client_id
PHONEPE_CLIENT_SECRET=your_client_secret
PHONEPE_SALT_KEY=your_salt_key
PHONEPE_SALT_INDEX=1
PHONEPE_ENV=sandbox
*/

// ================================================================
// STEP 2: REGISTER PHONEPE ROUTES IN src/index.js
// ================================================================

/*
Find the location where all other routes are imported (around line 10-20).
Add this line:

    const phonepeRoutes = require('./routes/phonepe');

Then find where all other routes are registered (around line 50-60).
Add this line:

    app.use('/api/phonepe', phonepeRoutes);

COMPLETE CODE EXAMPLE:
*/

// AT THE TOP of src/index.js, add with other imports:
// ============================================================
const phonepeRoutes = require('./routes/phonepe');
// ============================================================

// IN THE MIDDLEWARE SECTION, add with other app.use():
// ============================================================
app.use('/api/phonepe', phonepeRoutes);
// ============================================================

// ================================================================
// STEP 3: UPDATE LOAN CREATION IN src/routes/loans.js
// ================================================================

/*
FIND THIS SECTION (around line 70-80 in loans.js):
    // 3. Generate Static QR Token & URL
    const qrToken = crypto.randomBytes(16).toString('hex');
    data.qr_token = qrToken;
    ...

REPLACE WITH:
*/

// ✅ REPLACE THE QR GENERATION SECTION WITH THIS:

// Create Loan
const loan = await Loan.create(data);

// Generate PhonePe Static QR (NEW)
try {
    const PhonePeService = require('../services/PhonePeService');

    const qrData = await PhonePeService.createStaticQR(
        loan._id.toString(),
        loan.loan_code,
        loan.installment_amount
    );

    loan.phonepe_qr_data = qrData;
    await loan.save();

    console.log(`✅ PhonePe QR generated for ${loan.loan_code}`);
} catch (error) {
    console.warn(`⚠️ PhonePe QR failed: ${error.message}`);
    // Don't fail loan creation - user can regenerate later
}

// ================================================================
// STEP 4: VERIFY INSTALLATION
// ================================================================

/*
Check these files exist:
✅ src/services/PhonePeService.js (442 lines)
✅ src/controllers/phonepeController.js (280+ lines)
✅ src/routes/phonepe.js (40+ lines)
✅ src/utils/logger.js (35 lines)

Check these models are updated:
✅ src/models/Loan.js (phonepe_qr_data added)
✅ src/models/EmiSchedule.js (payment tracking fields added)
✅ src/models/Transaction.js (PhonePe fields added)

Check src/index.js has:
✅ const phonepeRoutes = require('./routes/phonepe');
✅ app.use('/api/phonepe', phonepeRoutes);

Check src/routes/loans.js loan creation has:
✅ PhonePe QR generation in POST /api/loans
*/

// ================================================================
// STEP 5: TEST THE INTEGRATION
// ================================================================

/*
1. Restart your server:
   npm start

2. Check logs for errors:
   Should see no errors in console

3. Create a test loan:
   POST /api/loans
   (with authentication header)
   
   Response should include:
   {
     "_id": "...",
     "loan_code": "...",
     "phonepe_qr_data": {
       "qrId": "...",
       "imageUrl": "..."
     }
   }

4. Test webhook (optional, for development):
   Already built-in, no manual testing needed

5. Check EMI auto-update:
   Will happen automatically when customer pays
*/

// ================================================================
// STEP 6: CONFIGURE WEBHOOK IN PHONEPE DASHBOARD
// ================================================================

/*
1. Login to PhonePe merchant dashboard
2. Go to: Settings → Webhooks
3. Add webhook URL:
   https://yourapi.com/api/phonepe/webhook
4. Make sure webhook is ENABLED
5. Test webhook from dashboard
6. Verify X-VERIFY signature validation is enabled
*/

// ================================================================
// API ENDPOINTS NOW AVAILABLE
// ================================================================

/*
POST   /api/phonepe/webhook
       ↳ PhonePe sends payment notifications here
       ↳ NO AUTHENTICATION REQUIRED
       ↳ Returns 200 OK immediately

GET    /api/phonepe/status/{merchantTransactionId}
       ↳ Check if specific payment succeeded
       ↳ Frontend can poll this endpoint
       ↳ NO AUTHENTICATION REQUIRED

POST   /api/phonepe/qr/regenerate/{loanId}
       ↳ Admin regenerates QR for a loan
       ↳ REQUIRES: Authorization header

GET    /api/phonepe/history/{loanId}
       ↳ Get all PhonePe transactions for a loan
       ↳ REQUIRES: Authorization header
*/

// ================================================================
// WORKFLOW FOR CUSTOMERS
// ================================================================

/*
1. Admin creates loan
   → PhonePe QR is generated automatically
   → Stored in loan.phonepe_qr_data.imageUrl

2. Admin sends QR to customer:
   → Show QR image/code to customer
   → Or send via SMS/WhatsApp

3. Customer opens ANY UPI app:
   → PhonePe, Google Pay, Paytm, etc.
   → Scans QR code
   → Amount auto-fills (fixed EMI amount)

4. Customer completes payment:
   → ₹5,000 (or whatever EMI amount) is deducted
   → Money goes to your merchant account

5. Backend receives notification:
   → PhonePe sends webhook
   → Your system verifies payment
   → Finds next pending EMI
   → Marks it as PAID automatically
   → Updates loan balance

6. Repeat for next EMI:
   → Same QR works multiple times
   → Works until loan is completed
   → No customer action needed on your app
*/

// ================================================================
// SECURITY FEATURES BUILT-IN
// ================================================================

/*
✅ OAuth Token Caching
   → Tokens cached for 25 minutes
   → Automatic refresh when expired
   → Prevents unnecessary API calls

✅ Webhook Signature Validation
   → X-VERIFY header checked
   → SHA256 hash verification
   → Prevents fake/injected webhooks

✅ Double Payment Verification
   → PhonePe API called after webhook
   → Verifies payment actually succeeded
   → Extra layer of security

✅ Idempotency Checking
   → Webhook processed only once
   → Duplicate webhooks ignored
   → Uses merchantTransactionId + amount + status

✅ Transaction Logging
   → All payments logged in database
   → Full audit trail
   → Can trace any payment back to customer

✅ Error Handling
   → Comprehensive error messages
   → Graceful degradation
   → Never fails silently
*/

// ================================================================
// MONITORING & DEBUGGING
// ================================================================

/*
Check logs for successful payment:

1. Payment received:
   ✅ [webhook_id] Webhook signature verified
   📨 [webhook_id] Processing payment: ...
   ✅ [webhook_id] Payment verified with PhonePe API

2. EMI updated:
   📋 [webhook_id] Next EMI #1: ...
   ✅ [webhook_id] EMI #1 marked as PAID

3. Transaction recorded:
   ✅ [webhook_id] EMI #1 marked as PAID
   ✅ [webhook_id] Transaction recorded: ...

Check database:
   
4. Transaction collection:
   db.transactions.findOne({ loan_id: "..." })
   Should show: verified: true, status: "SUCCESS"

5. EmiSchedule collection:
   db.emischedules.findOne({ loan_id: "...", emi_number: 1 })
   Should show: status: "paid", paid_date: (timestamp)
*/

// ================================================================
// PRODUCTION CHECKLIST
// ================================================================

/*
BEFORE GOING LIVE:

Environment:
[ ] PhonePe credentials added to .env
[ ] PHONEPE_ENV set to "production" (not sandbox)
[ ] BASE_URL set to production domain
[ ] All routes properly registered

Security:
[ ] Webhook URL registered in PhonePe dashboard
[ ] HTTPS enabled for all endpoints
[ ] .env file never committed to git
[ ] Credentials rotated if ever exposed

Testing:
[ ] Create test loan → QR generates
[ ] Simulate payment → EMI updates
[ ] Test webhook signature validation
[ ] Test duplicate webhook handling
[ ] Verify idempotency works

Monitoring:
[ ] Set up error logging/alerts
[ ] Monitor webhook processing times
[ ] Track success/failure rates
[ ] Monitor database for errors

Documentation:
[ ] Document payment flow
[ ] Keep audit logs
[ ] Train support team on PhonePe integration
[ ] Document how to handle disputes

Compliance:
[ ] Verify PCI-DSS compliance (if needed)
[ ] Audit webhook logging
[ ] Review transaction records regularly
[ ] Ensure data privacy compliance
*/

// ================================================================
// EXAMPLE RESPONSE STRUCTURES
// ================================================================

/*
CREATE LOAN RESPONSE:
{
  "_id": "66a1b2c3d4e5f6g7h8",
  "loan_code": "LOAN-001",
  "loan_type": "monthly",
  "principal_amount": 50000,
  "installment_amount": 5000,
  "tenure_months": 12,
  "status": "active",
  
  "phonepe_qr_data": {
    "qrId": "qr_abc123",
    "qrString": "upi://pay?pa=merchant@upi&...",
    "url": "https://qr.phonepe.com/abc123",
    "merchantTransactionId": "66a1b2c3d4e5f6g7h8",
    "imageUrl": "https://api.phonepe.com/qr/image/abc123.png"
  },
  
  "customer_id": "...",
  "created_at": "2024-03-02T10:00:00Z"
}

WEBHOOK PAYLOAD:
{
  "type": "PAYMENT_SUCCESS",
  "data": {
    "merchantTransactionId": "66a1b2c3d4e5f6g7h8",
    "transactionId": "T123456789",
    "amount": 500000,
    "status": "SUCCESS",
    "utr": "312345678901",
    "timestamp": "2024-03-02T10:30:00Z",
    "methodType": "UPI"
  }
}

CHECK STATUS RESPONSE:
{
  "success": true,
  "message": "Payment successful",
  "transaction": {
    "id": "...",
    "amount": 5000,
    "emi_paid": 1,
    "verified_at": "2024-03-02T10:30:00Z"
  }
}

PAYMENT HISTORY RESPONSE:
{
  "loan": {
    "code": "LOAN-001",
    "amount": 50000,
    "emi": 5000,
    "status": "active"
  },
  
  "transactions": [
    {
      "_id": "...",
      "amount": 5000,
      "status": "SUCCESS",
      "phonepe_transaction_id": "T123",
      "emi_updated": {
        "emi_number": 1,
        "new_status": "paid"
      },
      "created_at": "2024-03-02T10:30:00Z"
    }
  ],
  
  "schedule": [
    {
      "emi_number": 1,
      "emi_amount": 5000,
      "due_date": "2024-04-01",
      "status": "paid",
      "paid_date": "2024-03-02T10:30:00Z"
    },
    {
      "emi_number": 2,
      "emi_amount": 5000,
      "due_date": "2024-05-01",
      "status": "pending",
      "paid_date": null
    }
  ]
}
*/

// ================================================================
// TROUBLESHOOTING
// ================================================================

/*
ERROR: "PhonePe OAuth failed"
SOLUTION:
- Check PHONEPE_CLIENT_ID in .env
- Check PHONEPE_CLIENT_SECRET in .env
- Verify credentials are correct
- Credentials might have expired - regenerate in dashboard

ERROR: "Failed to create QR"
SOLUTION:
- Verify PHONEPE_MERCHANT_ID in .env
- Check loan creation succeeds before QR generation
- Look at full error message in logs
- Try regenerating QR via API endpoint

ERROR: "Webhook signature validation failed"
SOLUTION:
- Check PHONEPE_SALT_KEY in .env (copy exactly)
- Verify PHONEPE_SALT_INDEX is "1"
- Secret key might be wrong - check dashboard
- Ensure webhook payload is not modified

ERROR: "EMI not updating after payment"
SOLUTION:
- Check webhook was received (look in logs)
- Verify signature validation passed
- Check merchantTransactionId matches loan ID
- Ensure payment status is "SUCCESS"
- Check database connection

ERROR: "No pending EMI found"
SOLUTION:
- Loan might be fully paid
- Check EMI schedule status
- Customer might have already cleared all EMIs
- Create new loan or verify loan status

ERROR: "PhonePe webhook never received"
SOLUTION:
- Check webhook URL in PhonePe dashboard
- Ensure BASE_URL in .env is correct
- Verify endpoint is publicly accessible
- Check firewall allows PhonePe IP addresses
- Temporary: Use ngrok or similar for testing
*/

// ================================================================
// SUPPORT & DOCUMENTATION
// ================================================================

/*
PhonePe API Documentation:
https://developer.phonepe.com/

Your Integration Files:
- PHONEPE_INTEGRATION_GUIDE.js (detailed guide)
- PHONEPE_QUICK_START.js (this file)

For Questions:
1. Check error logs first
2. Review PhonePe official documentation
3. Check transaction records in database
4. Verify all environment variables

Contact:
- PhonePe Support: support@phonepe.io
- Your IT Team: [contact info]
*/

module.exports = {
    // This file is for reference/documentation
    // No code exports needed
};
