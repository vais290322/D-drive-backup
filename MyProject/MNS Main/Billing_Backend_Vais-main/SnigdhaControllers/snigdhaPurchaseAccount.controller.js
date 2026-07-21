import SnigdhaPurchaseAccount from "../SnigdhaModels/snigdhaPurchaseAccount.model.js";
import mongoose from "mongoose";
import SnigdhaPurchaseOrderNew from "../SnigdhaModels/SnigdhaPurchaseOrderNew.model.js"
import SnigdhaPurchaseWindow from "../SnigdhaModels/snigdhaPurchaseWindow.model.js";
import SnigdhaBank from "../SnigdhaModels/snigdhaBank.model.js";
import SnigdhaCreditDebitNote from "../SnigdhaModels/snigdhaCreditDebitNotes.model.js";
import SnigdhaVendorBalance from "../SnigdhaModels/SnigdhaVendorBalance.model.js";


// Create a new purchase account entry
export const createPurchaseAccount = async (req, res) => {
  try {
    const { invoiceId, invoiceNumber, vendorName, totalAmount, paymentDetails, voucherDetails } = req.body;

    // console.log("Received data:", req.body);

    if (!invoiceId || !invoiceNumber || !totalAmount || !vendorName) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided",
      });
    }

    // Validate invoiceId format
    if (!mongoose.Types.ObjectId.isValid(invoiceId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid invoice ID format",
      });
    }

    if (paymentDetails?.[0]?.paymentMode === "Voucher") {
      if (!voucherDetails || voucherDetails.length === 0) {
        return res.status(400).json({
          success: false,
          error: true,
          message: "For voucher payment, voucherDetails are required or choose another payment method",
        });
      }
    }

    const payment = paymentDetails?.[0];
    const voucher = voucherDetails?.[0];
    const isVoucher = payment?.paymentMode === "Voucher";
    const isCreditNote = isVoucher && voucher?.noteType === "credit";

    // 🔴 bankId required for all EXCEPT voucher + credit note
    if (!isCreditNote) {
      if (!payment?.bankId) {
        return res.status(400).json({
          success: false,
          error: true,
          message: "Bank is required for this payment method",
        });
      }
    }

    // Check if invoice exists
    const invoice = await SnigdhaPurchaseOrderNew.findById(invoiceId);
    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found",
      });
    }

    // this is for reduce amount from credit/debit note and also update the customer balnce history
    if (payment.paymentMode === "Voucher") {
      const amount = Number(voucher.amount);
      const noteId = voucher.noteId;
      const creditDebitNote = await SnigdhaCreditDebitNote.findById(noteId);
      if (creditDebitNote) {
        creditDebitNote.appliedAmount += amount;
        await creditDebitNote.save();
      }

      const vendorId = voucher.vendorId;
      const vendorBalance = await SnigdhaVendorBalance.findOne({ vendorId });

      if (vendorBalance) {
        const noteNumber = voucher.noteNumber;

        // Find this note inside history
        const noteHistory = vendorBalance.history.find(h => h.ref === noteNumber);
        if (noteHistory) {
          // Push invoiceNumber into appliedToInvoiceNumber array
          noteHistory.appliedToInvoiceNumber.push(invoiceNumber);
          noteHistory.usedInInvoice += amount;
        }

        vendorBalance.appliedInvoices.push({
          invoiceNumber,
          amount,
          date: voucher?.date,
          source: "voucher",       // or credit_note / debit_note / apply
          ref: noteNumber,
          noteType: voucher?.noteType
        });

        if (noteHistory.source === "credit_note") {
          vendorBalance.totalCredit -= amount;
          vendorBalance.availableCredit = vendorBalance.totalCredit - vendorBalance.totalDebit;
        } else {
          vendorBalance.totalDebit -= amount;
          vendorBalance.availableCredit = vendorBalance.totalCredit - vendorBalance.totalDebit;
        }

        await vendorBalance.save()

      }

    }

    let ledger = null;

    if (payment.paymentMode === "Voucher" && voucherDetails) {

      if (voucher?.noteType === "credit") {
        let totalPaidAmount = 0;
        if (paymentDetails && paymentDetails.length > 0) {
          totalPaidAmount = paymentDetails.reduce(
            (sum, payment) => sum + Number(payment.paymentAmount),
            0
          );
        }

        const dueAmount = totalAmount - totalPaidAmount;
        const isPaid = dueAmount <= 0;

        ledger = await SnigdhaPurchaseAccount.create({
          invoiceId,
          invoiceNumber,
          vendorName,
          totalAmount,
          dueAmount,
          totalPaidAmount,
          isPaid,
          paymentDetails: paymentDetails || [],
          voucherDetails: voucherDetails || [],
          totalDebitNoteAmount: 0,
          totalWithoutDebitNoteAmount: totalAmount,
          debitNoteHistory: [],
          creditApplied: payment.paymentAmount,
          creditNoteAdjustments: [{
            noteId: voucher?.noteId,
            noteType: voucher?.noteType,
            amount: voucher?.amount,
            date: voucher?.date,
            noteNumber: voucher?.noteNumber,
          }],
        })

      } else {
        let totalPaidAmount = 0;

        const dueAmount = totalAmount - totalPaidAmount;
        const isPaid = dueAmount <= 0;
        ledger = await SnigdhaPurchaseAccount.create({
          invoiceId,
          invoiceNumber,
          vendorName,
          totalAmount,
          dueAmount,
          totalPaidAmount,
          isPaid,
          paymentDetails: paymentDetails || [],
          voucherDetails: voucherDetails || [],
          totalDebitNoteAmount: payment?.paymentAmount,
          totalWithoutDebitNoteAmount: totalAmount,
          debitNoteHistory: [{
            referenceNumber: voucher?.noteNumber,
            amount: voucher?.amount,
            date: voucher?.date,
            noteId: voucher?.noteId,
            reason: "Debit note's amount paid"
          }],
          creditApplied: 0,
          creditNoteAdjustments: [],
        })

      }

    } else {
      let totalPaidAmount = 0;
      if (paymentDetails && paymentDetails.length > 0) {
        totalPaidAmount = paymentDetails.reduce(
          (sum, payment) => sum + Number(payment.paymentAmount),
          0
        );
      }

      const dueAmount = totalAmount - totalPaidAmount;
      const isPaid = dueAmount <= 0;

      ledger = await SnigdhaPurchaseAccount.create({
        invoiceId,
        invoiceNumber,
        vendorName,
        totalAmount,
        dueAmount,
        totalPaidAmount,
        isPaid,
        paymentDetails: paymentDetails || [],
        voucherDetails: [],
        totalDebitNoteAmount: 0,
        totalWithoutDebitNoteAmount: totalAmount,
        debitNoteHistory: [],
        creditApplied: 0,
        creditNoteAdjustments: [],

      });
    }


    // Validate payment details if provided
    if (paymentDetails && paymentDetails.length > 0) {
      for (const payment of paymentDetails) {
        if (!payment.paymentDate || !payment.paymentAmount || !payment.paymentMode || !payment.transactionId) {
          return res.status(400).json({
            success: false,
            message: "All payment details fields must be provided",
          });
        }

        if (payment.paymentMode !== "Voucher" && !mongoose.Types.ObjectId.isValid(payment.bankId)) {
          return res.status(400).json({
            success: false,
            message: "Invalid bank ID format in payment details",
          });
        }

        if (payment.paymentMode === "Voucher" && voucher?.noteType === "credit") {
          continue;
        } else {
          // Check if bank exists and has sufficient balance
          const bank = await SnigdhaBank.findById(payment.bankId);
          if (!bank) {
            return res.status(404).json({
              success: false,
              message: `Bank with ID ${payment.bankId} not found`,
            });
          }

          if (Number(bank.currentAmount) < Number(payment.paymentAmount)) {
            return res.status(400).json({
              success: false,
              message: `Insufficient balance in bank account for payment of ${payment.paymentAmount}`,
            });
          }
        }
      }
    }

    // Update the paidOne field in the purchase order to true when purchase account is created
    await SnigdhaPurchaseOrderNew.findByIdAndUpdate(
      invoiceId,
      { paidOne: true },
      { new: true }
    );

    // Create purchase window entries for each payment detail and update bank balances
    if (paymentDetails && paymentDetails.length > 0) {
      for (const payment of paymentDetails) {

        // ❌ If credit note → SKIP withdrawal + skip bank update
        if (payment.paymentMode === "Voucher" && voucher?.noteType === "credit") {
          continue;
        }

        // Create purchase window entry
        await SnigdhaPurchaseWindow.create({
          date: new Date(payment.paymentDate),
          amount: Number(payment.paymentAmount),
          invoiceNumber: invoiceNumber,
          invoiceId: invoiceId,
          vendorName: vendorName,
          paymentMethod: payment.paymentMode,
          transactionId: payment.transactionId,
          bankId: payment.bankId,
          noteType: voucher?.noteType || "",
        });

        // Update bank balance - deduct amount from bank
        const bank = await SnigdhaBank.findById(payment.bankId);
        bank.currentAmount = Number(bank.currentAmount) - Number(payment.paymentAmount);
        bank.deductionAmount = Number(bank.deductionAmount) + Number(payment.paymentAmount);
        await bank.save();
      }
    }


    // Populate the invoiceId field to include invoice details in response
    const populatedPurchaseAccount = await SnigdhaPurchaseAccount.findById(ledger._id)
      .populate("invoiceId");
    // .populate("paymentDetails.bankId");

    res.status(201).json({
      success: true,
      message: "Purchase account entry created successfully",
      data: populatedPurchaseAccount,
    });
  } catch (error) {
    console.error("Error creating purchase account:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create purchase account entry",
      error: error.message,
    });
  }
};

// Get all purchase account entries
export const getAllPurchaseAccounts = async (req, res) => {
  try {
    // Update to populate invoiceId field and bank details
    const purchaseAccounts = await SnigdhaPurchaseAccount.find()
      .populate("invoiceId")
      .populate("paymentDetails.bankId")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Purchase account entries retrieved successfully",
      count: purchaseAccounts.length,
      data: purchaseAccounts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve purchase account entries",
      error: error.message,
    });
  }
};

// Get purchase account by ID
export const getPurchaseAccountById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid purchase account ID format",
      });
    }

    const purchaseAccount = await SnigdhaPurchaseAccount.findById(id)
      .populate("invoiceId")
      .populate("paymentDetails.bankId");

    if (!purchaseAccount) {
      return res.status(404).json({
        success: false,
        message: "Purchase account entry not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Purchase account entry retrieved successfully",
      data: purchaseAccount,
      invoiceDetails: purchaseAccount.invoiceId
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve purchase account entry",
      error: error.message,
    });
  }
};

// Update purchase account - add new payment
export const updatePurchaseAccountOld = async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentDetails } = req.body;
    console.log("paymentDetails ", paymentDetails, req.body);

    if (!id || !paymentDetails || paymentDetails.length === 0) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid purchase account ID format",
      });
    }

    // Find the existing purchase account
    const purchaseAccount = await SnigdhaPurchaseAccount.findById(id);

    if (!purchaseAccount) {
      return res.status(404).json({
        success: false,
        message: "Purchase account entry not found",
      });
    }

    // Validate payment details
    for (const payment of paymentDetails) {
      if (!payment.paymentDate || !payment.paymentAmount || !payment.paymentMode || !payment.transactionId || !payment.bankId) {
        return res.status(400).json({
          success: false,
          message: "All payment details fields must be provided",
        });
      }

      if (!mongoose.Types.ObjectId.isValid(payment.bankId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid bank ID format in payment details",
        });
      }

      // Check if bank exists and has sufficient balance
      const bank = await SnigdhaBank.findById(payment.bankId);
      if (!bank) {
        return res.status(404).json({
          success: false,
          message: `Bank with ID ${payment.bankId} not found`,
        });
      }

      if (Number(bank.currentAmount) < Number(payment.paymentAmount)) {
        return res.status(400).json({
          success: false,
          message: `Insufficient balance in bank account for payment of ${payment.paymentAmount}`,
        });
      }
    }

    // Add new payment details to the existing array
    if (paymentDetails && paymentDetails.length > 0) {
      // Create purchase window entries for each new payment detail and update bank balances
      for (const payment of paymentDetails) {
        // Create purchase window entry
        await SnigdhaPurchaseWindow.create({
          date: new Date(payment.paymentDate),
          amount: Number(payment.paymentAmount),
          invoiceNumber: purchaseAccount.invoiceNumber,
          invoiceId: purchaseAccount.invoiceId,
          vendorName: purchaseAccount.vendorName,
          paymentMethod: payment.paymentMode,
          transactionId: payment.transactionId,
          bankId: payment.bankId
        });

        // Update bank balance - deduct amount from bank
        const bank = await SnigdhaBank.findById(payment.bankId);
        bank.currentAmount = Number(bank.currentAmount) - Number(payment.paymentAmount);
        bank.deductionAmount = Number(bank.deductionAmount) + Number(payment.paymentAmount);
        await bank.save();
      }

      // Add new payment details to purchase account
      purchaseAccount.paymentDetails.push(...paymentDetails);
    }

    // Recalculate totalPaidAmount
    purchaseAccount.totalPaidAmount = purchaseAccount.paymentDetails.reduce(
      (sum, payment) => sum + Number(payment.paymentAmount),
      0
    );

    // Recalculate dueAmount
    purchaseAccount.dueAmount = Number(purchaseAccount.totalAmount) - purchaseAccount.totalPaidAmount;

    // Update isPaid status
    purchaseAccount.isPaid = purchaseAccount.dueAmount <= 0;


    // Save the updated purchase account
    const updatedPurchaseAccount = await purchaseAccount.save();

    // Populate the invoiceId field for the response
    const populatedPurchaseAccount = await SnigdhaPurchaseAccount.findById(updatedPurchaseAccount._id)
      .populate("invoiceId")
      .populate("paymentDetails.bankId");

    res.status(200).json({
      success: true,
      message: "Purchase account entry updated successfully",
      data: populatedPurchaseAccount,
      invoiceDetails: populatedPurchaseAccount.invoiceId
    });
  } catch (error) {
    console.error("Error updating purchase account:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update purchase account entry",
      error: error.message,
    });
  }
};

// Update purchase account - add new payment
export const updatePurchaseAccount = async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentDetails, voucherDetails } = req.body;
    console.log("paymentDetails ", paymentDetails, req.body);

    if (!id || !paymentDetails || paymentDetails.length === 0) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid purchase account ID format",
      });
    }

    if (paymentDetails[0]?.paymentMode === "Voucher") {
      if (!voucherDetails || voucherDetails.length === 0) {
        return res.status(400).json({
          success: false,
          error: true,
          message: "For voucher payment, voucherDetails are required or choose another payment method",
        });
      }
    }

    const payment = paymentDetails?.[0];
    const voucher = voucherDetails?.[0];
    const isVoucher = payment?.paymentMode === "Voucher";
    const isCreditNote = isVoucher && voucher?.noteType === "credit";

    // 🔴 bankId required for all EXCEPT voucher + credit note
    if (!isCreditNote) {
      if (!payment?.bankId) {
        return res.status(400).json({
          success: false,
          error: true,
          message: "Bank is required for this payment method",
        });
      }
    }

    // Find the existing purchase account
    const purchaseAccount = await SnigdhaPurchaseAccount.findById(id);

    if (!purchaseAccount) {
      return res.status(404).json({
        success: false,
        message: "Purchase account entry not found",
      });
    }

    // ============================
    // 1️⃣ HANDLE VOUCHER IMPACTS
    // ============================
    if (isVoucher && voucherDetails && voucherDetails.length > 0) {
      const v = voucherDetails?.[0];

      // --- Update Credit/Debit Note ---
      const note = await SnigdhaCreditDebitNote.findById(v.noteId);
      if (note) {
        note.appliedAmount += Number(v.amount);
        await note.save();
      }

      // --- Update vendor balance ---
      const vendorBalance = await SnigdhaVendorBalance.findOne({ vendorId: v.vendorId });

      if (vendorBalance) {
        // Find matching note
        const noteHistory = vendorBalance.history.find(h => h.ref === v.noteNumber);

        if (noteHistory) {
          noteHistory.appliedToInvoiceNumber.push(purchaseAccount.invoiceNumber);
          noteHistory.usedInInvoice += Number(v.amount);
        }

        // Push applied invoice entry
        vendorBalance.appliedInvoices.push({
          invoiceNumber: purchaseAccount.invoiceNumber,
          amount: Number(v.amount),
          date: v.date,
          source: "voucher",
          ref: v.noteNumber,
          noteType: v.noteType
        });

        // Update totals
        if (v.noteType === "credit") {
          vendorBalance.totalCredit -= Number(v.amount);
        } else {
          vendorBalance.totalDebit -= Number(v.amount);
        }

        vendorBalance.availableCredit = vendorBalance.totalCredit - vendorBalance.totalDebit;

        await vendorBalance.save();
      }

      // ================================
      // 2️⃣ UPDATE LEDGER VOUCHER FIELDS
      // ================================
      if (v.noteType === "credit") {
        purchaseAccount.creditApplied += Number(v.amount);
        purchaseAccount.creditNoteAdjustments.push({
          noteId: v.noteId,
          noteType: v.noteType,
          amount: v.amount,
          date: v.date,
          noteNumber: v.noteNumber
        });
      } else {
        purchaseAccount.totalDebitNoteAmount += Number(v.amount);
        purchaseAccount.debitNoteHistory.push({
          referenceNumber: v.noteNumber,
          amount: v.amount,
          date: v.date,
          noteId: v.noteId,
          reason: "Debit note's amount collected"
        });
      }
    }


    // ============================
    // 3️⃣ ADD PAYMENT TO LEDGER
    // ============================

    purchaseAccount.paymentDetails.push(...paymentDetails);



    // Validate payment details
    for (const payment of paymentDetails) {
      if (!payment.paymentDate || !payment.paymentAmount || !payment.paymentMode || !payment.transactionId) {
        return res.status(400).json({
          success: false,
          message: "All payment details fields must be provided",
        });
      }

      if (payment.paymentMode !== "Voucher" && !mongoose.Types.ObjectId.isValid(payment.bankId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid bank ID format in payment details",
        });
      }

      if (payment.paymentMode === "Voucher" && voucher.noteType === "credit") {
        continue;
      } else {
        // Check if bank exists and has sufficient balance
        const bank = await SnigdhaBank.findById(payment.bankId);
        if (!bank) {
          return res.status(404).json({
            success: false,
            message: `Bank with ID ${payment.bankId} not found`,
          });
        }

        if (Number(bank.currentAmount) < Number(payment.paymentAmount)) {
          return res.status(400).json({
            success: false,
            message: `Insufficient balance in bank account for payment of ${payment.paymentAmount}`,
          });
        }
      }

    }

    if (!isVoucher || voucher?.noteType !== "credit") {
      // Add new payment details to the existing array
      if (paymentDetails && paymentDetails.length > 0) {
        // Create purchase window entries for each new payment detail and update bank balances
        for (const payment of paymentDetails) {
          // Create purchase window entry
          await SnigdhaPurchaseWindow.create({
            date: new Date(payment.paymentDate),
            amount: Number(payment.paymentAmount),
            invoiceNumber: purchaseAccount.invoiceNumber,
            invoiceId: purchaseAccount.invoiceId,
            vendorName: purchaseAccount.vendorName,
            paymentMethod: payment.paymentMode,
            transactionId: payment.transactionId,
            bankId: payment.bankId,
            noteType: voucher?.noteType || ""
          });

          // Update bank balance - deduct amount from bank
          const bank = await SnigdhaBank.findById(payment.bankId);
          bank.currentAmount = Number(bank.currentAmount) - Number(payment.paymentAmount);
          bank.deductionAmount = Number(bank.deductionAmount) + Number(payment.paymentAmount);
          await bank.save();
        }
      }
    }

    // ============================
    // 5️⃣ UPDATE TOTAL AMOUNTS
    // ============================

    // Recalculate totalPaidAmount

    const realPayments = purchaseAccount.paymentDetails.filter((payment) => payment.noteType !== "debit");

    purchaseAccount.totalPaidAmount = realPayments.reduce(
      (sum, payment) => sum + Number(payment.paymentAmount),
      0
    );

    // Recalculate dueAmount
    purchaseAccount.dueAmount = Number(purchaseAccount.totalAmount) - purchaseAccount.totalPaidAmount;

    // Update isPaid status
    purchaseAccount.isPaid = purchaseAccount.dueAmount <= 0;


    // Save the updated purchase account
    const updatedPurchaseAccount = await purchaseAccount.save();

    // Populate the invoiceId field for the response
    const populatedPurchaseAccount = await SnigdhaPurchaseAccount.findById(updatedPurchaseAccount._id)
      .populate("invoiceId");
    // .populate("paymentDetails.bankId");

    res.status(200).json({
      success: true,
      message: "Purchase account entry updated successfully",
      data: populatedPurchaseAccount,
      invoiceDetails: populatedPurchaseAccount.invoiceId
    });
  } catch (error) {
    console.error("Error updating purchase account:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update purchase account entry",
      error: error.message,
    });
  }
};

// Delete a purchase account entry
export const deletePurchaseAccount = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid purchase account ID format",
      });
    }

    // Find the purchase account to get payment details before deleting
    const purchaseAccount = await SnigdhaPurchaseAccount.findById(id);

    if (!purchaseAccount) {
      return res.status(404).json({
        success: false,
        message: "Purchase account entry not found",
      });
    }

    // Restore bank balances for all payments
    if (purchaseAccount.paymentDetails && purchaseAccount.paymentDetails.length > 0) {
      for (const payment of purchaseAccount.paymentDetails) {
        // Update bank balance - restore amount to bank
        const bank = await SnigdhaBank.findById(payment.bankId);
        if (bank) {
          bank.currentAmount = Number(bank.currentAmount) + Number(payment.paymentAmount);
          bank.deductionAmount = Number(bank.deductionAmount) - Number(payment.paymentAmount);
          await bank.save();
        }

        // Delete related purchase window entries - use more specific query
        await SnigdhaPurchaseWindow.deleteMany({
          invoiceId: purchaseAccount.invoiceId,
          bankId: payment.bankId,
          amount: Number(payment.paymentAmount)
        });
      }
    }

    // Update the paidOne field in the purchase order back to false
    await SnigdhaPurchaseOrderNew.findByIdAndUpdate(
      purchaseAccount.invoiceId,
      { paidOne: false },
      { new: true }
    );

    // Delete the purchase account
    await SnigdhaPurchaseAccount.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Purchase account entry and related records deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting purchase account:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete purchase account entry",
      error: error.message,
    });
  }
};

// Get purchase account entries by invoice ID
export const getPurchaseAccountsByInvoiceId = async (req, res) => {
  try {
    const { invoiceId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(invoiceId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid invoice ID format",
      });
    }

    const purchaseAccounts = await SnigdhaPurchaseAccount.find({ invoiceId })
      .populate("invoiceId")
      .populate("paymentDetails.bankId");

    res.status(200).json({
      success: true,
      message: "Purchase account entries retrieved successfully",
      count: purchaseAccounts.length,
      data: purchaseAccounts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve purchase account entries",
      error: error.message,
    });
  }
};

// Get purchase accounts by vendor name
export const getPurchaseAccountsByVendorName = async (req, res) => {
  try {
    const { vendorName } = req.params;

    const purchaseAccounts = await SnigdhaPurchaseAccount.find({
      vendorName: { $regex: vendorName, $options: 'i' }
    })
      .populate("invoiceId")
      .populate("paymentDetails.bankId");

    res.status(200).json({
      success: true,
      message: "Purchase account entries retrieved successfully",
      count: purchaseAccounts.length,
      data: purchaseAccounts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve purchase account entries",
      error: error.message,
    });
  }
};

// Get purchase accounts by payment status
export const getPurchaseAccountsByPaymentStatus = async (req, res) => {
  try {
    const { isPaid } = req.params;

    // Convert string parameter to boolean
    const isPaidBoolean = isPaid === 'true';

    const purchaseAccounts = await SnigdhaPurchaseAccount.find({ isPaid: isPaidBoolean })
      .populate("invoiceId")
      .populate("paymentDetails.bankId");

    res.status(200).json({
      success: true,
      message: `Purchase account entries with isPaid=${isPaidBoolean} retrieved successfully`,
      count: purchaseAccounts.length,
      data: purchaseAccounts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve purchase account entries",
      error: error.message,
    });
  }
};