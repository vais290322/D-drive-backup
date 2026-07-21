import mongoose from "mongoose";
import Invoice from "../invoicemodel/invoice.model.js";
import { SngidhaLedger } from "../SnigdhaModels/snigdhaLadgerAccount.model.js";
import SnigdhaDepositCredit from "../SnigdhaModels/snigdhaDepositCredit.model.js";
import SnigdhaBank from "../SnigdhaModels/snigdhaBank.model.js";
import SnigdhaCustomerBalance from "../SnigdhaModels/SnigdhaCustomerBalance.model.js";
import SnigdhaCreditDebitNote from "../SnigdhaModels/snigdhaCreditDebitNotes.model.js";

// Create a new ledger entry

export const createLedger = async (req, res) => {
  try {
    const { invoiceId, invoiceNumber, totalAmount, paymentDetails, voucherDetails, } = req.body;

    if (!invoiceId || !invoiceNumber || !totalAmount || !paymentDetails) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided",
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
    const isVoucher = payment?.paymentMode === "Voucher";
    const isCreditNote =
      isVoucher && voucherDetails?.[0]?.noteType === "credit";

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


    // this is for reduce amount from credit/debit note and also update the customer balnce history
    if (paymentDetails[0].paymentMode === "Voucher") {
      const amount = Number(voucherDetails?.[0]?.amount);
      const noteId = voucherDetails?.[0]?.noteId;
      const creditDebitNote = await SnigdhaCreditDebitNote.findById(noteId);
      if (creditDebitNote) {
        creditDebitNote.appliedAmount += amount;
        await creditDebitNote.save();
      }

      const customerId = voucherDetails?.[0]?.customerId;
      const customerBalance = await SnigdhaCustomerBalance.findOne({ customerId });

      if (customerBalance) {
        const noteNumber = voucherDetails?.[0]?.noteNumber;

        // Find this note inside history
        const noteHistory = customerBalance.history.find(h => h.ref === noteNumber);
        if (noteHistory) {
          // Push invoiceNumber into appliedToInvoiceNumber array
          noteHistory.appliedToInvoiceNumber.push(invoiceNumber);
          noteHistory.usedInInvoice += amount;
        }

        customerBalance.appliedInvoices.push({
          invoiceNumber,
          amount,
          date: voucherDetails?.[0]?.date,
          source: "voucher",       // or credit_note / debit_note / apply
          ref: noteNumber,
          noteType: voucherDetails?.[0]?.noteType
        });

        if (noteHistory.source === "credit_note") {
          customerBalance.totalCredit -= amount;
          customerBalance.availableCredit = customerBalance.totalCredit - customerBalance.totalDebit;
        } else {
          customerBalance.totalDebit -= amount;
          customerBalance.availableCredit = customerBalance.totalCredit - customerBalance.totalDebit;
        }

        await customerBalance.save()

      }

    }

    // Calculate totalPaidAmount based on initial payment details
    let ledger = null

    if (paymentDetails[0].paymentMode === "Voucher" && voucherDetails) {

      if (voucherDetails?.[0]?.noteType === "credit") {
        let totalPaidAmount = 0;
        if (paymentDetails && paymentDetails.length > 0) {
          totalPaidAmount = paymentDetails.reduce(
            (sum, payment) => sum + Number(payment.paymentAmount),
            0
          );
        }

        const dueAmount = totalAmount - totalPaidAmount;
        const isPaid = dueAmount <= 0;

        ledger = await SngidhaLedger.create({
          invoiceId,
          invoiceNumber,
          totalAmount,
          dueAmount,
          totalPaidAmount,
          isPaid,
          paymentDetails: paymentDetails || [],
          voucherDetails: voucherDetails || [],
          totalDebitNoteAmount: 0,
          totalWithoutDebitNoteAmount: totalAmount,
          debitNoteHistory: [],
          creditApplied: paymentDetails[0].paymentAmount,
          creditNoteAdjustments: [{
            noteId: voucherDetails?.[0]?.noteId,
            noteType: voucherDetails?.[0]?.noteType,
            amount: voucherDetails?.[0]?.amount,
            date: voucherDetails?.[0]?.date,
            noteNumber: voucherDetails?.[0]?.noteNumber,
          }],
        })

      } else {
        let totalPaidAmount = 0;

        const dueAmount = totalAmount - totalPaidAmount;
        const isPaid = dueAmount <= 0;
        ledger = await SngidhaLedger.create({
          invoiceId,
          invoiceNumber,
          totalAmount,
          dueAmount,
          totalPaidAmount,
          isPaid,
          paymentDetails: paymentDetails || [],
          voucherDetails: voucherDetails || [],
          totalDebitNoteAmount: paymentDetails[0].paymentAmount,
          totalWithoutDebitNoteAmount: totalAmount,
          debitNoteHistory: [{
            referenceNumber: voucherDetails?.[0]?.noteNumber,
            amount: voucherDetails?.[0]?.amount,
            date: voucherDetails?.[0]?.date,
            noteId: voucherDetails?.[0]?.noteId,
            reason: "Debit note's amount collected"
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

      ledger = await SngidhaLedger.create({
        invoiceId,
        invoiceNumber,
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


    // Update the paidOne field in the invoice to true when ledger is created
    await Invoice.findByIdAndUpdate(
      invoiceId,
      { paidOne: true },
      { new: true }
    );

    // Create deposit credit entries for each payment detail and update bank balances
    if (paymentDetails && paymentDetails.length > 0) {
      for (const payment of paymentDetails) {
        const amount = Number(payment.paymentAmount);

        //first if voucherDetails present and here if selected note is  credit ntoe that amount don't add in bank because that is already added before
        // Payment is voucher and voucherDetails exists
        const isVoucher = payment.paymentMode === "Voucher";
        const isCreditNote = voucherDetails && voucherDetails?.[0]?.noteType === "credit";

        // ❌ If credit note → SKIP deposit + skip bank update
        if (isVoucher && isCreditNote) {
          continue;  // jump to next payment item
        }

        // ✔ Otherwise → create deposit + update bank
        await SnigdhaDepositCredit.create({
          date: new Date(payment.paymentDate),
          amount: amount,
          transactionId: payment.transactionId,
          invoiceNumber: invoiceNumber,
          invoiceType: "product",
          paymentMethod: payment.paymentMode,
          invoiceId: invoiceId,
          bankId: payment.bankId,
          noteType: voucherDetails?.[0]?.noteType || "",
        });

        // Update bank balance
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

    // Populate the invoiceId field to include invoice details in response
    const populatedLedger = await SngidhaLedger.findById(ledger._id).populate("invoiceId");

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
    const ledgers = await SngidhaLedger.find().populate("invoiceId").sort({ createdAt: -1 });

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

// Get a single ledger entry by ID
export const getLedgerById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ledger ID format",
      });
    }

    const ledger = await SngidhaLedger.findById(id).populate("invoiceId");

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

// Update a ledger entry (add payment details)
export const updateLedger1 = async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentDetails, voucherDetails } = req.body;

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
    const ledger = await SngidhaLedger.findById(id);

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
        await SnigdhaDepositCredit.create({
          date: new Date(payment.paymentDate),
          amount: amount,
          transactionId: payment.transactionId,
          invoiceNumber: ledger.invoiceNumber,
          invoiceType: "product", // Assuming invoiceType is "product" for this case
          paymentMethod: payment.paymentMode,
          invoiceId: ledger.invoiceId,
          bankId: payment.bankId
        });

        // Update bank balance
        if (payment.bankId && mongoose.Types.ObjectId.isValid(payment.bankId)) {
          const bank = await SnigdhaBank.findById(payment.bankId);
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
    // if (!ledger.invoiceType && invoiceType) {
    //   ledger.invoiceType = invoiceType;
    // }

    // Save the updated ledger
    const updatedLedger = await ledger.save();

    // Populate the invoiceId field for the response
    const populatedLedger = await SngidhaLedger.findById(updatedLedger._id).populate("invoiceId");

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

export const updateLedger = async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentDetails, voucherDetails } = req.body;

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

    if (paymentDetails[0]?.paymentMode === "Voucher") {
      if (!voucherDetails || voucherDetails.length === 0) {
        return res.status(400).json({
          success: false,
          error: true,
          message: "For voucher payment, voucherDetails are required or choose another payment method",
        });
      }
    }

    const payment1 = paymentDetails?.[0];
    const isVoucher1 = payment1?.paymentMode === "Voucher";
    const isCreditNote1 =
      isVoucher1 && voucherDetails?.[0]?.noteType === "credit";

    // 🔴 bankId required for all EXCEPT voucher + credit note
    if (!isCreditNote1) {
      if (!payment1?.bankId) {
        return res.status(400).json({
          success: false,
          error: true,
          message: "Bank is required for this payment method",
        });
      }
    }


    // Find ledger
    const ledger = await SngidhaLedger.findById(id);
    if (!ledger) {
      return res.status(404).json({
        success: false,
        message: "Ledger entry not found",
      });
    }

    const payment = paymentDetails?.[0];
    const isVoucherPayment = payment?.paymentMode === "Voucher";

    // ============================
    // 1️⃣ HANDLE VOUCHER IMPACTS
    // ============================
    if (isVoucherPayment && voucherDetails && voucherDetails.length > 0) {
      const v = voucherDetails[0];

      // --- Update Credit/Debit Note ---
      const note = await SnigdhaCreditDebitNote.findById(v.noteId);
      if (note) {
        note.appliedAmount += Number(v.amount);
        await note.save();
      }

      // --- Update CustomerBalance ---
      const customerBalance = await SnigdhaCustomerBalance.findOne({ customerId: v.customerId });

      if (customerBalance) {
        // Find matching note
        const noteHistory = customerBalance.history.find(h => h.ref === v.noteNumber);

        if (noteHistory) {
          noteHistory.appliedToInvoiceNumber.push(ledger.invoiceNumber);
          noteHistory.usedInInvoice += Number(v.amount);
        }

        // Push applied invoice entry
        customerBalance.appliedInvoices.push({
          invoiceNumber: ledger.invoiceNumber,
          amount: Number(v.amount),
          date: v.date,
          source: "voucher",
          ref: v.noteNumber,
          noteType: v.noteType
        });

        // Update totals
        if (v.noteType === "credit") {
          customerBalance.totalCredit -= Number(v.amount);
        } else {
          customerBalance.totalDebit -= Number(v.amount);
        }

        customerBalance.availableCredit = customerBalance.totalCredit - customerBalance.totalDebit;

        await customerBalance.save();
      }

      // ================================
      // 2️⃣ UPDATE LEDGER VOUCHER FIELDS
      // ================================
      if (v.noteType === "credit") {
        ledger.creditApplied += Number(v.amount);
        ledger.creditNoteAdjustments.push({
          noteId: v.noteId,
          noteType: v.noteType,
          amount: v.amount,
          date: v.date,
          noteNumber: v.noteNumber
        });
      } else {
        ledger.totalDebitNoteAmount += Number(v.amount);
        ledger.debitNoteHistory.push({
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

    ledger.paymentDetails.push(...paymentDetails);

    // ============================
    // 4️⃣ BANK CREDIT ENTRY
    // ============================
    if (!isVoucherPayment || voucherDetails?.[0]?.noteType !== "credit") {
      for (const p of paymentDetails) {
        const amount = Number(p.paymentAmount);

        await SnigdhaDepositCredit.create({
          date: new Date(p.paymentDate),
          amount,
          transactionId: p.transactionId,
          invoiceNumber: ledger.invoiceNumber,
          invoiceType: "product",
          paymentMethod: p.paymentMode,
          invoiceId: ledger.invoiceId,
          bankId: p.bankId,
          noteType: voucherDetails?.[0]?.noteType || ""
        });

        // Update bank amounts
        if (p.bankId && mongoose.Types.ObjectId.isValid(p.bankId)) {
          const bank = await SnigdhaBank.findById(p.bankId);
          if (bank) {
            bank.currentAmount += amount;
            bank.depositeAmount += amount;
            await bank.save();
          }
        }
      }
    }

    // ============================
    // 5️⃣ UPDATE TOTAL AMOUNTS
    // ============================

    // Only count real payments (cash, upi, bank, voucher-credit)
    const realPayments = ledger.paymentDetails.filter(
      (p) => p.noteType !== "debit"
    );


    ledger.totalPaidAmount = realPayments.reduce(
      (sum, p) => sum + Number(p.paymentAmount),
      0
    );

    ledger.dueAmount = ledger.totalAmount - ledger.totalPaidAmount;
    ledger.isPaid = ledger.dueAmount <= 0;

    const updatedLedger = await ledger.save();
    const populatedLedger = await SngidhaLedger.findById(updatedLedger._id).populate("invoiceId");

    res.status(200).json({
      success: true,
      message: "Ledger entry updated successfully",
      data: populatedLedger
    });

  } catch (error) {
    console.log("error from update ledger invoice controller", error);
    res.status(500).json({
      success: false,
      message: "Failed to update ledger entry",
      error: error.message
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

    const ledger = await SngidhaLedger.findByIdAndDelete(id);

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

    const ledgers = await SngidhaLedger.find({ invoiceId }).populate("invoiceId");

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