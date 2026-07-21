import { Ledger } from "../Models/ledgerAccount.model.js";
import mongoose from "mongoose";
import InvoiceMns from "../invoicemodel/invoice-mns.model.js";
import DepositCredit from "../Models/depositCredit.model.js";
import Bank from "../Models/bank.model.js";

// Create a new ledger entry
export const createLedger = async (req, res) => {
  try {
    const { invoiceId, invoiceNumber, totalAmount, paymentDetails, invoiceType } = req.body;

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
        (sum, payment) => sum + Number(payment.paymentAmount),
        0
      );
    }

    const dueAmount = totalAmount - totalPaidAmount;
    const isPaid = dueAmount <= 0;

    const ledger = await Ledger.create({
      invoiceId,
      invoiceNumber,
      totalAmount,
      dueAmount,
      totalPaidAmount,
      isPaid,
      paymentDetails: paymentDetails || [],
      invoiceType
    });

    // Update the paidOne field in the invoice to true when ledger is created
    await InvoiceMns.findByIdAndUpdate(
      invoiceId,
      { paidOne: true },
      { new: true }
    );

    // Create deposit credit entries for each payment detail and update bank balances
    if (paymentDetails && paymentDetails.length > 0) {
      for (const payment of paymentDetails) {
        const amount = Number(payment.paymentAmount);
        
        // Create deposit credit entry
        await DepositCredit.create({
          date: new Date(payment.paymentDate),
          amount: amount,
          transactionId: payment.transactionId,
          invoiceNumber: invoiceNumber,
          paymentMethod: payment.paymentMode,
          invoiceId: invoiceId,
          bankId: payment.bankId,
          invoiceType: invoiceType
        });

        // Update bank balance
        if (payment.bankId && mongoose.Types.ObjectId.isValid(payment.bankId)) {
          const bank = await Bank.findById(payment.bankId);
          if (bank) {
            bank.currentAmount += amount;
            bank.depositeAmount += amount;
            await bank.save();
          }
        }
      }
    }

    // Populate the invoiceId field to include invoice details in response
    const populatedLedger = await Ledger.findById(ledger._id).populate("invoiceId");

    res.status(201).json({
      success: true,
      message: "Ledger entry created successfully",
      data: populatedLedger,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create ledger entry",
      error: error.message,
    });
  }
}; 

// Get all ledger entries
export const getAllLedgers = async (req, res) => {
  try {
    // Update to populate invoiceId field
    const ledgers = await Ledger.find().populate("invoiceId");

    // Map through ledgers to include invoiceDetails in each entry
    const ledgersWithInvoiceDetails = ledgers.map(ledger => ({
      ...ledger._doc,
      
    }));

    res.status(200).json({
      success: true,
      message: "Ledger entries retrieved successfully",
      count: ledgers.length,
      data: ledgersWithInvoiceDetails,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve ledger entries",
      error: error.message,
    });
  }
};

export const getLedgerById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ledger ID format",
      });
    }

    const ledger = await Ledger.findById(id).populate("invoiceId");

    if (!ledger) {
      return res.status(404).json({
        success: false,
        message: "Ledger entry not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Ledger entry retrieved successfully",
      data: ledger,
      invoiceDetails: ledger.invoiceId
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve ledger entry",
      error: error.message,
    });
  }
};

export const updateLedger = async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentDetails, invoiceType } = req.body;

    if (!id || !paymentDetails || paymentDetails.length === 0) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided",
      }); 
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ledger ID format",
      });
    }

    // Find the existing ledger
    const ledger = await Ledger.findById(id);

    if (!ledger) {
      return res.status(404).json({
        success: false,
        message: "Ledger entry not found",
      });
    }

    // Add new payment details to the existing array
    if (paymentDetails && paymentDetails.length > 0) {
      // Create deposit credit entries for each new payment detail and update bank balances
      for (const payment of paymentDetails) {
        const amount = Number(payment.paymentAmount);
        
        // Create deposit credit entry
        await DepositCredit.create({
          date: new Date(payment.paymentDate),
          amount: amount,
          transactionId: payment.transactionId,
          invoiceNumber: ledger.invoiceNumber,
          paymentMethod: payment.paymentMode,
          invoiceId: ledger.invoiceId,
          bankId: payment.bankId,
          invoiceType: invoiceType || ledger.invoiceType
        });

        // Update bank balance
        if (payment.bankId && mongoose.Types.ObjectId.isValid(payment.bankId)) {
          const bank = await Bank.findById(payment.bankId);
          if (bank) {
            bank.currentAmount += amount;
            bank.depositeAmount += amount;
            await bank.save();
          }
        }
      }
      
      // Add new payment details to ledger
      ledger.paymentDetails.push(...paymentDetails);
    }

    // Recalculate totalPaidAmount
    ledger.totalPaidAmount = ledger.paymentDetails.reduce(
      (sum, payment) => sum + Number(payment.paymentAmount),
      0
    );
    
    // Recalculate dueAmount
    ledger.dueAmount = ledger.totalAmount - ledger.totalPaidAmount;
    
    // Update isPaid status
    ledger.isPaid = ledger.dueAmount <= 0;

    // Ensure invoiceType is preserved
    if (!ledger.invoiceType && invoiceType) {
      ledger.invoiceType = invoiceType;
    }

    // Save the updated ledger
    const updatedLedger = await ledger.save();
    
    // Populate the invoiceId field for the response
    const populatedLedger = await Ledger.findById(updatedLedger._id).populate("invoiceId");

    res.status(200).json({
      success: true,
      message: "Ledger entry updated successfully",
      data: populatedLedger,
      invoiceDetails: populatedLedger.invoiceId
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update ledger entry",
      error: error.message,
    });
  }
};

// Delete a ledger entry
export const deleteLedger = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ledger ID format",
      });
    }

    const ledger = await Ledger.findByIdAndDelete(id);

    if (!ledger) {
      return res.status(404).json({
        success: false,
        message: "Ledger entry not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Ledger entry deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete ledger entry",
      error: error.message,
    });
  }
};

// Get ledger entries by invoice ID
export const getLedgersByInvoiceId = async (req, res) => {
  try {
    const { invoiceId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(invoiceId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid invoice ID format",
      });
    }

    const ledgers = await Ledger.find({ invoiceId }).populate("invoiceId");

    // Map through ledgers to include invoiceDetails in each entry
    const ledgersWithInvoiceDetails = ledgers.map(ledger => ({
      ...ledger._doc,
      invoiceDetails: ledger.invoiceId
    }));

    res.status(200).json({
      success: true,
      message: "Ledger entries retrieved successfully",
      count: ledgers.length,
      data: ledgersWithInvoiceDetails,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve ledger entries",
      error: error.message,
    });
  }
};