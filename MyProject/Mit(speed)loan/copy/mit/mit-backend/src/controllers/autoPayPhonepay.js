const baseUrl = "https://api.phonepe.com/apis/identity-manager/v1/oauth/token";

const Loan = require("../models/Loan");
const axios = require("axios");
const crypto = require("crypto");
const EmiPayment = require('../models/EmiPayment');
const EmiSchedule = require('../models/EmiSchedule');

const mongoose = require("mongoose");

const getAccessToken = async () => {
    try {
        const params = new URLSearchParams();
        params.append("grant_type", "client_credentials");
        params.append("client_id", "SU2602271402434221427022");
        params.append("client_secret", "3a709380-19ee-48a6-923d-c92acaf2194c");
        params.append("client_version", "1");

        const response = await axios.post(baseUrl, params, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        });

        // console.log("Access Token from access :", response.data);
        return response.data;

    } catch (error) {
        console.error("Error getting access token:", error.response?.data || error.message);
        throw error;
    }
};

const autoPaySetup = async (req, res) => {
    try {
        const loanId = req.params.loanId;

        const loan = await Loan.findById(loanId);
        // console.log("Loan:", loan);
        loan.phonepe_mandate_status = "pending";
        await loan.save();
        if (!loan) {
            return res.status(404).json({
                message: "Loan not found"
            });
        }
        // return;
        const accessToken = await getAccessToken();
        // console.log("Access Token:", accessToken.access_token);

        const response = await axios.post(
            "https://api.phonepe.com/apis/pg/checkout/v2/pay",
            {
                merchantOrderId: loan.customer_id.toString(),
                amount: loan.installment_amount * 100,
                paymentFlow: {
                    type: "SUBSCRIPTION_CHECKOUT_SETUP",
                    merchantUrls: {
                        redirectUrl: `https://crm.sppeeds.com/customer-payment/${loanId}`,
                        cancelRedirectUrl: `https://crm.sppeeds.com/customer-payment/${loanId}`
                    },
                    subscriptionDetails: {
                        subscriptionType: "RECURRING",
                        merchantSubscriptionId: loanId,
                        authWorkflowType: "TRANSACTION",
                        amountType: "FIXED",
                        maxAmount: loan.installment_amount * 100,
                        frequency: "ON_DEMAND",
                        productType: "UPI_MANDATE",
                        expireAt: 1779689282000
                    }
                },
                expireAfter: 3600,
                metaInfo: {
                    udf1: `loanId:${loanId} and customer_id:${loan.customer_id}`,
                }
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `O-Bearer ${accessToken.access_token}`,
                }
            }
        );

        const data = response.data;
        // console.log("Response:", data);

        if (data.redirectUrl) {
            loan.autoPayLink = data.redirectUrl;
            await loan.save();

            return res.status(200).json({
                message: "AutoPay Setup Successful",
                data: data
            });
        } else {
            return res.status(400).json({
                message: "AutoPay Setup Failed",
                data: data
            });
        }

    } catch (error) {
        console.error("AutoPay Setup Error:", error.response?.data || error.message);

        return res.status(500).json({
            message: error.response?.data || error.message || "Internal Server Error",
            error: error.response?.data || error.message
        });
    }
};

const checkSetupOrderStatus = async (req, res) => {
    try {
        const loanId = req.params.loanId;

        const loan = await Loan.findById(loanId);
        if (!loan) {
            return res.status(404).json({
                message: "Loan not found"
            });
        }

        const accessToken = await getAccessToken();
        // console.log("Access Token:", accessToken.access_token);

        const response = await axios.get(
            `https://api.phonepe.com/apis/pg/checkout/v2/order/${loan.customer_id.toString()}/status`,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `O-Bearer ${accessToken.access_token}`,
                }
            }
        );

        const data = response.data;
        // console.log("Response:", data);
        if (data.orderId) {
            return res.status(200).json({
                message: "AutoPay setup Order Status",
                data: data,
                success: true
            });
        } else {
            return res.status(400).json({
                message: "AutoPay setup Order Status Failed",
                data: data,
                success: false
            });
        }


    } catch (error) {
        console.error("AutoPay setup Order Status Error:", error.response?.data || error.message);

        return res.status(500).json({
            message: error.response?.data || error.message || "Internal Server Error",
            error: error.response?.data || error.message
        });
    }
}

const checkSubscriptionStatus = async (req, res) => {
    try {
        const loanId = req.params.loanId;

        const loan = await Loan.findById(loanId);
        if (!loan) {
            return res.status(404).json({
                message: "Loan not found"
            });
        }

        const accessToken = await getAccessToken();
        // console.log("Access Token:", accessToken.access_token);

        const response = await axios.get(
            `https://api.phonepe.com/apis/pg/subscriptions/v2/${loanId}/status?details=true`,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `O-Bearer ${accessToken.access_token}`,
                }
            }
        );

        const data = response.data;
        console.log("Response:", data);
        if (data.merchantSubscriptionId) {
            return res.status(200).json({
                message: "AutoPay Subscription Status",
                data: data,
                success: true
            });
        } else {
            return res.status(400).json({
                message: "AutoPay Subscription Status Failed",
                data: data,
                success: false
            });
        }


    } catch (error) {
        console.error("AutoPay Subscription Error:", error.response?.data || error.message);

        return res.status(500).json({
            message: error.response?.data || error.message || "Internal Server Error",
            error: error.response?.data || error.message
        });
    }
}

const notifyRedemption = async (req, res) => {
    try {
        const loanId = req.params.loanId;

        const loan = await Loan.findById(loanId);
        if (!loan) {
            return res.status(404).json({
                message: "Loan not found"
            });
        }

        const accessToken = await getAccessToken();
        // console.log("Access Token:", accessToken.access_token);

        const response = await axios.post(
            `https://api.phonepe.com/apis/pg/subscriptions/v2/notify`,
            {
                merchantOrderId: loan.customer_id.toString(),
                amount: loan.installment_amount * 100,
                expireAt: 1620891733101,
                paymentFlow: {
                    type: "SUBSCRIPTION_REDEMPTION",
                    merchantSubscriptionId: `${loanId}`,
                    redemptionRetryStrategy: "STANDARD",
                    autoDebit: true
                },
                metaInfo: {
                    udf1: `loanId:${loanId} and customer_id:${loan.customer_id}`,
                }

            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `O-Bearer ${accessToken.access_token}`,
                }
            }
        );

        const data = response.data;
        // console.log("Response:", data);
        if (data.orderId) {
            return res.status(200).json({
                message: "AutoPay Redemption Notification Status",
                data: data,
                success: true
            });
        } else {
            return res.status(400).json({
                message: "AutoPay Redemption Notification Status Failed",
                data: data,
                success: false
            });
        }


    } catch (error) {
        console.error("AutoPay Redemption Notification Error:", error.response?.data || error.message);

        return res.status(500).json({
            message: error.response?.data || error.message || "Internal Server Error",
            error: error.response?.data || error.message
        });
    }
}

const checkRedemptionOrderStatus = async (req, res) => {
    try {
        const loanId = req.params.loanId;

        const loan = await Loan.findById(loanId);
        if (!loan) {
            return res.status(404).json({
                message: "Loan not found"
            });
        }

        const accessToken = await getAccessToken();
        // console.log("Access Token:", accessToken.access_token);

        const response = await axios.get(
            `https://api.phonepe.com/apis/pg/subscriptions/v2/order/${loan.customer_id.toString()}/status?details=true`,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `O-Bearer ${accessToken.access_token}`,
                }
            }
        );

        const data = response.data;
        // console.log("Response:", data);
        if (data.merchantOrderId) {
            return res.status(200).json({
                message: "AutoPay Redemption Order Status",
                data: data,
                success: true
            });
        } else {
            return res.status(400).json({
                message: "AutoPay Redemption Order Status Failed",
                data: data,
                success: false
            });
        }


    } catch (error) {
        console.error("AutoPay Redemption Order Status Error:", error.response?.data || error.message);

        return res.status(500).json({
            message: error.response?.data || error.message || "Internal Server Error",
            error: error.response?.data || error.message
        });
    }
}

const redemptionExecute = async (req, res) => {
    try {
        const loanId = req.params.loanId;

        const loan = await Loan.findById(loanId);
        if (!loan) {
            return res.status(404).json({
                message: "Loan not found"
            });
        }

        const accessToken = await getAccessToken();
        // console.log("Access Token:", accessToken.access_token);

        const response = await axios.post(
            `https://api.phonepe.com/apis/pg/subscriptions/v2/redeem`,
            {
                merchantOrderId: loan.customer_id.toString(),
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `O-Bearer ${accessToken.access_token}`,
                }
            }
        );

        const data = response.data;
        // console.log("Response:", data);
        if (data.transactionId) {
            return res.status(200).json({
                message: "Redemption Executed Successfully",
                data: data,
                success: true
            });
        } else {
            return res.status(400).json({
                message: "Redemption Execution Failed",
                data: data,
                success: false
            });
        }


    } catch (error) {
        console.error("Redemption Execution Error:", error.response?.data || error.message);

        return res.status(500).json({
            message: error.response?.data || error.message || "Internal Server Error",
            error: error.response?.data || error.message
        });
    }
}

const cancelSubscription = async (req, res) => {
    try {
        const loanId = req.params.loanId;

        const loan = await Loan.findById(loanId);
        if (!loan) {
            return res.status(404).json({
                message: "Loan not found"
            });
        }

        // console.log("Loan:", loanId, loan);

        const accessToken = await getAccessToken();
        // console.log("Access Token:", accessToken.access_token);

        const response = await axios.post(
            `https://api.phonepe.com/apis/pg/subscriptions/v2/${loanId}/cancel`,
            {
                merchantSubscriptionId: loanId,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `O-Bearer ${accessToken.access_token}`,
                }
            }
        );

        const data = response.data;
        // console.log("Response:", data);

        return res.status(200).json({
            message: "Subscription Cancelled Successfully",
            data: {
                message: "Subscription Cancelled Successfully kindly check subscription status"
            },
            success: true
        });



    } catch (error) {
        console.error("Subscription Cancelled Error:", error.response?.data || error.message);

        return res.status(500).json({
            message: error.response?.data || error.message || "Internal Server Error",
            error: error.response?.data || error.message
        });
    }
}


// all webhoos 

const checkOutOrderCompleteWebhook = async (req, res) => {
    try {

        // 🔐 PhonePe Webhook Authorization Verification
        const expectedHash = crypto
            .createHash("sha256")
            .update("mit@phonepe:mit@phonepe")   // same username/password you configured in PhonePe
            .digest("hex");

        if (req.headers.authorization !== expectedHash) {
            return res.status(401).json({
                message: "Unauthorized webhook"
            });
        }

        // console.log("PhonePe Webhook:", req.body);

        const { event, payload } = req.body;

        // Only process completed orders
        if (event !== "checkout.order.completed") {
            return res.status(200).json({
                message: "Event ignored",
                success: true
            });
        }

        const merchantOrderId = payload?.merchantOrderId;
        const udf1 = payload?.metaInfo?.udf1;

        if (!udf1) {
            return res.status(400).json({
                message: "metaInfo.udf1 missing"
            });
        }

        // Extract loanId from udf1
        const match = udf1.match(/loanId:([a-zA-Z0-9]+)/);
        const loanId = match ? match[1] : null;

        if (!loanId) {
            return res.status(400).json({
                message: "LoanId not found in webhook"
            });
        }

        const loan = await Loan.findById(loanId);

        if (!loan) {
            return res.status(404).json({
                message: "Loan not found"
            });
        }

        //update loan

        if (payload.state == "COMPLETED") {

            const loan_id = loanId;
            const amount_paid = payload?.amount / 100;
            const payment_mode = payload?.paymentDetails?.[0]?.paymentMode || "PHONEPE_autopay";
            const payment_date = new Date();
            const transaction_reference = payload?.orderId;
            const remarks = "PhonePe Autopay Payment By Customer";
            const collected_by = new mongoose.Types.ObjectId(
                "699012444726d900e8df8205"
            );

            loan.isAutoPaySetup = true;
            loan.phonepe_mandate_status = "active";
            await loan.save();

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

            // const loan = await Loan.findById(loan_id);

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
        }

        // console.log("AutoPay setup completed for loan:", loanId);

        return res.status(200).json({
            message: "Webhook processed successfully",
            success: true
        });

    } catch (error) {

        console.error("Checkout Order Complete Webhook Error:", error);

        return res.status(500).json({
            message: "Webhook processing failed",
            error: error.message
        });

    }
};


const subscriptionStateChangeWebhook = async (req, res) => {
    try {
        // console.log("Subscription State Change Webhook:", req.body);

        // 🔐 PhonePe Webhook Authorization Verification
        const expectedHash = crypto
            .createHash("sha256")
            .update("mit@phonepe:mit@phonepe")   // same username/password you configured in PhonePe
            .digest("hex");

        if (req.headers.authorization !== expectedHash) {
            return res.status(401).json({
                message: "Unauthorized webhook"
            });
        }

        const { event, payload } = req.body;
        const loan = await Loan.findById(payload?.merchantSubscriptionId);
        if (event == "subscription.cancelled") {

            if (loan) {
                loan.isAutoPaySetup = false;
                loan.phonepe_mandate_status = "CANCELLED";
                await loan.save();
            }
        } else if (event == "subscription.revoked") {
            if (loan) {
                loan.isAutoPaySetup = false;
                loan.phonepe_mandate_status = "revoked";
                await loan.save();
            }
        } else if (event == "subscription.paused") {
            if (loan) {
                loan.isAutoPaySetup = true;
                loan.phonepe_mandate_status = "paused";
                await loan.save();
            }
        } else if (event == "subscription.unpaused") {
            if (loan) {
                loan.isAutoPaySetup = true;
                loan.phonepe_mandate_status = "unpaused";
                await loan.save();
            }
        }
        return res.status(200).json({
            message: "Webhook processed successfully",
            success: true
        });
    } catch (error) {
        console.error("Subscription State Change Webhook Error:", error);
        return res.status(500).json({
            message: "Webhook processing failed",
            error: error.message
        });
    }
};

const subscriptionRedemptionTransactionCompletedWebhook = async (req, res) => {
    try {

        // 🔐 PhonePe Webhook Authorization Verification
        const expectedHash = crypto
            .createHash("sha256")
            .update("mit@phonepe:mit@phonepe")   // same username/password you configured in PhonePe
            .digest("hex");

        if (req.headers.authorization !== expectedHash) {
            return res.status(401).json({
                message: "Unauthorized webhook"
            });
        }


        const { event, payload } = req.body;

        const customerId = payload?.merchantOrderId;

        const loan = await Loan.findOne({
            customer_id: new mongoose.Types.ObjectId(customerId)
        });

        if (event == "subscription.redemption.transaction.completed") {
            if (loan && payload?.paymentDetails?.[0]?.state == "COMPLETED") {
                const loan_id = loan._id;
                const amount_paid = payload?.paymentDetails?.[0]?.amount / 100;
                const payment_mode = payload?.paymentDetails?.[0]?.paymentMode || "PHONEPE_autopay";
                const payment_date = new Date();
                const transaction_reference = payload?.paymentDetails?.[0]?.transactionId;
                const remarks = "PhonePe Autopay Payment By Customer";
                const collected_by = new mongoose.Types.ObjectId(
                    "699012444726d900e8df8205"
                );

                loan.isAutoPaySetup = true;
                loan.phonepe_mandate_status = "active";
                await loan.save();

                const payment = await EmiPayment.create({
                    loan_id,
                    amount_paid,
                    payment_mode,
                    payment_date,
                    collected_by,
                    transaction_reference,
                    merchant_order_id: payload?.merchantOrderId,
                    remarks
                });

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

                // const loan = await Loan.findById(loan_id);

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

            }
        }
        return res.status(200).json({
            message: "Webhook processed successfully",
            success: true
        });
    } catch (error) {
        console.error("Subscription Redemption Transaction Completed Webhook Error:", error);
        return res.status(500).json({
            message: "Webhook processing failed",
            error: error.message
        });
    }
}



module.exports = {
    autoPaySetup,
    checkSetupOrderStatus,
    checkSubscriptionStatus,
    notifyRedemption,
    checkRedemptionOrderStatus,
    redemptionExecute,
    cancelSubscription,
    checkOutOrderCompleteWebhook,
    subscriptionStateChangeWebhook,
    subscriptionRedemptionTransactionCompletedWebhook
};