const Razorpay = require('razorpay');
const Register = require('../models/register.models');
const crypto = require('crypto');
const dotenv = require('dotenv');
dotenv.config({ quiet: true });

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Create Razorpay Order
exports.createOrder = async (req, res) => {
    try {
        
        
        const { amount, currency = "INR" } = req.body;
        console.log(req.body);
      
        const user = await Register.findById(req.user.id);
        if ( !user.address || !user.street || !user.city || !user.state || !user.postalCode || !user.district ) {
            return res.status(400).json({ message: "Add your delivery address details in profile page" });
        }

        if (!amount) {
            return res.status(400).json({ message: "Amount is required" });
        }
        const intAmount = Math.round(Number(amount));
        if (isNaN(intAmount) || intAmount <= 0) {
            return res.status(400).json({ message: "Amount must be a positive integer" });
        }
        const options = {
            amount: intAmount * 100, // Amount in paise
            currency,
            receipt:`rcptid_${Date.now()}`
        };
        const order = await razorpay.orders.create(options);
        res.status(201).json({ message: "Order created", data: order });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Verify Payment Signature
exports.verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        console.log(req.body);

        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(sign)
            .digest("hex");
        if (expectedSignature === razorpay_signature) {
            res.status(200).json({ message: "Payment verified successfully" });
        } else {
            res.status(400).json({ message: "Invalid signature" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};