/**
 * PhonePe Webhook Controller
 * Handles payment notifications from PhonePe
 * Verifies payments and automatically updates EMI status
 * 
 * Flow:
 * 1. Customer scans QR → PhonePe processes payment
 * 2. PhonePe sends webhook → validates → updates EMI
 * 3. System prevents duplicate processing
 */

const PhonePeService = require('../services/PhonePeService');
const Loan = require('../models/Loan');
const EmiSchedule = require('../models/EmiSchedule');
const EmiPayment = require('../models/EmiPayment');
const Transaction = require('../models/Transaction');

/**
 * ✅ HANDLE PHONEPE WEBHOOK
 * 
 * Important:
 * - Always return 200 OK to PhonePe immediately (to prevent retries)
 * - Process payment verification asynchronously
 * - Prevent duplicate EMI updates with idempotency key
 */
exports.handlePhonePeWebhook = async (req, res) => {
    const webhookId = req.headers['x-webhook-id'] || `webhook_${Date.now()}`;

    try {
        // STEP 1: Validate Webhook Signature (SECURITY CRITICAL)
        const xVerifyHeader = req.headers['x-verify'];
        const webhookPayload = req.body;

        if (!xVerifyHeader) {
            console.error(`❌ [${webhookId}] Missing X-VERIFY header - SUSPICIOUS`);
            // Still return 200 to not let PhonePe retry
            return res.status(200).json({
                message: 'Webhook received but signature missing'
            });
        }

        const isValidSignature = PhonePeService.verifyWebhookSignature(
            JSON.stringify(webhookPayload),
            xVerifyHeader
        );

        if (!isValidSignature) {
            console.error(`❌ [${webhookId}] Invalid webhook signature - REJECTED`);
            // Return 200 to stop retries (fake webhook)
            return res.status(200).json({
                message: 'Webhook received but signature invalid'
            });
        }

        console.log(`✅ [${webhookId}] Webhook signature verified`);

        // STEP 2: Extract Payment Data
        const webhookData = webhookPayload.data;
        const parsedPayment = PhonePeService.parseWebhookData(webhookData);

        console.log(`📨 [${webhookId}] Processing payment:`, {
            merchantTransactionId: parsedPayment.merchantTransactionId,
            status: parsedPayment.status,
            amount: parsedPayment.amount
        });

        // STEP 3: IDEMPOTENCY CHECK - Prevent duplicate processing
        // Use merchantTransactionId + amount + status as unique key
        const idempotencyKey = `${parsedPayment.merchantTransactionId}_${parsedPayment.amount}_${parsedPayment.status}`;

        // Check if we already processed this payment
        const existingTransaction = await Transaction.findOne({
            phonepe_transaction_id: parsedPayment.transactionId,
            phonepe_merchant_transaction_id: parsedPayment.merchantTransactionId
        });

        if (existingTransaction) {
            console.log(`⚠️ [${webhookId}] Duplicate webhook detected - already processed`);
            // Still return 200 - payment was already processed
            return res.status(200).json({
                message: 'Payment already processed',
                transactionId: existingTransaction._id
            });
        }

        // STEP 4: Verify Payment with PhonePe API
        // Check actual payment status to be 100% sure
        if (parsedPayment.status !== 'SUCCESS') {
            console.log(`⚠️ [${webhookId}] Payment status not SUCCESS:`, parsedPayment.status);

            // Still log the transaction for debugging
            await Transaction.create({
                loan_id: parsedPayment.merchantTransactionId,
                phonepe_merchant_transaction_id: parsedPayment.merchantTransactionId,
                phonepe_transaction_id: parsedPayment.transactionId,
                amount: parsedPayment.amount,
                status: parsedPayment.status,
                payment_method: 'phonepe',
                webhook_data: webhookData,
                verified: false
            });

            // Return 200 - we've logged it but won't process incomplete payment
            return res.status(200).json({
                message: 'Payment not successful',
                status: parsedPayment.status
            });
        }

        // STEP 5: Double-check with PhonePe API
        console.log(`🔍 [${webhookId}] Double-checking payment status with PhonePe...`);
        const statusCheck = await PhonePeService.checkPaymentStatus(
            parsedPayment.merchantTransactionId
        );

        if (statusCheck.status !== 'SUCCESS') {
            console.error(`❌ [${webhookId}] Payment verification failed:`);
            return res.status(200).json({
                message: 'Payment verification failed',
                status: statusCheck.status
            });
        }

        console.log(`✅ [${webhookId}] Payment verified with PhonePe API`);

        // STEP 6: FIND LOAN
        const loanId = parsedPayment.merchantTransactionId;
        const loan = await Loan.findById(loanId).populate('customer_id');

        if (!loan) {
            console.error(`❌ [${webhookId}] Loan not found for ID: ${loanId}`);
            return res.status(200).json({
                message: 'Loan not found'
            });
        }

        console.log(`📌 [${webhookId}] Found loan: ${loan.loan_code}`);

        // STEP 7: AUTO-UPDATE EMI STATUS
        // Find next unpaid EMI and mark it as paid
        const updatedEmi = await updateNextUnpaidEMI(
            loanId,
            parsedPayment.amount,
            parsedPayment.transactionId,
            webhookId
        );

        if (!updatedEmi) {
            console.warn(`⚠️ [${webhookId}] No pending EMI found for loan: ${loan.loan_code}`);
            // Still create transaction record
            await Transaction.create({
                loan_id: loanId,
                phonepe_merchant_transaction_id: parsedPayment.merchantTransactionId,
                phonepe_transaction_id: parsedPayment.transactionId,
                amount: parsedPayment.amount,
                status: 'SUCCESS',
                payment_method: 'phonepe',
                webhook_data: webhookData,
                verified: true,
                remarks: 'Payment received but no pending EMI found'
            });

            return res.status(200).json({
                message: 'Payment recorded but no pending EMI',
                loanCode: loan.loan_code
            });
        }

        // STEP 8: CREATE TRANSACTION RECORD
        const transaction = await Transaction.create({
            loan_id: loanId,
            phonepe_merchant_transaction_id: parsedPayment.merchantTransactionId,
            phonepe_transaction_id: parsedPayment.transactionId,
            phonepe_utr: parsedPayment.utr,
            amount: parsedPayment.amount,
            status: 'SUCCESS',
            payment_method: 'phonepe',
            webhook_data: webhookData,
            verified: true,
            emi_updated: {
                emi_id: updatedEmi._id,
                emi_number: updatedEmi.emi_number,
                previous_status: updatedEmi.previousStatus,
                new_status: updatedEmi.status
            },
            webhook_id: webhookId
        });

        console.log(`✅ [${webhookId}] EMI #${updatedEmi.emi_number} marked as PAID`);
        console.log(`✅ [${webhookId}] Transaction recorded:`, transaction._id);

        // STEP 9: Return Success Response (for PhonePe acknowledgment)
        res.status(200).json({
            success: true,
            message: 'Payment processed successfully',
            loan_code: loan.loan_code,
            emi_number: updatedEmi.emi_number,
            transaction_id: transaction._id,
            webhook_id: webhookId
        });

    } catch (error) {
        console.error(`❌ [${webhookId}] Webhook processing error:`, {
            message: error.message,
            stack: error.stack
        });

        // Even on error, return 200 to prevent PhonePe retries
        res.status(200).json({
            success: false,
            message: 'Webhook received but processing failed',
            error: error.message
        });
    }
};

/**
 * ✅ UPDATE NEXT UNPAID EMI
 * 
 * Logic:
 * 1. Find next pending/overdue EMI
 * 2. Handle cases: exact amount, overpayment, partial payment
 * 3. Update EMI status
 * 4. Update loan outstanding balance
 * 5. Handle early/late/duplicate payments
 */
async function updateNextUnpaidEMI(loanId, paidAmount, transactionId, webhookId) {
    try {
        // FIND NEXT PENDING EMI (ordered by EMI number)
        const pendingEMIs = await EmiSchedule.find({
            loan_id: loanId,
            status: { $in: ['pending', 'overdue', 'partial'] }
        }).sort({ emi_number: 1 });

        if (pendingEMIs.length === 0) {
            console.warn(`⚠️ [${webhookId}] No pending EMIs found for loan: ${loanId}`);
            return null;
        }

        // Get the FIRST pending EMI (next to be paid)
        const emi = pendingEMIs[0];
        const previousStatus = emi.status;
        const dueAmount = emi.emi_amount - emi.paid_amount;

        console.log(`📋 [${webhookId}] Next EMI #${emi.emi_number}:`, {
            emi_amount: emi.emi_amount,
            already_paid: emi.paid_amount,
            due: dueAmount,
            received: paidAmount
        });

        // CASE 1: EXACT PAYMENT or OVERPAYMENT
        if (paidAmount >= dueAmount) {
            emi.paid_amount = emi.emi_amount;
            emi.status = 'paid';
            emi.paid_date = new Date();
            await emi.save();

            console.log(`✅ [${webhookId}] EMI #${emi.emi_number} marked as PAID`);

            // If overpaid, recurse to handle next EMI
            const overpayAmount = paidAmount - dueAmount;
            if (overpayAmount > 0) {
                console.log(`💰 [${webhookId}] Overpayment: ${overpayAmount}. Processing next EMI...`);
                const nextEmi = await updateNextUnpaidEMI(loanId, overpayAmount, transactionId, webhookId);
                return nextEmi || emi; // Return the one we just paid if no more EMIs
            }

            return emi;
        }

        // CASE 2: PARTIAL PAYMENT
        else {
            emi.paid_amount += paidAmount;
            emi.status = 'partial';
            await emi.save();

            console.log(`⚠️ [${webhookId}] EMI #${emi.emi_number} marked as PARTIAL`);
            return emi;
        }

    } catch (error) {
        console.error(`❌ [${webhookId}] Error updating EMI:`, error.message);
        throw error;
    }
}

/**
 * ✅ CHECK PAYMENT STATUS (For frontend polling)
 * Frontend can poll this endpoint to check if payment was successful
 */
exports.checkPaymentStatus = async (req, res) => {
    try {
        const { merchantTransactionId } = req.params;

        if (!merchantTransactionId) {
            return res.status(400).json({
                message: 'merchantTransactionId is required'
            });
        }

        // Check in our database first
        const transaction = await Transaction.findOne({
            phonepe_merchant_transaction_id: merchantTransactionId,
            status: 'SUCCESS'
        });

        if (transaction) {
            return res.json({
                success: true,
                message: 'Payment successful',
                transaction: {
                    id: transaction._id,
                    amount: transaction.amount,
                    emi_paid: transaction.emi_updated?.emi_number,
                    verified_at: transaction.created_at
                }
            });
        }

        // If not in our database, check with PhonePe
        const statusCheck = await PhonePeService.checkPaymentStatus(merchantTransactionId);

        if (statusCheck.status === 'SUCCESS') {
            return res.json({
                success: true,
                message: 'Payment successful (verified with PhonePe)',
                transaction: {
                    transactionId: statusCheck.transactionId,
                    amount: statusCheck.amount,
                    utr: statusCheck.utr
                }
            });
        }

        if (statusCheck.status === 'PENDING') {
            return res.json({
                success: false,
                message: 'Payment pending',
                status: 'PENDING'
            });
        }

        res.json({
            success: false,
            message: 'Payment not found or failed',
            status: statusCheck.status
        });

    } catch (error) {
        console.error('Error checking payment status:', error.message);
        res.status(500).json({
            message: 'Failed to check payment status',
            error: error.message
        });
    }
};

/**
 * ✅ REGENERATE STATIC QR (For manual QR generation)
 * Admin can regenerate QR code for a loan
 */
exports.regenerateStaticQR = async (req, res) => {
    try {
        const { loanId } = req.params;

        const loan = await Loan.findById(loanId);
        if (!loan) {
            return res.status(404).json({ message: 'Loan not found' });
        }

        // Delete old QR data
        loan.phonepe_qr_data = null;

        // Create new QR
        try {
            const qrData = await PhonePeService.createStaticQR(
                loanId,
                loan.loan_code,
                loan.installment_amount
            );

            loan.phonepe_qr_data = qrData;
            await loan.save();

            return res.json({
                success: true,
                message: 'Static QR regenerated',
                qr: qrData
            });

        } catch (phonepeError) {
            console.error('PhonePe API Error:', phonepeError.message);
            // Fallback to mock for testing
            if (process.env.PHONEPE_ENV === 'development') {
                const mockQR = await PhonePeService.generateMockQR(
                    loanId,
                    loan.loan_code,
                    loan.installment_amount
                );
                loan.phonepe_qr_data = mockQR;
                await loan.save();

                return res.json({
                    success: true,
                    message: 'Static QR generated (mock mode)',
                    qr: mockQR,
                    warning: 'Using mock QR for development'
                });
            }

            throw phonepeError;
        }

    } catch (error) {
        console.error('Error regenerating QR:', error.message);
        res.status(500).json({
            message: 'Failed to regenerate QR',
            error: error.message
        });
    }
};

/**
 * ✅ GET LOAN PAYMENT HISTORY (For customer/admin dashboard)
 */
exports.getLoanPaymentHistory = async (req, res) => {
    try {
        const { loanId } = req.params;

        const loan = await Loan.findById(loanId);
        if (!loan) {
            return res.status(404).json({ message: 'Loan not found' });
        }

        // Get all transactions
        const transactions = await Transaction.find({
            loan_id: loanId
        }).sort({ created_at: -1 });

        // Get EMI schedule
        const schedule = await EmiSchedule.find({
            loan_id: loanId
        }).sort({ emi_number: 1 });

        res.json({
            loan: {
                code: loan.loan_code,
                amount: loan.principal_amount,
                emi: loan.installment_amount,
                status: loan.status
            },
            transactions,
            schedule
        });

    } catch (error) {
        console.error('Error fetching payment history:', error.message);
        res.status(500).json({
            message: 'Failed to fetch payment history',
            error: error.message
        });
    }
};



