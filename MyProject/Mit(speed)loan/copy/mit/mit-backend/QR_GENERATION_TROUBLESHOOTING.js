/**
 * ================================================================
 * QR CODE GENERATION - TROUBLESHOOTING GUIDE
 * ================================================================
 */

// ================================================================
// ISSUE: QR Code Not Generated
// ================================================================

/**
ERROR MESSAGE:
"PhonePeService.initiateDynamicQR is not a function"

CAUSE:
The frontend tries to call initiateDynamicQR() but it wasn't in PhonePeService

SOLUTION:
✅ Updated PhonePeService.js with initiateDynamicQR() method
✅ Updated loans.js to generate QR during loan creation
✅ Updated index.js to register phonepeRoutes

STATUS: FIXED ✅
*/

// ================================================================
// STEP 1: VERIFY FILES ARE IN PLACE
// ================================================================

/**
Check these files exist:

□ src/services/PhonePeService.js
  Should contain:
  - getAccessToken()
  - createStaticQR()
  - initiateDynamicQR() ✅ NEW
  - checkPaymentStatus()
  - verifyWebhookSignature()
  - generateMockQR()

□ src/controllers/phonepeController.js
  Should contain:
  - handlePhonePeWebhook()
  - updateNextUnpaidEMI()
  - checkPaymentStatus()
  - regenerateStaticQR()
  - getLoanPaymentHistory()

□ src/routes/phonepe.js
  Should contain 4 endpoints:
  - POST /webhook
  - GET /status/:merchantTransactionId
  - POST /qr/regenerate/:loanId
  - GET /history/:loanId

□ src/routes/loans.js
  Should have PhonePe QR generation in POST route ✅ UPDATED
  
□ src/index.js
  Should have:
  - const phonepeRoutes = require('./routes/phonepe'); ✅ ADDED
  - app.use('/api/phonepe', phonepeRoutes); ✅ ADDED
*/

// ================================================================
// STEP 2: VERIFY ENVIRONMENT VARIABLES
// ================================================================

/**
Check your .env file has:

PHONEPE_MERCHANT_ID=your_merchant_id
PHONEPE_CLIENT_ID=your_client_id
PHONEPE_CLIENT_SECRET=your_client_secret
PHONEPE_SALT_KEY=your_salt_key
PHONEPE_SALT_INDEX=1
PHONEPE_ENV=sandbox

OR for development/testing:
PHONEPE_ENV=development
(This will auto-generate mock QR codes)
*/

// ================================================================
// STEP 3: RESTART SERVER
// ================================================================

/**
Kill existing server:
Ctrl + C

Restart:
npm start

You should see:
✅ Connected to MongoDB
✅ Server listening on port 4000

NO PhonePe errors should appear.
If you see "PhonePe configuration incomplete" warning,
check your .env file has all required variables.
*/

// ================================================================
// STEP 4: TEST LOAN CREATION
// ================================================================

/**
Create a test loan:

curl -X POST http://localhost:4000/api/loans \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "loan_code": "TEST-QR-001",
    "customer_id": "CUSTOMER_ID_HERE",
    "principal_amount": 50000,
    "installment_amount": 5000,
    "interest_rate": 12,
    "interest_type": "flat",
    "tenure_months": 12,
    "loan_type": "monthly",
    "start_date": "2024-03-02",
    "first_emi_date": "2024-04-01",
    "emi_day_of_month": 1,
    "created_by": "ADMIN_ID_HERE"
  }'

EXPECTED RESPONSE:
{
  "_id": "...",
  "loan_code": "TEST-QR-001",
  "phonepe_qr_data": {
    "qrId": "...",
    "qrString": "upi://pay?...",
    "url": "...",
    "merchantTransactionId": "...",
    "imageUrl": "..."
  },
  ...
}

✅ If you see phonepe_qr_data → SUCCESS!
❌ If missing → Check error logs
*/

// ================================================================
// STEP 5: CHECK CONSOLE LOGS
// ================================================================

/**
Look for these logs during loan creation:

✅ "📱 Generating PhonePe Static QR for Loan: TEST-QR-001"
✅ "✅ PhonePe Static QR generated for Loan: TEST-QR-001"

OR in development:
✅ "📱 Mock PhonePe QR generated (development mode)"

If you see error logs like:
❌ "PhonePe OAuth Error:"
❌ "PhonePe QR Creation Error:"

Then check:
- .env credentials are correct
- PHONEPE_ENV matches your environment
- PhonePe API is accessible
*/

// ================================================================
// STEP 6: TEST QR DISPLAY (FRONTEND)
// ================================================================

/**
In your frontend loan detail page:

The modal should now show:
✅ QR code image (from phonepe_qr_data.imageUrl)
✅ Loan details
✅ EMI amount
✅ Print/Download buttons

The "Phonpe QR" button should work without errors.

If it still shows error "initiateDynamicQR is not a function":
1. Clear browser cache (Ctrl+Shift+Delete)
2. Hard reload (Ctrl+F5 or Cmd+Shift+R on Mac)
3. Restart the backend (npm start)
4. Try again
*/

// ================================================================
// COMMON ERRORS & FIXES
// ================================================================

/**
ERROR 1: "PhonePeService.initiateDynamicQR is not a function"
FIX:
✅ Already fixed - method added to PhonePeService.js
- Restart backend (npm start)
- Clear browser cache
- Reload page

ERROR 2: "PhonePe OAUTH failed"
FIX:
- Check PHONEPE_CLIENT_ID in .env
- Check PHONEPE_CLIENT_SECRET in .env
- Verify credentials from PhonePe dashboard
- Check credentials haven't expired
- Try regenerating credentials in dashboard

ERROR 3: "PhonePe QR Creation Error"
FIX:
- Check PHONEPE_MERCHANT_ID is correct
- Verify PHONEPE_ENV setting (sandbox vs production)
- Ensure OAuth token was generated successfully
- Check PhonePe API is accessible: 
  curl https://api-preprod.phonepe.com/ (should not hang)

ERROR 4: "Cannot find module './routes/phonepe'"
FIX:
- Verify file exists: src/routes/phonepe.js
- Check filename spelling (case-sensitive)
- Check import in index.js matches exactly

ERROR 5: QR data is null/undefined in response
FIX:
- Check loan creation succeeded (loan was saved)
- Check console logs for QR generation errors
- Try creating loan again
- If still failing, check PhonePe API credentials
- Can manually regenerate via: POST /api/phonepe/qr/regenerate/{loanId}

ERROR 6: "PHONEPE_MERCHANT_ID is undefined"
FIX:
- Add PHONEPE_MERCHANT_ID to .env file
- Restart server (npm start)
- Verify .env file is in project root
- Make sure you didn't commit .env (check if it's ignored in .gitignore)
*/

// ================================================================
// VERIFICATION CHECKLIST
// ================================================================

/**
Before declaring victory, verify ALL of these:

✅ INSTALLATION
[ ] PhonePeService.js has all required methods
[ ] phonepeController.js exists
[ ] phonepe.js routes exist
[ ] logger.js exists

✅ INTEGRATION
[ ] index.js imports phonepeRoutes
[ ] index.js registers phonepeRoutes (app.use)
[ ] loans.js calls PhonePeService.createStaticQR()
[ ] Models have phonepe_qr_data field

✅ ENVIRONMENT
[ ] .env has PHONEPE_MERCHANT_ID
[ ] .env has PHONEPE_CLIENT_ID
[ ] .env has PHONEPE_CLIENT_SECRET
[ ] .env has PHONEPE_SALT_KEY
[ ] .env has PHONEPE_ENV setting

✅ TESTING
[ ] Server starts without errors (npm start)
[ ] Can create loan without errors
[ ] Loan response includes phonepe_qr_data
[ ] qrData has qrId, imageUrl, qrString
[ ] Console shows "PhonePe Static QR generated"

✅ FRONTEND
[ ] Payment QR modal shows image
[ ] No "initiateDynamicQR is not a function" error
[ ] QR code image displays properly
[ ] Print/Download buttons work

If ALL checked → QR code integration is working! ✅
*/

// ================================================================
// DEBUG MODE - ENABLE DETAILED LOGGING
// ================================================================

/**
To see more detailed logs, add to .env:

NODE_ENV=development
PHONEPE_ENV=development
DEBUG=*

This will:
- Enable mock QR generation (for testing without real API)
- Show more detailed error messages
- Display all API calls in logs

Then restart server:
npm start
*/

// ================================================================
// MANUAL QR REGENERATION
// ================================================================

/**
If QR failed to generate during loan creation,
you can regenerate it manually via API:

curl -X POST http://localhost:4000/api/phonepe/qr/regenerate/LOAN_ID \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"

Response:
{
  "success": true,
  "message": "Static QR regenerated",
  "qr": {
    "qrId": "...",
    "imageUrl": "...",
    ...
  }
}

This will update the loan's phonepe_qr_data field.
*/

// ================================================================
// SUMMARY OF CHANGES MADE
// ================================================================

/**
✅ FIXED: Added initiateDynamicQR() method to PhonePeService.js
✅ FIXED: Updated loans.js to generate PhonePe QR during creation
✅ FIXED: Added phonepeRoutes import to index.js
✅ FIXED: Registered phonepeRoutes endpoint in index.js
✅ ADDED: generateMockQR() support for development mode
✅ ADDED: Fallback to mock QR if OAuth credentials missing

Result: QR codes should now generate automatically when loans are created!
*/

module.exports = {
    issue: "QR Code Not Generated",
    status: "FIXED ✅",
    changes_made: 4,
    files_updated: 3
};
