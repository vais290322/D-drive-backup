import mongoose from "mongoose";
import SnigdhaServiceInvoice from "../SnigdhaModels/snigdhaServiceInvoice.model.js";
import { SngidhaServiceLedger } from "../SnigdhaModels/snigdhaServiceLedgerAccount.model.js";
import SnigdhaDepositCredit from "../SnigdhaModels/snigdhaDepositCredit.model.js";
import SnigdhaBank from "../SnigdhaModels/snigdhaBank.model.js";
import SnigdhaCreditDebitNote from "../SnigdhaModels/snigdhaCreditDebitNotes.model.js";
import SnigdhaCustomerBalance from "../SnigdhaModels/SnigdhaCustomerBalance.model.js";



// Create a new service ledger entry
export const createServiceLedger = async (req, res) => {
  try {
    const { invoiceId, invoiceNumber, totalAmount, paymentDetails, voucherDetails } = req.body;

    if (!invoiceId || !invoiceNumber || !totalAmount) {
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
    const voucher = voucherDetails?.[0];
    const isVoucher = payment?.paymentMode === "Voucher";
    const isCreditNote =
      isVoucher && voucher?.noteType === "credit";

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

    if (payment?.paymentMode === "Voucher") {
      const amount = Number(voucher?.amount);
      const noteId = voucher?.noteId;
      const creditDebitNote = await SnigdhaCreditDebitNote.findById(noteId);
      if (creditDebitNote) {
        creditDebitNote.appliedAmount += amount;
        await creditDebitNote.save();
      }

      const customerId = voucher?.customerId;
      const customer = await SnigdhaCustomerBalance.findOne({ customerId });
      if (customer) {
        const noteNumber = voucher?.noteNumber;
        const noteHistory = customer?.history.find(h => h.ref === noteNumber);
        if (noteHistory) {
          noteHistory.appliedToInvoiceNumber.push(invoiceNumber);
          noteHistory.usedInInvoice += amount;
        }

        customer?.appliedInvoices.push({
          invoiceNumber,
          amount,
          date: voucher?.date,
          source: "voucher",
          ref: noteNumber,
          noteType: voucher?.noteType,
        })

        if (noteHistory?.source === "credit_note") {
          customer.totalCredit -= amount;
          customer.availableCredit = customer.totalCredit - customer.totalDebit;
        } else {
          customer.totalDebit -= amount;
          customer.availableCredit = customer.totalCredit - customer.totalDebit;
        }

        await customer.save();

      }
    }

    let ledger = null;

    if (payment?.paymentMode === "Voucher" && voucher) {
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

        ledger = await SngidhaServiceLedger.create({
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
          creditApplied: payment?.paymentAmount,
          creditNoteAdjustments: [{
            noteId: voucher?.noteId,
            noteNumber: voucher?.noteNumber,
            noteType: voucher?.noteType,
            amount: voucher?.amount,
            date: voucher?.date,
            noteNumber: voucher?.noteNumber,
          }]
        })

      } else {
        let totalPaidAmount = 0;
        const dueAmount = totalAmount - totalPaidAmount;
        const isPaid = dueAmount <= 0;
        ledger = await SngidhaServiceLedger.create({
          invoiceId,
          invoiceNumber,
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
            reason: "Debit note's amount collected"
          }],
          creditApplied: 0,
          creditNoteAdjustments: []
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

      ledger = await SngidhaServiceLedger.create({
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
        creditApplied: 0,
        creditNoteAdjustments: []
      });
    }
    // Update the paidOne field in the service invoice
    await SnigdhaServiceInvoice.findByIdAndUpdate(
      invoiceId,
      { paidOne: true },
      { new: true }
    );

    // Handle deposit credits and bank updates
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
          invoiceType: "service",
          paymentMethod: payment.paymentMode,
          invoiceId: invoiceId,
          bankId: payment.bankId,
          noteType: voucherDetails?.[0]?.noteType || "",
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

    const populatedLedger = await SngidhaServiceLedger.findById(ledger._id).populate("invoiceId");

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
    const { id } = req.params;

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
export const updateServiceLedgerOld = async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentDetails } = req.body;

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
    const populatedLedger = await SngidhaServiceLedger.findById(updatedLedger._id).populate("invoiceId");

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

export const updateServiceLedger = async (req, res) => {

  const { id } = req.params;
  const { paymentDetails, voucherDetails } = req.body;

  try {
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

    const ledger = await SngidhaServiceLedger.findById(id);
    if (!ledger) {
      return res.status(404).json({
        success: false,
        message: "Service ledger entry not found",
      });
    }

    if (isVoucher && voucherDetails && voucherDetails.length > 0) {

      const note = await SnigdhaCreditDebitNote.findById(voucher.noteId);
      if (note) {
        note.appliedAmount += Number(voucher.amount);
        await note.save();
      }

      // --- Update CustomerBalance ---
      const customerBalance = await SnigdhaCustomerBalance.findOne({ customerId: voucher.customerId });

      if (customerBalance) {
        // Find matching note
        const noteHistory = customerBalance.history.find(h => h.ref === voucher.noteNumber);

        if (noteHistory) {
          noteHistory.appliedToInvoiceNumber.push(ledger.invoiceNumber);
          noteHistory.usedInInvoice += Number(voucher.amount);
        }

        // Push applied invoice entry
        customerBalance.appliedInvoices.push({
          invoiceNumber: ledger.invoiceNumber,
          amount: Number(voucher.amount),
          date: voucher.date,
          source: "voucher",
          ref: voucher.noteNumber,
          noteType: voucher.noteType
        });

        // Update totals
        if (voucher.noteType === "credit") {
          customerBalance.totalCredit -= Number(voucher.amount);
        } else {
          customerBalance.totalDebit -= Number(voucher.amount);
        }

        customerBalance.availableCredit = customerBalance.totalCredit - customerBalance.totalDebit;

        await customerBalance.save();
      }

      // ================================
      // 2️⃣ UPDATE LEDGER VOUCHER FIELDS
      // ================================
      if (voucher.noteType === "credit") {
        ledger.creditApplied += Number(voucher.amount);
        ledger.creditNoteAdjustments.push({
          noteId: voucher.noteId,
          noteType: voucher.noteType,
          amount: voucher.amount,
          date: voucher.date,
          noteNumber: voucher.noteNumber
        });
      } else {
        ledger.totalDebitNoteAmount += Number(voucher.amount);
        ledger.debitNoteHistory.push({
          referenceNumber: voucher.noteNumber,
          amount: voucher.amount,
          date: voucher.date,
          noteId: voucher.noteId,
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
    if (!isVoucher || voucherDetails?.[0]?.noteType !== "credit") {
      for (const p of paymentDetails) {
        const amount = Number(p.paymentAmount);

        await SnigdhaDepositCredit.create({
          date: new Date(p.paymentDate),
          amount,
          transactionId: p.transactionId,
          invoiceNumber: ledger.invoiceNumber,
          invoiceType: "service",
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

    const populatedLedger = await SngidhaServiceLedger.findById(updatedLedger._id).populate("invoiceId");

    res.status(200).json({
      success: true,
      message: "Service ledger updated successfully",
      data: populatedLedger,
    });

  } catch (error) {
    console.log("error from update service ledger controller", error);
    res.status(500).json({
      success: false,
      message: "Failed to update service ledger entry",
      error: error.message
    });
  }

}

// Delete service ledger
export const deleteServiceLedger = async (req, res) => {
  try {
    const { id } = req.params;

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
