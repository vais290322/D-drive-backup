import Razorpay from "razorpay";
import crypto from "crypto";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import User from "../models/User.model.js";
import Transaction from "../models/Transaction.model.js";
import { generateInvoicePDF } from "../utils/invoiceGenerator.js";

// Initialize Razorpay
// Initialize Razorpay Lazily
let razorpayInstance = null;

const getRazorpay = () => {
    if (!razorpayInstance) {
        if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
            throw new ApiError(500, "Razorpay configuration is missing");
        }
        razorpayInstance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });
    }
    return razorpayInstance;
};

// Plan Details Configuration
const PLANS = {
    "Free": {
        monthly: 0,
        yearly: 0,
        limits: { storage: 5 * 1024 * 1024 * 1024, uploads: 10, apiKeys: 1 },
    },
    "Pro": {
        monthly: 99, // ₹99
        yearly: 999, // ₹999
        limits: { storage: 25 * 1024 * 1024 * 1024, uploads: -1, apiKeys: 10 },
    },
    "Enterprise": {
        monthly: 299, // ₹299
        yearly: 2999, // ₹2999
        limits: { storage: 100 * 1024 * 1024 * 1024, uploads: -1, apiKeys: -1 }, // -1 = Unlimited
    },
};

export const createOrder = asyncHandler(async (req, res) => {
    const { plan, billingCycle, billingDetails } = req.body;

    if (!PLANS[plan]) {
        throw new ApiError(400, "Invalid plan selected");
    }

    const amount = PLANS[plan][billingCycle];

    if (amount === 0) {
        return res.status(200).json(new ApiResponse(200, { amount: 0 }, "Free plan selected"));
    }

    const options = {
        amount: amount * 100, // Razorpay processes in paisa
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
    };

    try {
        const razorpay = getRazorpay();
        const order = await razorpay.orders.create(options);

        // Create initial transaction record with billing details
        await Transaction.create({
            userId: req.user._id,
            plan,
            billingCycle,
            amount,
            currency: "INR",
            razorpayOrderId: order.id,
            status: "created",
            ...billingDetails, // { billingName, billingAddress, gstNumber, phone, email }
        });

        return res.status(200).json(new ApiResponse(200, order, "Order created successfully"));
    } catch (error) {
        console.error("Razorpay Order Error:", error);
        throw new ApiError(500, "Failed to create payment order");
    }
});

export const verifyPayment = asyncHandler(async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
        // 1. Update Transaction
        const transaction = await Transaction.findOne({ razorpayOrderId: razorpay_order_id });
        if (!transaction) {
            throw new ApiError(404, "Transaction not found");
        }

        transaction.razorpayPaymentId = razorpay_payment_id;
        transaction.razorpaySignature = razorpay_signature;
        transaction.status = "paid";
        await transaction.save();

        // 2. Update User Plan
        const user = await User.findById(transaction.userId);
        const planDetails = PLANS[transaction.plan];

        user.plan = transaction.plan;
        user.billingCycle = transaction.billingCycle;

        // Calculate Expiry
        const now = new Date();
        const durationMonths = transaction.billingCycle === "monthly" ? 1 : 12;
        user.planExpiry = new Date(now.setMonth(now.getMonth() + durationMonths));

        // Update Limits
        user.limitStorage = planDetails.limits.storage;
        user.storageLimit = planDetails.limits.storage;
        user.limitUploads = planDetails.limits.uploads;
        user.apiKeyCount = planDetails.limits.apiKeys;
        user.folderLimit = transaction.plan !== "Free"; // Enable folders for paid plans

        await user.save();

        return res.status(200).json(new ApiResponse(200, { plan: user.plan, expiry: user.planExpiry }, "Payment verified and plan updated"));
    } else {
        throw new ApiError(400, "Invalid signature");
    }
});

export const getPlans = asyncHandler(async (req, res) => {
    return res.status(200).json(new ApiResponse(200, PLANS, "Plans fetched successfully"));
});

export const getMyTransactions = asyncHandler(async (req, res) => {
    const transactions = await Transaction.find({ userId: req.user._id }).sort({ createdAt: -1 });
    return res.status(200).json(new ApiResponse(200, transactions, "Transactions fetched successfully"));
});

export const downloadInvoice = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const transaction = await Transaction.findById(id).populate("userId");

    if (!transaction) {
        throw new ApiError(404, "Transaction not found");
    }

    // Check if user owns the transaction or is admin
    if (transaction.userId._id.toString() !== req.user._id.toString() && req.user.role !== "admin") {
        throw new ApiError(403, "You don't have permission to download this invoice");
    }

    if (transaction.status !== "paid") {
        throw new ApiError(400, "Invoice is only available for paid transactions");
    }

    try {
        const pdfBuffer = await generateInvoicePDF(transaction, transaction.userId);

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename=invoice_${transaction._id}.pdf`);
        res.send(pdfBuffer);
    } catch (error) {
        console.error("PDF Generation Error:", error);
        throw new ApiError(500, "Failed to generate invoice PDF");
    }
});
