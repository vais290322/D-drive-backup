import mongoose from "mongoose";
import SnigdhaServiceInvoice from "../SnigdhaModels/snigdhaServiceInvoice.model.js";
import {SngidhaServiceLedger} from "../SnigdhaModels/snigdhaServiceLedgerAccount.model.js";
import SnigdhaDepositCredit from "../SnigdhaModels/snigdhaDepositCredit.model.js";
import SnigdhaBank from "../SnigdhaModels/snigdhaBank.model.js";

// Create a new service ledger entry
export const createServiceLedger = async (req, res) => {
  try {
    const {invoiceId, invoiceNumber, totalAmount, paymentDetails} = req.body;

    if (!invoiceId || !invoiceNumber || !totalAmount) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided",
      });
    }

    let totalPaidAmount = 0;
    if (paymentDetails && paymentDetails.length > 0) {
      totalPaidAmount = paymentDetails.reduce(
        (sum, payment) => sum + Number(payment.paymentAmount),
        0
      );
    }

    const dueAmount = totalAmount - totalPaidAmount;
    const isPaid = dueAmount <= 0;

    const ledger = await SngidhaServiceLedger.create({
      invoiceId,
      invoiceNumber,
      totalAmount,
      dueAmount,
      totalPaidAmount,
      isPaid,
      paymentDetails: paymentDetails || [],
    });

    // Update the paidOne field in the invoice
    await SnigdhaServiceInvoice.findByIdAndUpdate(
      invoiceId,
      {paidOne: true},
      {new: true}
    );

    // Handle deposit credits and bank updates
    if (paymentDetails && paymentDetails.length > 0) {
      for (const payment of paymentDetails) {
        const amount = Number(payment.paymentAmount);

        await SnigdhaDepositCredit.create({
          date: new Date(payment.paymentDate),
          amount: amount,
          transactionId: payment.transactionId,
          invoiceNumber: invoiceNumber,
          invoiceType: "service",
          paymentMethod: payment.paymentMode,
          invoiceId: invoiceId,
          bankId: payment.bankId,
        });

        if (payment.bankId && mongoose.Types.ObjectId.isValid(payment.bankId)) {
          const bank = await SnigdhaBank.findById(payment.bankId);
          if (bank) {
            bank.currentAmount += amount;
            bank.depositeAmount += amount;
            await bank.save();
          }
        }
      }
    }

    const populatedLedger = await SngidhaServiceLedger.findById(
      ledger._id
    ).populate("invoiceId");

    res.status(201).json({
      success: true,
      message: "Service ledger entry created successfully",
      data: populatedLedger,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create service ledger entry",
      error: error.message,
    });
  }
};

// Get all service ledger entries
export const getAllServiceLedgers = async (req, res) => {
  try {
    const ledgers = await SngidhaServiceLedger.find().populate("invoiceId").sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Service ledger entries retrieved successfully",
      count: ledgers.length,
      data: ledgers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve service ledger entries",
      error: error.message,
    });
  }
};

// Get single service ledger by ID
export const getServiceLedgerById = async (req, res) => {
  try {
    const {id} = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ledger ID format",
      });
    }

    const ledger = await SngidhaServiceLedger.findById(id).populate(
      "invoiceId"
    );

    if (!ledger) {
      return res.status(404).json({
        success: false,
        message: "Service ledger entry not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Service ledger entry retrieved successfully",
      data: ledger,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve service ledger entry",
      error: error.message,
    });
  }
};

// Update service ledger
export const updateServiceLedger = async (req, res) => {
  try {
    const {id} = req.params;
    const {paymentDetails} = req.body;

    if (!id || !paymentDetails || paymentDetails.length === 0) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided",
      });
    }

    const ledger = await SngidhaServiceLedger.findById(id);

    if (!ledger) {
      return res.status(404).json({
        success: false,
        message: "Service ledger entry not found",
      });
    }

    // Handle new payments
    if (paymentDetails && paymentDetails.length > 0) {
      for (const payment of paymentDetails) {
        const amount = Number(payment.paymentAmount);

        await SnigdhaDepositCredit.create({
          date: new Date(payment.paymentDate),
          amount: amount,
          transactionId: payment.transactionId,
          invoiceNumber: ledger.invoiceNumber,
          invoiceType: "service", 
          paymentMethod: payment.paymentMode,
          invoiceId: ledger.invoiceId,
          bankId: payment.bankId,
        });

        if (payment.bankId && mongoose.Types.ObjectId.isValid(payment.bankId)) {
          const bank = await SnigdhaBank.findById(payment.bankId);
          if (bank) {
            bank.currentAmount += amount;
            bank.depositeAmount += amount;
            await bank.save();
          }
        }
      }

      ledger.paymentDetails.push(...paymentDetails);
    }

    // Update calculations
    ledger.totalPaidAmount = ledger.paymentDetails.reduce(
      (sum, payment) => sum + Number(payment.paymentAmount),
      0
    );
    ledger.dueAmount = ledger.totalAmount - ledger.totalPaidAmount;
    ledger.isPaid = ledger.dueAmount <= 0;

    const updatedLedger = await ledger.save();
    const populatedLedger = await SngidhaServiceLedger.findById(
      updatedLedger._id
    ).populate("invoiceId");

    res.status(200).json({
      success: true,
      message: "Service ledger entry updated successfully",
      data: populatedLedger,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update service ledger entry",
      error: error.message,
    });
  }
};

// Delete service ledger
export const deleteServiceLedger = async (req, res) => {
  try {
    const {id} = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ledger ID format",
      });
    }

    const ledger = await SngidhaServiceLedger.findByIdAndDelete(id);

    if (!ledger) {
      return res.status(404).json({
        success: false,
        message: "Service ledger entry not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Service ledger entry deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete service ledger entry",
      error: error.message,
    });
  }
};
