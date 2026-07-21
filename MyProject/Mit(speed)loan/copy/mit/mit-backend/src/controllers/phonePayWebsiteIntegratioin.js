const baseUrl = "https://api.phonepe.com/apis/identity-manager/v1/oauth/token";

const baseCreate = "https://api.phonepe.com/apis/pg"

const Loan = require("../models/Loan");
const axios = require("axios");
const EmiPayment = require('../models/EmiPayment');
const EmiSchedule = require('../models/EmiSchedule');

const mongoose = require("mongoose");

// Frontend origin – used for redirect after PhonePe checkout
const FRONTEND_URL = process.env.BASE_URL || "https://crm.sppeeds.com";

const getAccessToken = async () => {
  try {
    const params = new URLSearchParams();
    params.append("grant_type", "client_credentials");
    params.append("client_id", "SU2602271402434221427022");
    params.append("client_secret", "3a709380-19ee-48a6-923d-c92acaf2194c");
    params.append("client_version", "1");

    const response = await axios.post(`${baseUrl}`, params, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    });

    // console.log("Access Token:", response.data);
    return response.data;

  } catch (error) {
    console.error("Error getting access token:", error.response?.data || error.message);
    throw error;
  }
};


const createPayment = async (req, res) => {
  try {
    const { loanId } = req.params;
    const { emiId, amount, emiNumber } = req.body;

    if (!loanId || !amount) {
      return res.status(400).json({ success: false, message: "loanId and amount are required" });
    }

    // Create a unique merchantOrderId for this EMI payment
    const timestamp = Date.now();
    const merchantOrderId = `${loanId}_${emiId || "EMI"}_${timestamp}`.replace(/[^a-zA-Z0-9_-]/g, "_").substring(0, 50);

    // Amount in paise (1 INR = 100 paise)
    const amountInPaise = Math.round(Number(amount) * 100);

    // After payment, redirect the customer back to their loan page
    const redirectUrl = `${FRONTEND_URL}/customer-payment/${loanId}?payment_status=success&orderId=${merchantOrderId}`;

    const accessToken = await getAccessToken();

    const response = await axios.post(`${baseCreate}/checkout/v2/pay`, {
      merchantOrderId,
      amount: amountInPaise,
      expireAfter: 1200,
      paymentFlow: {
        type: "PG_CHECKOUT",
        message: `EMI Payment for Loan ${loanId}${emiNumber ? ` - EMI #${emiNumber}` : ""}`,
        merchantUrls: {
          redirectUrl
        },
      },
      disablePaymentRetry: false,
      metaInfo: {
        udf1: loanId,
        udf2: emiId || "",
        udf3: String(emiNumber || ""),
      }
    }, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `O-Bearer ${accessToken?.access_token}`,
      }
    });

    console.log("PhonePe Response:", response.data);

    // PhonePe returns redirectUrl inside response.data.redirectUrl
    const checkoutUrl = response.data?.redirectUrl || response.data?.data?.redirectUrl;

    res.status(200).json({
      success: true,
      message: "Payment created successfully",
      data: response.data,
      checkoutUrl,
      merchantOrderId,
    });

  } catch (error) {
    console.error("PhonePe createPayment error:", error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: error.response?.data?.message || error.message || "Payment initiation failed",
    });
  }
};

const checkOrderStatus = async (req, res) => {
  try {

    const { merchantOrderId } = req.params;

    if (!merchantOrderId) {
      return res.status(400).json({
        success: false,
        message: "merchantOrderId is required"
      });
    }

    // 🔒 Prevent duplicate processing
    const existingPayment = await EmiPayment.findOne({
      merchant_order_id: merchantOrderId
    });

    // console.log("Existing payment:", existingPayment);

    if (existingPayment) {
      console.log("Payment already processed:", merchantOrderId);

      return res.status(200).json({
        success: true,
        message: "Payment already processed",
        data: existingPayment
      });
    }

    // Get PhonePe access token
    const accessToken = await getAccessToken();

    // Check order status from PhonePe
    const response = await axios.get(
      `${baseCreate}/checkout/v2/order/${merchantOrderId}/status?details=true`,
      {
        headers: {
          Authorization: `O-Bearer ${accessToken?.access_token}`,
          "X-MERCHANT-ID": "M2385SCD6K40A"
        }
      }
    );

    // console.log("PhonePe order status Response:", response.data);

    const orderData = response.data;

    // Only process completed payments
    if (orderData.state !== "COMPLETED") {
      return res.status(200).json({
        success: true,
        message: "Payment not completed yet",
        data: orderData
      });
    }

    const loan_id = orderData.metaInfo.udf1;
    const amount_paid = orderData.amount / 100;
    const payment_mode = orderData?.paymentDetails?.[0]?.paymentMode || "PHONEPE";
    const payment_date = new Date();
    const transaction_reference = orderData.orderId;

    const collected_by = new mongoose.Types.ObjectId(
      "699012444726d900e8df8205"
    );

    const remarks = "PhonePe Payment By Customer";

    // Create payment record
    const payment = await EmiPayment.create({
      loan_id,
      amount_paid,
      payment_mode,
      payment_date,
      collected_by,
      transaction_reference,
      merchant_order_id: merchantOrderId,
      remarks
    });

    // ------------------------------
    // Update EMI Schedule
    // ------------------------------

    const schedules = await EmiSchedule.find({
      loan_id,
      status: { $in: ["pending", "overdue", "partial"] }
    }).sort({ emi_number: 1 });

    let remainingAmount = amount_paid;

    for (const schedule of schedules) {

      if (remainingAmount <= 0) break;

      const dueAmount = schedule.emi_amount - schedule.paid_amount;
      const paymentForThis = Math.min(remainingAmount, dueAmount);

      schedule.paid_amount += paymentForThis;

      if (Math.round(schedule.paid_amount) >= Math.round(schedule.emi_amount)) {
        schedule.status = "paid";
        schedule.paid_date = payment_date;
      } else {
        schedule.status = "partial";
      }

      await schedule.save();

      remainingAmount -= paymentForThis;
    }

    // ------------------------------
    // Recalculate Reducing Balance
    // ------------------------------

    const loan = await Loan.findById(loan_id);

    if (loan && loan.interest_type === "reducing") {

      console.log("Recalculating Reducing Balance Schedule...");

      const { generateOrUpdateSchedule } = require("../utils/calculationUtils");

      const allSchedules = await EmiSchedule.find({ loan_id }).sort({
        emi_number: 1
      });

      const paidSchedules = allSchedules.filter(
        (s) => s.status === "paid" || s.paid_amount > 0
      );

      const principalPaidSoFar = paidSchedules.reduce(
        (sum, s) => sum + s.principal_component,
        0
      );

      const currentOutstanding = Math.max(
        0,
        loan.principal_amount - principalPaidSoFar
      );

      const lastPreservedEmi =
        paidSchedules.length > 0
          ? Math.max(...paidSchedules.map((s) => s.emi_number))
          : 0;

      if (lastPreservedEmi < loan.tenure_months) {

        await EmiSchedule.deleteMany({
          loan_id,
          emi_number: { $gt: lastPreservedEmi }
        });

        const preserved = allSchedules.filter(
          (s) => s.emi_number <= lastPreservedEmi
        );

        const newRows = await generateOrUpdateSchedule(
          loan,
          currentOutstanding,
          preserved
        );

        if (newRows.length > 0) {
          await EmiSchedule.insertMany(newRows);
        }
      }
    }

    console.log("Payment created successfully:", payment);

    return res.status(200).json({
      success: true,
      message: "Payment processed successfully",
      data: payment
    });

  } catch (error) {

    console.error(
      "PhonePe checkOrderStatus error:",
      error.response?.data || error.message
    );

    return res.status(500).json({
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        "Order status check failed"
    });
  }
};


module.exports = {
  createPayment,
  checkOrderStatus
};