/**
 * ================================================================
 * PHONEPE INTEGRATION GUIDE
 * Complete step-by-step instructions for integrating into your system
 * ================================================================
 */

// ============================================================
// STEP 1: ADD ENVIRONMENT VARIABLES TO .env
// ============================================================

/**
Add these to your .env file:

# PhonePe Configuration
PHONEPE_MERCHANT_ID=your_merchant_id_here
PHONEPE_CLIENT_ID=your_client_id_here
PHONEPE_CLIENT_SECRET=your_client_secret_here
PHONEPE_SALT_KEY=your_salt_key_here
PHONEPE_SALT_INDEX=1

# sandbox or production
PHONEPE_ENV=sandbox

# Your webhook URL (PhonePe will POST here)
PHONEPE_WEBHOOK_URL=https://yourapi.com/api/phonepe/webhook

# Base URL for your application (for generating QR payment links)
BASE_URL=https://yourapi.com
*/

// ============================================================
// STEP 2: ADD PHONEPE ROUTES TO src/index.js
// ============================================================

/**
In src/index.js, add this line with other route imports:

const phonepeRoutes = require('./routes/phonepe');

And then add this line with other route usage:

app.use('/api/phonepe', phonepeRoutes);

FULL CODE EXAMPLE:
*/

const phonepeRoutes = require('./routes/phonepe');
// ... other imports ...

// ... after other routes ...
app.use('/api/phonepe', phonepeRoutes);

/**
END OF STEP 2
*/

// ============================================================
// STEP 3: MODIFY LOAN CREATION IN src/routes/loans.js
// ============================================================

/**
In the POST /api/loans route (create loan), add PhonePe QR generation.

Find this section:
  // 3. Generate Static QR Token & URL
  const qrToken = crypto.randomBytes(16).toString('hex');
  data.qr_token = qrToken;

  const paymentUrl = `${process.env.BASE_URL}/api/payments/pay/q/${qrToken}`;
  try {
    data.qr_code_url = await QRCode.toDataURL(paymentUrl);
  } catch (qrErr) {
    console.error('Failed to generate static QR code image:', qrErr);
  }

REPLACE IT WITH:
*/

// 3. Create Loan First (without QR)
const loan = await Loan.create(data);

// 4. Generate PhonePe Static QR (AFTER loan is created)
try {
    const PhonePeService = require('../services/PhonePeService');

    console.log(`📱 Generating PhonePe Static QR for Loan: ${loan.loan_code}`);

    const qrData = await PhonePeService.createStaticQR(
        loan._id.toString(),      // loanId (used as merchantTransactionId)
        loan.loan_code,            // Human-readable identifier
        loan.installment_amount    // Fixed EMI amount
    );

    // Save QR data to loan
    loan.phonepe_qr_data = qrData;
    await loan.save();

    console.log(`✅ PhonePe Static QR generated for Loan: ${loan.loan_code}`);

} catch (qrError) {
    console.error(`⚠️ PhonePe QR generation failed:`, qrError.message);
    // OPTIONAL: Use fallback plain QR or mock QR
    // Don't fail the entire loan creation
    // User can regenerate QR later via API

    // For development/testing only:
    if (process.env.NODEPE_ENV === 'development') {
        const mockQR = PhonePeService.generateMockQR(
            loan._id.toString(),
            loan.loan_code,
            loan.installment_amount
        );
        loan.phonepe_qr_data = mockQR;
        await loan.save();
    }
}

/**
FULL MODIFIED LOAN CREATION SECTION:
*/

// Create loan
router.post('/', auth, async (req, res) => {
    try {
        const data = req.body;
        const Product = require('../models/Product');
        const EmiSchedule = require('../models/EmiSchedule');
        const PhonePeService = require('../services/PhonePeService');
        const { generateOrUpdateSchedule } = require('../utils/calculationUtils');

        // 1. Map frontend loan_id to loan_code
        if (data.loan_id) {
            data.loan_code = data.loan_id;
            delete data.loan_id;
        }

        // 2. Validate Product & Status
        if (data.product_id) {
            const product = await Product.findById(data.product_id);
            if (!product) {
                return res.status(400).json({ message: 'Product not found' });
            }
            if (product.status !== 'available') {
                return res.status(400).json({ message: 'Product is not available' });
            }
            await Product.findByIdAndUpdate(data.product_id, { status: 'assigned' });
        }

        // 3. Create Loan
        const loan = await Loan.create(data);

        // 4. Generate PhonePe Static QR ✅ NEW
        try {
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
            console.warn(`⚠️ PhonePe QR generation failed:`, qrError.message);
            // Don't fail entire loan creation - user can regenerate later
        }

        // 5. Generate EMI Schedule
        try {
            const schedule = await generateOrUpdateSchedule(loan, null, []);
            if (schedule.length > 0) {
                await EmiSchedule.insertMany(schedule);
            }

            // Record Down Payment if exists
            if (data.down_payment > 0) {
                const EmiPayment = require('../models/EmiPayment');
                await EmiPayment.create({
                    loan_id: loan._id,
                    payment_date: loan.start_date || new Date(),
                    amount_paid: data.down_payment,
                    payment_mode: data.down_payment_mode || 'cash',
                    remarks: 'Down Payment',
                    collected_by: req.user ? req.user.id : null
                });
            }

        } catch (calcError) {
            console.error('Error generating schedule/payment:', calcError);
        }

        res.status(201).json(loan);

    } catch (err) {
        console.error('Create loan error:', err);
        if (err.code === 11000) {
            return res.status(400).json({ message: 'Loan ID/Code already exists' });
        }
        res.status(500).json({ message: 'Server error: ' + err.message });
    }
});

/**
END OF STEP 3
*/

// ============================================================
// STEP 4: DISPLAY QR CODE TO CUSTOMER
// ============================================================

/**
When customer needs to pay EMI:

Frontend can:
1. GET the loan details: /api/loans/{loanId}
2. Display loan.phonepe_qr_data.imageUrl as QR image
3. Or display loan.phonepe_qr_data.qr_string (generate custom QR in frontend)

Customer scans QR with any UPI app:
- PhonePe, Google Pay, Paytm, etc.
- Amount auto-fills (fixed EMI)
- No redirect needed
- Payment goes to your merchant account
*/

// Example response structure:
const loanWithQR = {
    loan_code: "LOAN-001",
    installment_amount: 5000,
    phonepe_qr_data: {
        qrId: "qr_abc123",
        qrString: "upi://pay?pa=merchant@upi&pn=Mit%20Electro&am=500000&tn=Loan%20LOAN-001",
        url: "https://qr.phonepe.com/abc123",
        imageUrl: "https://api.phonepe.com/qr/image/abc123.png",
        merchantTransactionId: "66a1b2c3d4e5f6g7h8"
    }
};

/**
END OF STEP 4
*/

// ============================================================
// STEP 5: UNDERSTANDING THE WEBHOOK FLOW
// ============================================================

/**
WEBHOOK FLOW:

1. Customer pays via QR → PhonePe processes payment
2. PhonePe sends POST to: /api/phonepe/webhook
3. Your backend:
   a) Validates signature (X-VERIFY header)
   b) Checks payment status with PhonePe API
   c) Finds corresponding EMI
   d) Marks EMI as PAID
   e) Stores transaction record (prevent duplicates)
   f) Returns 200 OK to PhonePe

WEBHOOK PAYLOAD STRUCTURE:
{
  "data": {
    "merchantTransactionId": "66a1b2c3d4e5f6g7h8",  // Same as loanId
    "transactionId": "T123456789",                    // PhonePe's ID
    "amount": 500000,                                 // In paise (5000 rupees)
    "status": "SUCCESS",
    "utr": "312345678901",                           // UPI reference
    "timestamp": "2024-03-02T10:30:00Z",
    "methodType": "UPI"
  }
}

SECURITY FEATURES:
- X-VERIFY signature validated (prevents fake webhooks)
- Payment verified with PhonePe API (double-check)
- Idempotency check (prevents duplicate EMI updates)
- Transaction record prevents webhook replay attacks

*/

// ============================================================
// STEP 6: API ENDPOINTS REFERENCE
// ============================================================

/**
YOUR NEW PHONEPE API ENDPOINTS:

1. Handle Payment (PhonePe Webhook - NO AUTH REQUIRED)
   POST /api/phonepe/webhook
   PhonePe calls this after customer payment
   
2. Check Payment Status (For frontend polling)
   GET /api/phonepe/status/{merchantTransactionId}
   Frontend can call this to check if payment succeeded
   
3. Regenerate QR Code (Admin only)
   POST /api/phonepe/qr/regenerate/{loanId}
   Header: Authorization: Bearer {token}
   
4. Get Payment History
   GET /api/phonepe/history/{loanId}
   Header: Authorization: Bearer {token}

*/

// ============================================================
// STEP 7: TESTING CHECKLIST
// ============================================================

/**
BEFORE GOING TO PRODUCTION:

[ ] PhonePe credentials added to .env
[ ] Routes imported in src/index.js
[ ] Loan creation modified to generate PhonePe QR
[ ] Models updated (Transaction, EmiSchedule, Loan)
[ ] Webhook URL registered in PhonePe dashboard
[ ] Test payment flow:
    - Create loan → QR generated
    - Customer scans QR
    - PhonePe sends webhook
    - EMI marked as PAID
    - Balance updated
[ ] Test duplicate webhook handling
[ ] Test overpayment (paying multiple EMIs)
[ ] Test partial payment
[ ] Verify X-VERIFY signature validation
[ ] Check logs for errors
[ ] Monitor transaction records
[ ] Test refund flow (if needed)

TESTING WITH MOCK DATA:

For development, use:
process.env.PHONEPE_ENV = 'development'

This will:
- Generate mock QR codes
- Allow testing without real PhonePe API

In production:
process.env.NODEPE_ENV = 'sandbox' (for testing)
process.env.PHONEPE_ENV = 'production' (for production)

*/

// ============================================================
// STEP 8: PRODUCTION DEPLOYMENT CHECKLIST
// ============================================================

/**
BEFORE GOING LIVE:

SECURITY:
[ ] Never commit .env file with credentials
[ ] Use environment variables for all secrets
[ ] Verify X-VERIFY signature on all webhooks
[ ] Double-check payment with PhonePe API
[ ] Log all errors for monitoring
[ ] Set up alerts for failed webhooks
[ ] Monitor transaction logs

RELIABILITY:
[ ] Implement retry logic for webhook failures
[ ] Set up database backups
[ ] Monitor webhook processing times
[ ] Log all PhonePe API calls
[ ] Set up error alerting (email/SMS)

MONITORING:
[ ] Log webhook receipts
[ ] Log EMI updates
[ ] Monitor API response times
[ ] Track success/failure rates
[ ] Alert on signature mismatches
[ ] Alert on API errors

COMPLIANCE:
[ ] Document payment flow
[ ] Keep audit logs
[ ] Handle disputes properly
[ ] Store transaction data securely
[ ] Comply with PCI DSS (if applicable)

*/

// ============================================================
// STEP 9: EXAMPLE: FULL PAYMENT FLOW IN CODE
// ============================================================

/**
LOAN CREATION → QR GENERATION → PAYMENT → EMI UPDATE

1. Create Loan:
   POST /api/loans
   {
     "loan_code": "LOAN-001",
     "customer_id": "123",
     "principal_amount": 50000,
     "installment_amount": 5000,
     ...
   }
   
   Response:
   {
     "_id": "66a1b2c3d4e5f6g7h8",
     "loan_code": "LOAN-001",
     "phonepe_qr_data": {
       "qrId": "qr_abc123",
       "imageUrl": "https://..."
     }
   }

2. Display QR to Customer:
   <img src={loan.phonepe_qr_data.imageUrl} />
   OR
   Customer scans: upi://pay?pa=merchant@upi&amount=5000&...

3. Customer Pays (using ANY UPI app):
   - Scans QR
   - Amount auto-fills (5000)
   - Completes payment
   - Money goes to your merchant account

4. PhonePe Sends Webhook:
   POST /api/phonepe/webhook
   {
     "data": {
       "merchantTransactionId": "66a1b2c3d4e5f6g7h8",
       "status": "SUCCESS",
       "amount": 500000,
       ...
     }
   }

5. Your Backend:
   - Validates signature
   - Checks status with PhonePe
   - Finds EMI #1 (status: pending)
   - Updates: EMI #1 (status: paid, paid_date: now)
   - Stores transaction record
   - Returns 200 OK

6. Database State:
   EmiSchedule:
   {
     "_id": "...",
     "emi_number": 1,
     "status": "paid",  // Changed from "pending"
     "paid_date": "2024-03-02T10:30:00Z",
     "phonepe_transaction_id": "T123456789",
     "payment_method": "phonepe"
   }
   
   Transaction:
   {
     "_id": "...",
     "loan_id": "66a1b2c3d4e5f6g7h8",
     "amount": 5000,
     "status": "SUCCESS",
     "phonepe_transaction_id": "T123456789",
     "verified": true,
     "emi_updated": {
       "emi_number": 1,
       "previous_status": "pending",
       "new_status": "paid"
     }
   }

7. Next Webhook/Payment:
   Next time customer pays → EMI #2 is updated
   Works repeatedly until loan is completed

*/

// ============================================================
// STEP 10: EDGE CASE HANDLING
// ============================================================

/**
DIFFERENT PAYMENT SCENARIOS:

1. EXACT PAYMENT (Customer pays exactly one EMI):
   EMI amount: 5000
   Payment received: 5000
   Result: EMI marked as PAID

2. OVERPAYMENT (Customer pays 2 EMIs at once):
   EMI #1: 5000
   EMI #2: 5000
   Payment received: 10000
   Result: EMI #1 and #2 both marked as PAID

3. PARTIAL PAYMENT (Customer pays less than EMI):
   EMI amount: 5000
   Payment received: 3000
   Result: EMI marked as PARTIAL (paid_amount: 3000)
   Next EMI won't unlock until this is fully paid

4. EARLY PAYMENT (Customer pays before due date):
   Result: Same as normal - EMI marked as PAID
   Payment accepted anytime

5. LATE PAYMENT (Customer pays after due date):
   Result: EMI marked as PAID (status changes from overdue)
   System can generate penalty separately

6. DUPLICATE WEBHOOK:
   Same webhook arrives twice (network issue)
   Result: First processes EMI, second is skipped (idempotency key)

7. CUSTOMER PAYS TWICE VIA SAME QR:
   Two scans of same QR, two payments
   Result: First payment → EMI #1 paid
           Second payment → EMI #2 paid
   QR continues to work (static, multiple-use)

*/

// ============================================================
// MANUAL TESTING EXAMPLE
// ============================================================

/**
TEST VIA CURL:

1. Create Loan:
curl -X POST http://localhost:4000/api/loans \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "loan_code": "TEST-001",
    "customer_id": "...",
    "principal_amount": 50000,
    "installment_amount": 5000,
    ...
  }'

2. Check QR:
curl http://localhost:4000/api/loans/{loanId} \
  -H "Authorization: Bearer {token}"
  
Response includes: phonepe_qr_data.imageUrl

3. Simulate Payment (local testing with mock):
curl -X POST http://localhost:4000/api/phonepe/webhook \
  -H "Content-Type: application/json" \
  -H "X-VERIFY: mock_signature" \
  -d '{
    "data": {
      "merchantTransactionId": "{loanId}",
      "transactionId": "T123",
      "amount": 500000,
      "status": "SUCCESS"
    }
  }'

4. Check Payment Status:
curl http://localhost:4000/api/phonepe/status/{loanId}

5. View EMI Status:
curl http://localhost:4000/api/phonepe/history/{loanId} \
  -H "Authorization: Bearer {token}"

*/

// ============================================================
// COMMON ISSUES & FIXES
// ============================================================

/**
ISSUE: PhonePe OAuth token fails
FIX: Check credentials in .env
     Verify PHONEPE_CLIENT_ID and PHONEPE_CLIENT_SECRET
     Ensure credentials haven't expired

ISSUE: QR creation fails
FIX: Verify OAuth token is valid
     Check merchant ID is correct
     Ensure PHONEPE_ENV is set correctly

ISSUE: Webhook not received
FIX: Verify webhook URL is correct in PhonePe dashboard
     Check BASE_URL in .env
     Ensure endpoint is publicly accessible
     Check firewall rules

ISSUE: Signature validation fails
FIX: Verify PHONEPE_SALT_KEY is correct
     Check PHONEPE_SALT_INDEX (usually "1")
     Ensure payload is not modified

ISSUE: EMI not updating
FIX: Check webhook signature validation
     Verify payment status is "SUCCESS"
     Ensure merchantTransactionId matches loan ID
     Check database connection

ISSUE: Duplicate EMI updates
FIX: System has idempotency check built-in
     Verify webhook_id tracking is working
     Check Transaction model has unique index

*/

module.exports = {
    // This file is documentation only
    // Copy/paste relevant code sections into your actual files
};
