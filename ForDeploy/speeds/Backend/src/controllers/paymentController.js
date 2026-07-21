import Razorpay from 'razorpay';
// import Address from '../models/shippingAddress.js';
import Payhistory from '../models/payhistory.js';
import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config({ quiet: true });

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Create Razorpay Order
export const createOrder = async (req, res) => {
    try {
        
        
        const { amount, description,type, currency = "INR" } = req.body;
        console.log(req.body);
      
        // const user = await Address.findOne({userId:req.params.id});
        // if (!user) {
        //     return res.status(404).json({ message: "Please update Address now" });
        // }
        if (!amount) {
            return res.status(400).json({success: false, message: "Amount is required" });
        }
        const intAmount = Math.round(Number(amount));
        if (isNaN(intAmount) || intAmount <= 0) {
            return res.status(400).json({success: false, message: "Amount must be a positive integer" });
        }
        const options = {
            amount: intAmount * 100, // Amount in paise
            currency,
            receipt:`rcptid_${Date.now()}`
        };
        const order = await razorpay.orders.create(options);
        await Payhistory.create({
            user: req.user.id,
            amount: intAmount,
            paymentId: order.id,
            type: type || 'DEBIT',
            description: description || 'Razorpay Order Creation',
            status: 'PENDING'
        });
        res.status(201).json({success: true, message: "Amount received successfully", data: order });
    } catch (error) {
        res.status(500).json({success: false, message: error.message });
    }
};

// Verify Payment Signature
export const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        console.log(req.body);

        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(sign)
            .digest("hex");
        if (expectedSignature === razorpay_signature) {
            await Payhistory.findOneAndUpdate(
                { paymentId: razorpay_order_id },
                { status: 'SUCCESS', transactionId: razorpay_payment_id }
            );
            res.status(200).json({success: true, message: "Payment verified successfully" });
        } else {
            await Payhistory.findOneAndUpdate(
                { paymentId: razorpay_order_id },
                { status: 'FAILED' }
            );
            res.status(400).json({success: false, message: "Invalid signature" });

        }
    } catch (error) {
        res.status(500).json({success: false, message: error.message });
    }
};

// Get Payment History
export const getPaymentHistory = async (req, res) => {
    try {
        const payments = await Payhistory.find({ user: req.user.id }).sort({createdAt: -1 });
        res.status(200).json({success: true, message: "Payment history retrieved successfully", data: payments });
    } catch (error) {
        res.status(500).json({success: false, message: error.message });
    }
};

export const getPaymentHistoryall = async (req, res) => {
    try {
        const payments = await Payhistory.find({}).sort({ createdAt: -1 });
        res.status(200).json({success: true, message: "Payment history retrieved successfully", data: payments });
    } catch (error) {
        res.status(500).json({success: false, message: error.message });
    }
};