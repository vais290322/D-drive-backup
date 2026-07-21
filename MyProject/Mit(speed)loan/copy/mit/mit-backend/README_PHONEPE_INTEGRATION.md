# PhonePe Payment Gateway Integration for EMI Auto-Collection

## 🎯 What This Integration Does

Enables **automatic EMI payment collection** using PhonePe Static QR codes:

1. **Admin creates loan** → Unique static QR generated automatically
2. **Admin sends QR to customer** → Via SMS/WhatsApp/Email
3. **Customer scans QR** → With any UPI app (PhonePe, Google Pay, Paytm, etc.)
4. **EMI amount auto-fills** → Fixed amount every month
5. **Payment completes** → Money goes to your merchant account
6. **EMI updates automatically** → Backend verifies and marks paid
7. **Repeat monthly** → Same QR works until loan is completed

---

## 📦 Files Created For You

### New Files Created:

1. **src/services/PhonePeService.js** - Core PhonePe integration
   - OAuth token generation with caching
   - Static QR code creation
   - Payment status verification
   - Webhook signature validation
   - Comprehensive error handling

2. **src/controllers/phonepeController.js** - Webhook & payment logic
   - Handle PhonePe webhook notifications
   - Auto-update EMI status
   - Prevent duplicate processing (idempotency)
   - Check payment status endpoint
   - Regenerate QR codes
   - Payment history retrieval

3. **src/routes/phonepe.js** - API endpoints
   - POST /api/phonepe/webhook (PhonePe calls this)
   - GET /api/phonepe/status/:transactionId (Check payment status)
   - POST /api/phonepe/qr/regenerate/:loanId (Admin regenerates QR)
   - GET /api/phonepe/history/:loanId (View payment history)

4. **src/utils/logger.js** - Logging utility
   - Production-safe logging
   - Structured log format
   - Helps debugging issues

### Models Updated:

5. **src/models/Loan.js** - Added PhonePe QR fields
6. **src/models/EmiSchedule.js** - Added payment tracking fields
7. **src/models/Transaction.js** - Enhanced with PhonePe fields

### Documentation Files:

- **PHONEPE_QUICK_START.js** - 5-minute quick start
- **PHONEPE_INTEGRATION_GUIDE.js** - Detailed integration guide
- **INDEX_JS_ADDITIONS.js** - Exact code to add to index.js
- **README.md** - This file

---

## 🚀 Quick Start (5 Minutes)

### Step 1: Add Environment Variables

```bash
# .env file
PHONEPE_MERCHANT_ID=your_merchant_id
PHONEPE_CLIENT_ID=M2385SCD6K40A_xxxx
PHONEPE_CLIENT_SECRET=your_client_secret
PHONEPE_SALT_KEY=your_salt_key
PHONEPE_SALT_INDEX=1
PHONEPE_ENV=sandbox
BASE_URL=https://yourapi.com
```

### Step 2: Register Routes in src/index.js

Add import:

```javascript
const phonepeRoutes = require("./routes/phonepe");
```

Register route:

```javascript
app.use("/api/phonepe", phonepeRoutes);
```

### Step 3: Update Loan Creation (src/routes/loans.js)

In POST /api/loans route, add PhonePe QR generation:

```javascript
// After creating loan...
const loan = await Loan.create(data);

// Generate PhonePe Static QR
try {
  const PhonePeService = require("../services/PhonePeService");

  const qrData = await PhonePeService.createStaticQR(
    loan._id.toString(),
    loan.loan_code,
    loan.installment_amount,
  );

  loan.phonepe_qr_data = qrData;
  await loan.save();
} catch (error) {
  console.warn("PhonePe QR generation failed:", error.message);
  // Don't fail loan creation - user can regenerate later
}
```

### Step 4: Test

```bash
npm start
```

Restart server and create a new loan - should include phonepe_qr_data in response!

---

## 🔄 Payment Flow

```
┌─────────────────────────────────────────────────────────┐
│ 1. LOAN CREATION                                        │
│ POST /api/loans                                         │
│ ┌──────────────────────────────────────────────────┐   │
│ │ • Loan created                                   │   │
│ │ • PhonePe QR generated automatically             │   │
│ │ • QR stored in loan.phonepe_qr_data              │   │
│ └──────────────────────────────────────────────────┘   │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ 2. ADMIN SENDS QR TO CUSTOMER                           │
│ • Share QR image/link                                   │
│ • Send via SMS/WhatsApp/Email/Print                     │
│ • Amount auto-filled (fixed EMI)                        │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ 3. CUSTOMER PAYS                                        │
│ • Opens ANY UPI app (PhonePe, Google Pay, Paytm)        │
│ • Scans QR                                              │
│ • Amount auto-fills                                     │
│ • Completes payment with PIN                            │
│ • Money goes to merchant account                        │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ 4. WEBHOOK NOTIFICATION                                 │
│ POST /api/phonepe/webhook (PhonePe calls this)          │
│ ┌──────────────────────────────────────────────────┐   │
│ │ • Validate signature (X-VERIFY)                  │   │
│ │ • Verify payment with PhonePe API                │   │
│ │ • Check for duplicates (idempotency)             │   │
│ │ • Find next pending EMI                          │   │
│ │ • Mark EMI as PAID                               │   │
│ │ • Store transaction record                       │   │
│ │ • Return 200 OK to PhonePe                       │   │
│ └──────────────────────────────────────────────────┘   │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ 5. DATABASE UPDATED                                     │
│ • EmiSchedule: status = "paid"                          │
│ • Transaction: recorded with verification               │
│ • Next EMI: still pending (ready for next month)        │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ 6. NEXT MONTH - REPEAT                                  │
│ • Same QR works (static, multiple-use)                  │
│ • Customer scans again                                  │
│ • Next EMI gets marked paid                             │
│ • Process repeats until loan completed                  │
└─────────────────────────────────────────────────────────┘
```

---

## 📋 API Endpoints

### 1. Webhook (PhonePe → Your Server)

```
POST /api/phonepe/webhook

NO AUTHENTICATION REQUIRED
(PhonePe can't provide bearer token)

Security: X-VERIFY signature validated

Response: 200 OK (always, even on error)
```

### 2. Check Payment Status

```
GET /api/phonepe/status/{merchantTransactionId}

NO AUTHENTICATION REQUIRED

Returns:
{
  success: true,
  message: "Payment successful",
  transaction: {
    id: "...",
    amount: 5000,
    emi_paid: 1,
    verified_at: "2024-03-02T10:30:00Z"
  }
}
```

### 3. Regenerate QR (Admin)

```
POST /api/phonepe/qr/regenerate/{loanId}

REQUIRES: Authorization header
REQUIRES: Admin role

Returns:
{
  success: true,
  qr: {
    qrId: "...",
    imageUrl: "...",
    qrString: "..."
  }
}
```

### 4. Get Payment History

```
GET /api/phonepe/history/{loanId}

REQUIRES: Authorization header

Returns:
{
  loan: { code, amount, emi, status },
  transactions: [ ... ],
  schedule: [ ... ]
}
```

---

## 🔒 Security Features

✅ **OAuth Token Caching** - Tokens cached 25 minutes, auto-refresh
✅ **Webhook Signature Validation** - X-VERIFY header checked with SHA256
✅ **Double Payment Verification** - PhonePe API called after webhook
✅ **Idempotency Checking** - Prevents duplicate EMI updates
✅ **Transaction Logging** - Complete audit trail
✅ **Error Handling** - Comprehensive, never fails silently
✅ **Rate Limiting** (optional) - Can add if needed

---

## 🧪 Testing

### Development Mode

```javascript
// In .env
PHONEPE_ENV = sandbox;
```

Will use mock QR codes for testing without real API.

### Manual Testing with Mock

```bash
# Create loan
curl -X POST http://localhost:4000/api/loans \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{ "loan_code": "TEST-001", ... }'

# Test webhook (local)
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
```

### Real Testing

1. Use PhonePe sandbox credentials
2. Register webhook in PhonePe dashboard
3. Create test loan
4. Scan QR with real UPI app
5. Complete payment
6. Check webhook logs
7. Verify EMI updated

---

## 🐛 Debugging

### Check Logs

```
✅ PhonePe configuration validated
🔐 Requesting PhonePe OAuth token...
📱 Creating Static QR for Loan: LOAN-001
✅ PhonePe OAuth token generated successfully
✅ Static QR created for Loan: LOAN-001

[webhook_id] Webhook signature verified
📨 [webhook_id] Processing payment: ...
✅ [webhook_id] Payment verified with PhonePe API
📋 [webhook_id] Next EMI #1: ...
✅ [webhook_id] EMI #1 marked as PAID
✅ [webhook_id] Transaction recorded
```

### Common Issues

**Issue:** PhonePe QR generation fails
**Solution:** Check credentials in .env, verify OAuth works

**Issue:** Webhook not received
**Solution:** Check webhook URL in PhonePe dashboard, ensure publicly accessible

**Issue:** EMI not updating
**Solution:** Check webhook signature validation, verify payment status

**Issue:** Signature validation fails
**Solution:** Verify PHONEPE_SALT_KEY is exactly correct (copy/paste carefully)

---

## 📊 Database Schema Changes

### Loan Model

```javascript
phonepe_qr_data: {
  qrId: String,
  qrString: String,
  url: String,
  merchantTransactionId: String,
  imageUrl: String
}
```

### EmiSchedule Model

```javascript
phonepe_transaction_id: String,
payment_method: String,  // 'phonepe', 'cash', etc.
```

### Transaction Model

```javascript
phonepe_merchant_transaction_id: String,
phonepe_transaction_id: String,
phonepe_utr: String,
verified: Boolean,
webhook_id: String,
webhook_data: Object,
emi_updated: {
  emi_id: ObjectId,
  emi_number: Number,
  previous_status: String,
  new_status: String
}
```

---

## 🚢 Production Checklist

- [ ] PhonePe credentials in .env
- [ ] PHONEPE_ENV set to "production"
- [ ] BASE_URL set to production domain
- [ ] Webhook URL registered in PhonePe dashboard
- [ ] HTTPS enabled for all endpoints
- [ ] Error logging/alerting configured
- [ ] Database backups enabled
- [ ] Tested webhook signature validation
- [ ] Tested duplicate webhook handling
- [ ] Tested overpayment (multiple EMIs)
- [ ] Tested partial payment
- [ ] User documentation ready
- [ ] Support team trained

---

## 📞 Support

### PhonePe Documentation

https://developer.phonepe.com/

### Your Integration Files

1. `PHONEPE_QUICK_START.js` - 5-minute start
2. `PHONEPE_INTEGRATION_GUIDE.js` - Detailed guide
3. `INDEX_JS_ADDITIONS.js` - Code snippets
4. `README.md` - This file

### Common Questions

**Q: Will the QR expire?**
A: No, static QRs work indefinitely until loan is completed.

**Q: Can customer use different UPI apps?**
A: Yes, any UPI app works (PhonePe, Google Pay, Paytm, etc.).

**Q: What if customer pays partial amount?**
A: EMI marked as "partial", next EMI won't unlock.

**Q: What if customer pays multiple EMIs at once?**
A: System handles overpayment - updates multiple EMIs.

**Q: What if webhook arrives twice?**
A: Idempotency check prevents duplicate EMI updates.

**Q: How to regenerate QR?**
A: Call POST /api/phonepe/qr/regenerate/{loanId}

**Q: Can admin manually mark EMI paid?**
A: Yes, existing system allows manual payment entry too.

---

## 📈 Monitoring

### Key Metrics to Monitor

1. **Webhook Success Rate** - Should be 100%
2. **Payment Verification Rate** - Should be 100%
3. **EMI Update Rate** - Should match payment rate
4. **Average Processing Time** - Should be <1 second
5. **Error Rate** - Should be 0% in production

### Logs to Check

```
# Daily
- Check webhook processing times
- Monitor for signature validation failures
- Track payment success/failure rates

# Weekly
- Review transaction records
- Check for stuck EMIs
- Monitor database size growth

# Monthly
- Audit all payments
- Review failed transactions
- Analyze customer payment patterns
```

---

## 🎓 Understanding the Code

### PhonePeService.js

- **getAccessToken()** - Gets OAuth token (cached 25 min)
- **createStaticQR()** - Creates unique QR for loan
- **checkPaymentStatus()** - Verifies payment with PhonePe API
- **verifyWebhookSignature()** - Validates X-VERIFY header
- **parseWebhookData()** - Extracts payment info from webhook

### PhonePeController.js

- **handlePhonePeWebhook()** - Main webhook handler
- **updateNextUnpaidEMI()** - Auto-updates EMI status
- **checkPaymentStatus()** - Frontend polling endpoint
- **regenerateStaticQR()** - Admin regenerates QR
- **getLoanPaymentHistory()** - Views payment history

### PhonePe Routes

- Webhook endpoint (no auth)
- Status check endpoint (no auth)
- Regenerate QR (auth required)
- Payment history (auth required)

---

## 🔄 Advanced Features (Future)

- Refund handling
- Partial refunds
- Payment reversals
- Recurring autopay (UPI Collect)
- Dispute resolution
- Payment receipts
- SMS/Email notifications

These can be added later as needed.

---

## 📝 Notes

- QR codes are **static** (not dynamic)
- EMI amount is **fixed** (doesn't change month to month)
- QR works **multiple times** until loan complete
- No **customer redirection** needed
- Works with **any UPI app**
- **Secure** with signature validation
- **Production-ready** with error handling

---

## 🎉 You're All Set!

Your PhonePe integration is ready. Follow the Quick Start steps above to get started in just 5 minutes.

For detailed explanations, check the integration guide documents.

Happy collecting! 💰
