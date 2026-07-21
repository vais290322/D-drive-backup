import { ServiceAccount } from "../Models/serviceAccount.model.js";
import mongoose from "mongoose";
import Service from "../Models/service.model.js";
import DepositCredit from "../Models/depositCredit.model.js";
import Bank from "../Models/bank.model.js";
import CreditDebitNote from "../Models/creditDebitNotes.model.js";
import CustomerBalance from "../Models/customerBalance.model.js";

// Create a new service account entry modify on 09-01-2026
export const createServiceAccount = async (req, res) => {
  try {
    const { invoiceId, invoiceNumber, totalAmount, paymentDetails, invoiceType, voucherDetails } = req.body;

    // console.log("invoiceId",invoiceId)

    if (!invoiceId || !invoiceNumber || !totalAmount ) {
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
      const creditDebitNote = await CreditDebitNote.findById(noteId);
      if (creditDebitNote) {
        creditDebitNote.appliedAmount += amount;
        await creditDebitNote.save();
      }

      const customerId = voucher?.customerId;
      const customer = await CustomerBalance.findOne({ customerId });
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

        ledger = await ServiceAccount.create({
          invoiceId,
          invoiceNumber,
          totalAmount,
          dueAmount,
          totalPaidAmount,
          invoiceType:"service",
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
        ledger = await ServiceAccount.create({
          invoiceId,
          invoiceNumber,
          totalAmount,
          dueAmount,
          totalPaidAmount,
          invoiceType:"service",
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

      ledger = await ServiceAccount.create({
        invoiceId,
        invoiceNumber,
        totalAmount,
        dueAmount,
        totalPaidAmount,
        invoiceType:"service",
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
    await Service.findByIdAndUpdate(
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
        await DepositCredit.create({
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
          const bank = await Bank.findById(payment.bankId);
          if (bank) {
            bank.currentAmount += amount;
            bank.depositeAmount += amount;
            await bank.save();
          }
        }
      }
    }


    // Populate the invoiceId field to include service details in response
    const populatedServiceAccount = await ServiceAccount.findById(ledger._id).populate("invoiceId");

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
export const updateServiceAccountOld = async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentDetails, invoiceType } = req.body;

    // console.log("req : ", invoiceType);

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
          console.log("payment from service acccount : ", typeof (payment.paymentAmount))
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

export const updateServiceAccount = async (req, res) => {

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

    const ledger = await ServiceAccount.findById(id);
    if (!ledger) {
      return res.status(404).json({
        success: false,
        message: "Service ledger entry not found",
      });
    }

    if (isVoucher && voucherDetails && voucherDetails.length > 0) {

      const note = await CreditDebitNote.findById(voucher.noteId);
      if (note) {
        note.appliedAmount += Number(voucher.amount);
        await note.save();
      }

      // --- Update CustomerBalance ---
      const customerBalance = await CustomerBalance.findOne({ customerId: voucher.customerId });

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

        await DepositCredit.create({
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
          const bank = await Bank.findById(p.bankId);
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

    const populatedLedger = await ServiceAccount.findById(updatedLedger._id).populate("invoiceId");

    res.status(200).json({
      success: true,
      message: "Service ledger updated successfully",
      data: populatedLedger,
    });

  } catch (error) {
    console.log("error from update service ledger controller", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update service ledger entry",
      error: error.message
    });
  }

}



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