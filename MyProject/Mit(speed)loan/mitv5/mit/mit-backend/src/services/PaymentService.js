const Razorpay = require('razorpay');
const crypto = require('crypto');
const QRCode = require('qrcode');
const Transaction = require('../models/Transaction');
const Loan = require('../models/Loan');
const EmiSchedule = require('../models/EmiSchedule');
const EmiPayment = require('../models/EmiPayment');
const axios = require("axios");
const qs = require("qs");

// Initialize Razorpay
let razorpayInstance = null;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    razorpayInstance = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET
    });
} else {
    console.warn("Razorpay keys not found. Using Mock mode.");
}

/**
 * Generate plain UPI QR code (no branding)
 */
async function generatePlainUPIQR(loan, customer) {
    try {
        // Create UPI payment string
        const upiId = process.env.UPI_ID || 'merchant@upi'; // Configure your UPI ID in .env
        const amount = loan.installment_amount;
        const customerName = customer.full_name.replace(/[^a-zA-Z0-9 ]/g, '');
        const loanCode = loan.loan_code;

        // UPI URL format
        const upiString = `upi://pay?pa=${upiId}&pn=${encodeURIComponent('Mit Electro World')}&am=${amount}&cu=INR&tn=${encodeURIComponent(`Loan ${loanCode} - ${customerName}`)}`;

        // Generate QR code as data URL
        const qrDataUrl = await QRCode.toDataURL(upiString, {
            errorCorrectionLevel: 'H',
            type: 'image/png',
            width: 400,
            margin: 2,
            color: {
                dark: '#000000',
                light: '#FFFFFF'
            }
        });

        return {
            qr_id: `plain_qr_${loan._id}`,
            image_url: qrDataUrl,
            plain: true
        };
    } catch (error) {
        console.error('Plain QR generation failed:', error);
        throw error;
    }
}

/**
 * Generate a static QR code for a loan (Customer)
 * @param {String} loanId 
 */
async function generateLoanQR(loanId) {
    const loan = await Loan.findById(loanId).populate('customer_id');
    if (!loan) throw new Error('Loan not found');

    // If QR already exists, return it
    if (loan.qr_code_url) {
        return {
            qr_id: loan.razorpay_qr_id,
            image_url: loan.qr_code_url
        };
    }

    // Mock Mode - for testing without Razorpay keys
    if (!razorpayInstance) {
        const mockQrId = `qr_mock_${loanId}`;
        const mockUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=mock_payment_ref_${loan._id}`;

        loan.razorpay_qr_id = mockQrId;
        loan.qr_code_url = mockUrl;
        await loan.save();

        return { qr_id: mockQrId, image_url: mockUrl, mock: true };
    }

    // Real Razorpay QR Code Generation (with webhook support)
    try {
        const customer = loan.customer_id;
        const qrRequest = {
            type: 'upi_qr',
            name: `${customer.full_name} - ${loan.loan_code}`,
            usage: 'multiple_use',
            fixed_amount: false,
            payment_amount: Math.round(loan.installment_amount * 100), // Amount in paise
            description: `Loan Repayment for ${loan.loan_code}`,
            notes: {
                loan_id: loan._id.toString(),
                customer_code: customer.customer_code,
                loan_code: loan.loan_code
            }
        };

        const response = await razorpayInstance.qrCode.create(qrRequest);

        // Save to Loan
        loan.razorpay_qr_id = response.id;
        loan.qr_code_url = response.image_url;
        await loan.save();

        return {
            qr_id: response.id,
            image_url: response.image_url
        };
    } catch (error) {
        console.error("Razorpay QR Generation Failed:", error);
        throw new Error('Failed to generate QR code');
    }
}

/**
 * Distribute a received payment across EMIs
 * @param {String} loanId 
 * @param {Number} amount - Amount in RUPEES
 * @param {String} transactionId - Reference from Gateway
 * @param {String} method - Payment mode
 */
async function distributePayment(loanId, amount, transactionId, method = 'upi') {
    const loan = await Loan.findById(loanId);
    if (!loan) throw new Error('Loan not found');

    // Fetch all unpaid/partial schedules sorted by date
    const schedules = await EmiSchedule.find({
        loan_id: loanId,
        status: { $in: ['pending', 'partial', 'overdue'] }
    }).sort({ due_date: 1 }); // Oldest first

    let remainingAmount = amount;
    const paidSchedules = [];

    // 1. Distribute across schedules
    for (const emi of schedules) {
        if (remainingAmount <= 0) break;

        const due = emi.emi_amount - (emi.paid_amount || 0);

        // Check for float precision issues, though using integers/rounding suggested
        // We act on 2 decimal precision logic usually

        let pay = 0;
        if (remainingAmount >= due) {
            pay = due;
            emi.status = 'paid';
            emi.paid_date = new Date(); // Or transaction date
        } else {
            pay = remainingAmount;
            emi.status = 'partial';
        }

        emi.paid_amount = (emi.paid_amount || 0) + pay;
        remainingAmount -= pay;

        await emi.save();
        paidSchedules.push(emi);
    }

    // 2. Handle Excess Amount (if any remaining after clearing ALL pending/overdue)
    // If we exhausted the query but still have money, check FUTURE schedules?
    // The query above was status $in: pending, partial, overdue. 
    // If all current cleared, we should fetch FUTURE ones? 
    // The query `status: pending` covers future ones too unless we filtered by date.
    // So `schedules` includes ALL unpaid EMIs.

    if (remainingAmount > 0) {
        console.warn(`Excess payment of ${remainingAmount} received for loan ${loanId}`);
        // For now, we can maybe log it or leave it?
        // Ideally, we apply to Principal directly or store as 'advance'.
        // Let's create a special 'Advance' schedule or just log it for now.
        // We will just log it in the Payment record remarks
    }

    // 3. Create EmiPayment Record
    const payment = new EmiPayment({
        loan_id: loanId,
        payment_date: new Date(),
        amount_paid: amount,
        payment_mode: method,
        transaction_reference: transactionId,
        remarks: `QR Payment. Distributed to ${paidSchedules.length} EMIs. ${remainingAmount > 0 ? `Excess: ${remainingAmount}` : ''}`
    });
    await payment.save();

    // 4. Update Loan Stats (optional, triggers via hooks usually or manual calc)
    // We might need to update total_paid on Loan if such field exists

    return {
        success: true,
        paid_emis: paidSchedules.map(s => s.emi_number),
        excess: remainingAmount
    };
}

/**
 * Handle Webhook Event
 * @param {Object} payload 
 * @param {String} signature 
 */
async function processWebhookOld(payload, signature) {
    // 1. Verify Signature
    if (razorpayInstance) {
        const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
        if (secret) {
            const expectedSignature = crypto.createHmac('sha256', secret)
                .update(JSON.stringify(payload))
                .digest('hex');

            if (expectedSignature !== signature) {
                throw new Error('Invalid Webhook Signature');
            }
        }
    }

    const event = payload.event;

    // Log Transaction
    let transaction = await Transaction.findOne({ transaction_id: payload.payload.payment.entity.id });
    if (!transaction && payload.payload.payment) {
        // Need to identify loan from notes
        const notes = payload.payload.payment.entity.notes || {};
        const loanId = notes.loan_id;

        if (loanId) {
            transaction = new Transaction({
                transaction_id: payload.payload.payment.entity.id,
                loan_id: loanId,
                amount: payload.payload.payment.entity.amount / 100, // Amount is in paise
                status: payload.event === 'payment.captured' ? 'captured' : 'created',
                method: payload.payload.payment.entity.method,
                raw_response: payload,
                event_type: event
            });
            await transaction.save();
        } else {
            console.error("Webhook received without Loan ID in notes");
            return; // Can't process without loan linkage
        }
    }

    // 2. Process 'payment.captured'
    if (event === 'payment.captured') {
        const payment = payload.payload.payment.entity;
        const amount = payment.amount / 100;
        const loanId = payment.notes.loan_id;

        if (loanId) {
            // Check if already processed
            // (We could verify EmiPayment with this txn ref)
            const existingPayment = await EmiPayment.findOne({ transaction_reference: payment.id });
            if (!existingPayment) {
                await distributePayment(loanId, amount, payment.id, payment.method);

                if (transaction) {
                    transaction.status = 'processed';
                    await transaction.save();
                }
            } else {
                console.log("Payment already processed:", payment.id);
            }
        }
    }
}

async function processWebhook(payload) {

    const txnId = payload.client_txn_id;
    const amount = parseFloat(payload.amount);
    const gatewayTxnId = payload.id;

    // Extract loan id from client_txn_id
    const loanId = txnId.split("_")[1];

    if (!loanId) return;

    const existing = await EmiPayment.findOne({
        transaction_reference: gatewayTxnId
    });

    if (existing) return;

    await distributePayment(
        loanId,
        amount,
        gatewayTxnId,
        "upi"
    );
}


async function createUpiGatewayOrder(loan) {
    const customer = loan.customer_id;

    const payload = {
        amount: loan.installment_amount,
        client_txn_id: `loan_${loan._id}_${Date.now()}`,
        customer_name: customer.full_name,
        customer_email: customer.email || "test@mail.com",
        customer_mobile: customer.mobile || "9999999999",
        p_info: loan.loan_code,
        redirect_url: process.env.UPIGATEWAY_REDIRECT_URL
    };

    const response = await axios.post(
        `${process.env.UPIGATEWAY_BASE_URL}/create-order`,
        qs.stringify(payload),
        {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": `Bearer ${process.env.UPIGATEWAY_API_KEY}`
            }
        }
    );

    return response.data;
}

async function createEkqrOrder(loan) {
    const customer = loan.customer_id;

    const payload = {
        key: process.env.EKQR_KEY,
        client_txn_id: `loan_${loan._id}_${Date.now()}`,
        amount: loan.installment_amount.toString(),
        p_info: `Loan ${loan.loan_code}`,
        customer_name: customer.full_name,
        customer_email: customer.email || "test@mail.com",
        customer_mobile: customer.mobile || "9999999999",
        redirect_url: process.env.EKQR_REDIRECT_URL,
        udf1: loan._id.toString(), // VERY IMPORTANT → use for webhook mapping
    };

    const response = await axios.post(
        `${process.env.EKQR_BASE_URL}/api/create_order`,
        payload,
        {
            headers: {
                "Content-Type": "application/json"
            }
        }
    );

    if (!response.data.status) {
        throw new Error(response.data.msg || "Payment gateway error");
    }

    return response.data.data;
}

async function processEkqrWebhook(payload) {

    const txnId = payload.client_txn_id;
    const gatewayTxnId = payload.id;
    const amount = parseFloat(payload.amount);

    const loanId = payload.udf1 || txnId.split("_")[1];

    if (!loanId) return;

    const existing = await EmiPayment.findOne({
        transaction_reference: gatewayTxnId
    });

    if (existing) return;

    await distributePayment(
        loanId,
        amount,
        gatewayTxnId,
        "upi"
    );
}


async function checkStatus(client_txn_id) {
    const response = await axios.post(
        "https://api.ekqr.in/api/check_order_status",
        {
            key: process.env.EKQR_KEY,
            client_txn_id,
            txn_date: "19-02-2026"
        },
        {
            headers: { "Content-Type": "application/json" }
        }
    );

    return response.data;
}


module.exports = {
    generateLoanQR,
    distributePayment,
    processWebhook,
   createUpiGatewayOrder,
   createEkqrOrder,
   processEkqrWebhook,
   checkStatus
};
