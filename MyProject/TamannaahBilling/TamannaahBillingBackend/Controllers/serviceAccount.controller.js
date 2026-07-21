import { ServiceAccount } from "../Models/serviceAccount.model.js";
import mongoose from "mongoose";
import Service from "../Models/service.model.js";
import DepositCredit from "../Models/depositCredit.model.js";
import Bank from "../Models/bank.model.js";

// Create a new service account entry
export const createServiceAccount = async (req, res) => {
  try {
    const { invoiceId, invoiceNumber, totalAmount, paymentDetails,invoiceType } = req.body;

    // console.log("invoiceId",invoiceId)

    if (!invoiceId || !invoiceNumber || !totalAmount || !invoiceType) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided",
      });
    }

    // Calculate totalPaidAmount based on initial payment details
    let totalPaidAmount = 0;
    if (paymentDetails && paymentDetails.length > 0) {
      totalPaidAmount = paymentDetails.reduce(
        (sum, payment) => sum + payment.paymentAmount,
        0
      );
    }

    const dueAmount = totalAmount - totalPaidAmount;
    const isPaid = dueAmount <= 0;

    const serviceAccount = await ServiceAccount.create({
      invoiceId,
      invoiceNumber,
      totalAmount,
      dueAmount,
      totalPaidAmount,
      isPaid,
      paymentDetails: paymentDetails || [],
      invoiceType
    });

    // Update the paidOne field in the service to true when service account is created
    await Service.findByIdAndUpdate(
      invoiceId,
      { paidOne: true },
      { new: true }
    );

    // Create deposit credit entries for each payment detail and update bank balances
    if (paymentDetails && paymentDetails.length > 0) {
      for (const payment of paymentDetails) {
        // Create deposit credit entry
        await DepositCredit.create({
          date: new Date(payment.paymentDate),
          amount: payment.paymentAmount,
          transactionId: payment.transactionId,
          invoiceNumber: invoiceNumber,
          invoiceType:invoiceType,
          paymentMethod: payment.paymentMode,
          invoiceId: invoiceId,
          bankId: payment.bankId
        });

        // Update bank balance
        const bank = await Bank.findById(payment.bankId);
        if (bank) {
          bank.currentAmount += Number(payment.paymentAmount);
          bank.depositeAmount += Number(payment.paymentAmount);
          await bank.save();
        }
      }
    }

    // Populate the invoiceId field to include service details in response
    const populatedServiceAccount = await ServiceAccount.findById(serviceAccount._id).populate("invoiceId");

    res.status(201).json({
      success: true,
      message: "Service account entry created successfully",
      data: populatedServiceAccount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create service account entry",
      error: error.message,
    });
  }
};

// Get all service account entries
export const getAllServiceAccounts = async (req, res) => {
  try {
    // Update to populate invoiceId field
    const serviceAccounts = await ServiceAccount.find().populate("invoiceId").sort({ createdAt: -1 });

    // Map through service accounts to include invoiceDetails in each entry
    const serviceAccountsWithInvoiceDetails = serviceAccounts.map(serviceAccount => ({
      ...serviceAccount._doc,
    }));

    res.status(200).json({
      success: true,
      message: "Service account entries retrieved successfully",
      count: serviceAccounts.length,
      data: serviceAccountsWithInvoiceDetails,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve service account entries",
      error: error.message,
    });
  }
};

// Get a single service account entry by ID
export const getServiceAccountById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid service account ID format",
      });
    }

    const serviceAccount = await ServiceAccount.findById(id).populate("invoiceId");

    if (!serviceAccount) {
      return res.status(404).json({
        success: false,
        message: "Service account entry not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Service account entry retrieved successfully",
      data: serviceAccount,
      invoiceDetails: serviceAccount.invoiceId
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve service account entry",
      error: error.message,
    });
  }
};

// Update a service account entry (add payment details)
export const updateServiceAccount = async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentDetails, invoiceType } = req.body;

    console.log("req : ", invoiceType);

    if (!id || !paymentDetails || paymentDetails.length === 0) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid service account ID format",
      });
    }

    // Find the existing service account
    const serviceAccount = await ServiceAccount.findById(id);
    console.log("service account : ", serviceAccount)

    if (!serviceAccount) {
      return res.status(404).json({
        success: false,
        message: "Service account entry not found",
      });
    }

    // Add new payment details to the existing array
    if (paymentDetails && paymentDetails.length > 0) {
      // Create deposit credit entries for each new payment detail and update bank balances
      for (const payment of paymentDetails) {
        // Create deposit credit entry
        await DepositCredit.create({
          date: new Date(payment.paymentDate),
          amount: payment.paymentAmount,
          transactionId: payment.transactionId,
          invoiceNumber: serviceAccount.invoiceNumber,
          paymentMethod: payment.paymentMode,
          invoiceId: serviceAccount.invoiceId,
          bankId: payment.bankId,
          invoiceType: invoiceType || serviceAccount.invoiceType // Use provided invoiceType or existing one
        });

        const amount = Number(payment.paymentAmount);
        // Update bank balance
        const bank = await Bank.findById(payment.bankId);
        if (bank) {
          console.log("bank from service acccount : ", bank, payment)
          console.log("payment from service acccount : ", typeof(payment.paymentAmount))
          bank.currentAmount += amount;
          bank.depositeAmount += amount;
          await bank.save();
        }
      }
      
      // Add new payment details to service account
      serviceAccount.paymentDetails.push(...paymentDetails);
    }

    // Recalculate totalPaidAmount
    serviceAccount.totalPaidAmount = serviceAccount.paymentDetails.reduce(
      (sum, payment) => sum + payment.paymentAmount,
      0
    );
    
    // Recalculate dueAmount
    serviceAccount.dueAmount = serviceAccount.totalAmount - serviceAccount.totalPaidAmount;
    
    // Update isPaid status
    serviceAccount.isPaid = serviceAccount.dueAmount <= 0;

    // Ensure invoiceType is preserved
    if (!serviceAccount.invoiceType && invoiceType) {
      serviceAccount.invoiceType = invoiceType;
    }

    // Save the updated service account
    const updatedServiceAccount = await serviceAccount.save();
    
    // Populate the invoiceId field for the response
    const populatedServiceAccount = await ServiceAccount.findById(updatedServiceAccount._id).populate("invoiceId");

    res.status(200).json({
      success: true,
      message: "Service account entry updated successfully",
      data: populatedServiceAccount,
      invoiceDetails: populatedServiceAccount.invoiceId
    });
  } catch (error) {
    console.error("Error updating service account:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update service account entry",
      error: error.message,
    });
  }
};

// Delete a service account entry
export const deleteServiceAccount = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid service account ID format",
      });
    }

    const serviceAccount = await ServiceAccount.findByIdAndDelete(id);

    if (!serviceAccount) {
      return res.status(404).json({
        success: false,
        message: "Service account entry not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Service account entry deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete service account entry",
      error: error.message,
    });
  }
};

// Get service account entries by invoice ID
export const getServiceAccountsByInvoiceId = async (req, res) => {
  try {
    const { invoiceId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(invoiceId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid invoice ID format",
      });
    }

    const serviceAccounts = await ServiceAccount.find({ invoiceId }).populate("invoiceId");

    // Map through service accounts to include invoiceDetails in each entry
    const serviceAccountsWithInvoiceDetails = serviceAccounts.map(serviceAccount => ({
      ...serviceAccount._doc,
      invoiceDetails: serviceAccount.invoiceId
    }));

    res.status(200).json({
      success: true,
      message: "Service account entries retrieved successfully",
      count: serviceAccounts.length,
      data: serviceAccountsWithInvoiceDetails,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve service account entries",
      error: error.message,
    });
  }
};