import SnigdhaCreditDebitNote from "../SnigdhaModels/snigdhaCreditDebitNotes.model.js";
import Invoice from "../invoicemodel/invoice.model.js";
import SnigdhaServiceInvoice from "../SnigdhaModels/snigdhaServiceInvoice.model.js";
import SnigdhaPurchaseOrderNew from "../SnigdhaModels/SnigdhaPurchaseOrderNew.model.js";
import { SngidhaLedger } from "../SnigdhaModels/snigdhaLadgerAccount.model.js";
import { SngidhaServiceLedger } from "../SnigdhaModels/snigdhaServiceLedgerAccount.model.js";
import SnigdhaPurchaseAccount from "../SnigdhaModels/snigdhaPurchaseAccount.model.js";
import SnigdhaBank from "../SnigdhaModels/snigdhaBank.model.js";
import SnigdhaCustomerBalance from "../SnigdhaModels/SnigdhaCustomerBalance.model.js";
import SnigdhaVendorBalance from "../SnigdhaModels/SnigdhaVendorBalance.model.js";
import SnigdhaItem from "../SnigdhaModels/snigdhaItem.model.js";

import mongoose from "mongoose";

// Helper function to generate reference number
export const generateReferenceNumber = async (noteType) => {
  try {
    const prefix = noteType === "credit" ? "SCN" : "SDN";
    const year = new Date().getFullYear().toString().slice(-2);

    // Find last created note for this type & year
    const lastNote = await SnigdhaCreditDebitNote.findOne({
      noteType,
      referenceNumber: { $regex: `^${prefix}${year}-` }
    })
      .sort({ createdAt: -1 })
      .select("referenceNumber");

    let nextSeq = 1;

    if (lastNote?.referenceNumber) {
      const lastSeq = parseInt(
        lastNote.referenceNumber.split("-")[1],
        10
      );
      nextSeq = lastSeq + 1;
    }

    const sequentialNumber = nextSeq.toString().padStart(4, "0");

    return `${prefix}${year}-${sequentialNumber}`;
  } catch (error) {
    console.error("Error generating reference number:", error);
    throw error;
  }
};

// Helper function to update customer balance
const updateCustomerBalance = async (customerId, customerName, amount, source, ref, session,invoiceNumber) => {
  try {
    let customerBalance = await SnigdhaCustomerBalance.findOne({ customerId }).session(session);

    if (!customerBalance) {
      customerBalance = new SnigdhaCustomerBalance({
        customerId,
        customerName,
        availableCredit: 0,
        totalCredit: 0,
        totalDebit: 0,
        history: [],
        appliedInvoices: []
      });
    }

    if (source === 'credit_note') {
      customerBalance.availableCredit += amount;
      customerBalance.totalCredit += amount;
    } else if (source === 'debit_note') {
      customerBalance.availableCredit -= amount;
      customerBalance.totalDebit += amount;
    }

    customerBalance.history.push({
      source,
      ref,
      invoiceNumber,
      amount,
      appliedToInvoiceNumber: [],
      date: new Date()
    });

    await customerBalance.save({ session });
    return customerBalance;
  } catch (error) {
    console.error("Error updating customer balance:", error);
    throw error;
  }
};

// Helper function to update vendor balance
const updateVendorBalance = async (vendorId, vendorName, amount, source, ref, session,invoiceNumber) => {
  try {
    let vendorBalance = await SnigdhaVendorBalance.findOne({ vendorId }).session(session);

    if (!vendorBalance) {
      vendorBalance = new SnigdhaVendorBalance({
        vendorId,
        vendorName,
        availableCredit: 0,
        totalCredit: 0,
        totalDebit: 0,
        history: [],
        appliedInvoices: [],
      });
    }

    if (source === 'credit_note') {
      // For vendors, credit note means we owe them less (we returned goods)
      vendorBalance.availableCredit += amount;
      vendorBalance.totalCredit += amount;
    } else if (source === 'debit_note') {
      // Debit note means we owe them more (additional goods received)
      vendorBalance.availableCredit -= amount;
      vendorBalance.totalDebit += amount;
    }

    vendorBalance.history.push({
      source,
      ref,
      invoiceNumber,
      amount,
      appliedToInvoiceNumber: [],
      date: new Date()
    });

    await vendorBalance.save({ session });
    return vendorBalance;
  } catch (error) {
    console.error("Error updating vendor balance:", error);
    throw error;
  }
};

// Create a new credit/debit note
export const createCreditDebitNote = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      title,
      date,
      noteType,
      description,
      invoiceNumber,
      amount,
      type,
      reason,
      products,
      invoiceDetails,
      totalGrossAmount,
      totalTaxAmount,
      totalAfter,
      totalFinalAmount,
      totalBefore,
    } = req.body;

    // Validate required fields
    const requiredFields = ['title', 'date', 'noteType', 'description', 'invoiceNumber', 'amount', 'type', 'reason'];
    const missingFields = requiredFields.filter(field => !req.body[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Required fields missing: ${missingFields.join(', ')}`
      });
    }

    const exitingNote = await SnigdhaCreditDebitNote.findOne({ invoiceNumber }).session(session);
    if(exitingNote){
      return res.status(400).json({
        success: false,
        message: "Note already exists for this invoice"
      });
    }

    // Validate noteType
    if (!['credit', 'debit'].includes(noteType)) {
      return res.status(400).json({
        success: false,
        message: "noteType must be either 'credit' or 'debit'"
      });
    }

    // Validate type
    if (!['product', 'service', 'purchase'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: "type must be one of 'product', 'service', or 'purchase'"
      });
    }

    // Validate products array if provided
    if (products && Array.isArray(products)) {
      for (let i = 0; i < products.length; i++) {
        const product = products[i];
        const productRequiredFields = ['itemId', , 'originalQuantity', 'originalSellingPrice', 'newQuantity', 'newSellingPrice', 'editedAmount', 'grossAmount', 'totalAmount'];
        const missingProductFields = productRequiredFields.filter(field => !product[field] && product[field] !== 0);

        if (missingProductFields.length > 0) {
          return res.status(400).json({
            success: false,
            message: `Required fields missing in product ${i + 1}: ${missingProductFields.join(', ')}`
          });
        }
      }
    }

    // Generate reference number
    const referenceNumber = await generateReferenceNumber(noteType);

    // Prepare note data
    const noteData = {
      title,
      date: new Date(date),
      noteType,
      description,
      invoiceNumber,
      amount,
      type,
      reason,
      referenceNumber,
      totalBefore,
      totalAfter,
      totalFinalAmount,
      status: 'pending'
    };

    // Add optional fields if provided
    if (products && Array.isArray(products) && products.length > 0) {
      noteData.products = products;
    }

    if (invoiceDetails) {
      noteData.invoiceDetails = invoiceDetails;
    }

    if (totalGrossAmount !== undefined && totalGrossAmount !== null) {
      noteData.totalGrossAmount = totalGrossAmount;
    }

    if (totalTaxAmount !== undefined && totalTaxAmount !== null) {
      noteData.totalTaxAmount = totalTaxAmount;
    }

    // Create the note
    const newNote = await SnigdhaCreditDebitNote.create([noteData], { session });

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      success: true,
      message: `${noteType.charAt(0).toUpperCase() + noteType.slice(1)} note created successfully`,
      data: newNote[0]
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    console.error("Error creating note:", error);
    return res.status(500).json({
      success: false,
      message: "Error creating note",
      error: error.message
    });
  }
};

// Approve a credit/debit note
export const approveCreditDebitNote = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid note ID format"
      });
    }

    // Find the note
    const note = await SnigdhaCreditDebitNote.findById(id).session(session);

    if (!note) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        success: false,
        message: "Note not found"
      });
    }

    // Check if note is already approved
    if (note.status === 'approved') {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: "Note is already approved"
      });
    }

    const finalAmount = Math.abs(Number(note?.totalFinalAmount));

    // Process based on note type
    if (note.type === 'product') {
      // Find the invoice
      const invoice = await Invoice.findOne({ invoiceNumber: note.invoiceNumber }).session(session);

      if (!invoice) {
        await session.abortTransaction();
        session.endSession();
        return res.status(404).json({
          success: false,
          message: "Invoice not found"
        });
      }

      // Adjust inventory for product type and this new modification on 08-12-2025
      if (note.products && Array.isArray(note.products) && note.products.length > 0) {
        for (const product of note.products) {
          // Find the original item from invoice
          const invoiceItem = invoice.items.find(item => item.id === product.itemId);

          if (invoiceItem) {
            // Calculate the quantity difference
            const originalQuantity = product.originalQuantity || 0;
            const newQuantity = product.newQuantity || 0;
            const quantityDifference = originalQuantity - newQuantity;

            // Update inventory in SnigdhaItem
            const inventoryItem = await SnigdhaItem.findOne({ item_id: product.itemId }).session(session);

            if (inventoryItem) {
              if (note.noteType === 'credit') {
                // Credit note: items returned, so decrease totalSales (increase inventory)
                inventoryItem.totalSales -= quantityDifference;
                inventoryItem.quantity += quantityDifference;
              } else {
                // Debit note: additional items sold, so increase totalSales (decrease inventory)
                inventoryItem.totalSales += quantityDifference;
                inventoryItem.quantity -= quantityDifference;
              }

              // Recalculate remaining quantity
              inventoryItem.totalRemainingQty =
                inventoryItem.openingStock +
                inventoryItem.totalPurchase -
                inventoryItem.totalSales -
                inventoryItem.totalDamageQty;

              await inventoryItem.save({ session });
            }
          }
        }
      }

      // Update ledger
      // const ledgerEntry = await SngidhaLedger.findOne({ invoiceNumber: note.invoiceNumber }).session(session);

      // if (ledgerEntry) {
        // Update ledger totalAmount based on noteType
        if (note.noteType === 'credit') {
          // ledgerEntry.totalAmount -= note.amount;
          await updateCustomerBalance(
            invoice.receiverDetails.id,
            invoice.receiverDetails.name,
            // note.amount,
            finalAmount || note.amount,
            'credit_note',
            note.referenceNumber,
            session,
            note.invoiceNumber
          );
        } else { // debit note on 10-11-2025
          // ledgerEntry.totalDebitNoteAmount += note.amount;
          // ledgerEntry.totalAmount += note.amount;
          // ledgerEntry.dueAmount += note.amount;
          // ledgerEntry.isPaid= ledgerEntry.dueAmount <=0;  
          
          // ledgerEntry.debitNoteHistory.push({
          //   referenceNumber: note.referenceNumber,
          //   amount: note.amount,
          //   date: new Date(),
          //   reason: note.reason
          // });
          await updateCustomerBalance(
            invoice.receiverDetails.id,
            invoice.receiverDetails.name,
            // note.amount,
            finalAmount || note.amount,
            'debit_note',
            note.referenceNumber,
            session,
            note.invoiceNumber
          );
        }


      // Update bank
      const banks = await SnigdhaBank.find().session(session);

      if (banks.length > 0) {
        const bank = banks[0];

        if (note.noteType === 'credit') {
          // bank.totalProductsNotesAmount += note.amount;
          bank.totalProductsNotesAmount += finalAmount || note.amount;
        } else { // debit note
          // bank.totalProductsNotesAmount -= note.amount;
          bank.totalProductsNotesAmount -= finalAmount || note.amount;
        }

        await bank.save({ session });
      }
    }
    else if (note.type === 'service') {
      // Find the service
      const service = await SnigdhaServiceInvoice.findOne({ invoiceNumber: note.invoiceNumber }).session(session);

      if (!service) {
        await session.abortTransaction();
        session.endSession();
        return res.status(404).json({
          success: false,
          message: "Service invoice not found"
        });
      }

      if(note.noteType === "credit"){
        await updateCustomerBalance(
          service.receiverDetails?.id,
          service.receiverDetails?.name,
          // note.amount,
          finalAmount || note.amount,
          'credit_note',
          note.referenceNumber,
          session,
          service.invoiceNumber
        );
      }else{
        await updateCustomerBalance(
          service.receiverDetails?.id,
          service.receiverDetails?.name,
          // note.amount,
          finalAmount || note.amount,
          'debit_note',
          note.referenceNumber,
          session,
          service.invoiceNumber
        );
      }

      // Update service grandTotal and totalPayableAmount based on noteType
      // if (note.noteType === 'credit') {
      //   service.grandTotal -= note.amount;
      //   service.totalPayableAmount = service.grandTotal;
      // } else { // debit note
      //   service.grandTotal += note.amount;
      //   service.totalPayableAmount = service.grandTotal;
      // }

      // await service.save({ session });

      // Update service ledger
      // const serviceLedgerEntry = await SngidhaServiceLedger.findOne({ invoiceNumber: note.invoiceNumber }).session(session);

      // if (serviceLedgerEntry) {
      //   // Update ledger totalAmount based on noteType
      //   if (note.noteType === 'credit') {
      //     serviceLedgerEntry.totalAmount -= note.amount;
      //   } else { // debit note
      //     serviceLedgerEntry.totalAmount += note.amount;
      //   }

      //   // Calculate if there's an overpayment (customer paid more than new total)
      //   const overpayment = serviceLedgerEntry.totalPaidAmount - serviceLedgerEntry.totalAmount;

      //   if (note.noteType === 'credit' && overpayment > 0) {
      //     // Customer has overpaid, create/update customer balance

      //     // Cap the paid amount to total amount
      //     serviceLedgerEntry.totalPaidAmount = serviceLedgerEntry.totalAmount;
      //     serviceLedgerEntry.dueAmount = 0;
      //     serviceLedgerEntry.isPaid = true;

      //     // Add overpayment to customer balance
      //     await updateCustomerBalance(
      //       service.receiverDetails.id,
      //       service.receiverDetails.name,
      //       overpayment,
      //       'credit_note',
      //       note.referenceNumber,
      //       session
      //     );

      //     console.log(`Created customer balance of ₹${overpayment} for customer ${service.receiverDetails.name}`);
      //   } else {
      //     // Normal case: recalculate due amount
      //     serviceLedgerEntry.dueAmount = serviceLedgerEntry.totalAmount - serviceLedgerEntry.totalPaidAmount;
      //     serviceLedgerEntry.isPaid = serviceLedgerEntry.dueAmount <= 0;
      //   }

      //   // Track the adjustment in ledger (if service ledger has this field)
      //   if (serviceLedgerEntry.creditNoteAdjustments !== undefined) {
      //     if (!serviceLedgerEntry.creditNoteAdjustments) {
      //       serviceLedgerEntry.creditNoteAdjustments = [];
      //     }
      //     serviceLedgerEntry.creditNoteAdjustments.push({
      //       noteId: note._id,
      //       noteType: note.noteType,
      //       amount: note.amount,
      //       date: new Date()
      //     });
      //   }

      //   await serviceLedgerEntry.save({ session });
      // }

      // Update bank
      const banks = await SnigdhaBank.find().session(session);

      if (banks.length > 0) {
        const bank = banks[0];

        if (note.noteType === 'credit') {
          // bank.totalServicesNotesAmount += note.amount;
          bank.totalServicesNotesAmount += finalAmount || note.amount;
        } else { // debit note
          // bank.totalServicesNotesAmount -= note.amount;
          bank.totalServicesNotesAmount -= finalAmount || note.amount;
        }

        await bank.save({ session });
      }
    }
    else if (note.type === 'purchase') {
      // Find the purchase order
      const purchaseOrder = await SnigdhaPurchaseOrderNew.findOne({ invoiceNumber: note.invoiceNumber }).session(session);

      if (!purchaseOrder) {
        await session.abortTransaction();
        session.endSession();
        return res.status(404).json({
          success: false,
          message: "Purchase order not found"
        });
      }

      // Adjust inventory for purchase type and this new modification on 08-12-2025
      if (note.products && Array.isArray(note.products) && note.products.length > 0) {
        for (const product of note.products) {
          // Find the original item from purchase order
          const purchaseItem = purchaseOrder.items.find(item => item.item_id === product.itemId);

          if (purchaseItem) {
            // Calculate the quantity difference
            const originalQuantity = product.originalQuantity || 0;
            const newQuantity = product.newQuantity || 0;
            const quantityDifference = originalQuantity - newQuantity;

            // Update inventory in SnigdhaItem
            const inventoryItem = await SnigdhaItem.findOne({ item_id: product.itemId }).session(session);

            if (inventoryItem) {
              if (note.noteType === 'credit') {
                // Credit note: items returned to vendor, so decrease totalPurchase (decrease inventory)
                inventoryItem.totalPurchase -= quantityDifference;
                inventoryItem.quantity -= quantityDifference;
              } else {
                // Debit note: additional items received, so increase totalPurchase (increase inventory)
                inventoryItem.totalPurchase += quantityDifference;
                inventoryItem.quantity += quantityDifference;
              }

              // Recalculate remaining quantity
              inventoryItem.totalRemainingQty =
                inventoryItem.openingStock +
                inventoryItem.totalPurchase -
                inventoryItem.totalSales -
                inventoryItem.totalDamageQty;

              await inventoryItem.save({ session });
            }
          }
        }
      }

      if(note.noteType === "credit"){
        await updateVendorBalance(
          purchaseOrder.receiverDetails?.id,
          purchaseOrder.receiverDetails?.name,
          // note.amount,
          finalAmount || note.amount,
          'credit_note',
          note.referenceNumber,
          session,
          purchaseOrder.invoiceNumber
        );
      }else{
        await updateVendorBalance(
          purchaseOrder.receiverDetails?.id,
          purchaseOrder.receiverDetails?.name,
          // note.amount,
          finalAmount || note.amount,
          'debit_note',
          note.referenceNumber,
          session,
          purchaseOrder.invoiceNumber
        );
      }

      // // Update purchase order grandTotal based on noteType
      // if (note.noteType === 'credit') {
      //   purchaseOrder.grandTotal -= note.amount;
      // } else { // debit note
      //   purchaseOrder.grandTotal += note.amount;
      // }

      // await purchaseOrder.save({ session });

      // // Update purchase account
      // const purchaseAccount = await SnigdhaPurchaseAccount.findOne({ invoiceNumber: note.invoiceNumber }).session(session);

      // if (purchaseAccount) {
      //   // Update purchaseAccount totalAmount based on noteType
      //   if (note.noteType === 'credit') {
      //     purchaseAccount.totalAmount -= note.amount;
      //   } else { // debit note
      //     purchaseAccount.totalAmount += note.amount;
      //   }

      //   // Calculate if there's an overpayment (we paid vendor more than new total)
      //   const overpayment = purchaseAccount.totalPaidAmount - purchaseAccount.totalAmount;

      //   if (note.noteType === 'credit' && overpayment > 0) {
      //     // We have overpaid vendor, create/update vendor balance

      //     // Cap the paid amount to total amount
      //     purchaseAccount.totalPaidAmount = purchaseAccount.totalAmount;
      //     purchaseAccount.dueAmount = 0;
      //     purchaseAccount.isPaid = true;

      //     // Add overpayment to vendor balance (vendor owes us or we have credit with them)
      //     await updateVendorBalance(
      //       purchaseOrder.receiverDetails.id || purchaseOrder.receiverDetails.vendorCode,
      //       purchaseOrder.receiverDetails.name,
      //       overpayment,
      //       'credit_note',
      //       note.referenceNumber,
      //       session
      //     );

      //     console.log(`Created vendor balance of ₹${overpayment} for vendor ${purchaseOrder.receiverDetails.name}`);
      //   } else {
      //     // Normal case: recalculate due amount
      //     purchaseAccount.dueAmount = purchaseAccount.totalAmount - purchaseAccount.totalPaidAmount;
      //     purchaseAccount.isPaid = purchaseAccount.dueAmount <= 0;
      //   }

      //   // Track the adjustment in purchase account (if it has this field)
      //   if (purchaseAccount.creditNoteAdjustments !== undefined) {
      //     if (!purchaseAccount.creditNoteAdjustments) {
      //       purchaseAccount.creditNoteAdjustments = [];
      //     }
      //     purchaseAccount.creditNoteAdjustments.push({
      //       noteId: note._id,
      //       noteType: note.noteType,
      //       amount: note.amount,
      //       date: new Date()
      //     });
      //   }

      //   await purchaseAccount.save({ session });
      // }


      // Update bank
      const banks = await SnigdhaBank.find().session(session);

      if (banks.length > 0) {
        const bank = banks[0];

        if (note.noteType === 'credit') {
          // bank.totalPurchasesNotesAmount += note.amount;
          bank.totalPurchasesNotesAmount += finalAmount || note.amount;
          // bank.currentAmount += note.amount; // For purchases, credit note increases bank balance
          // bank.currentAmount += finalAmount; // For purchases, credit note increases bank balance
        } else { // debit note
          // bank.totalPurchasesNotesAmount -= note.amount;
          bank.totalPurchasesNotesAmount -= finalAmount || note.amount;
          // bank.currentAmount -= note.amount; // For purchases, debit note decreases bank balance
          // bank.currentAmount -= finalAmount; // For purchases, debit note decreases bank balance
        }

        await bank.save({ session });
      }
    }

    // Update note status to approved
    note.status = 'approved';
    await note.save({ session });

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      success: true,
      message: `${note.noteType.charAt(0).toUpperCase() + note.noteType.slice(1)} note approved successfully`,
      data: note
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    console.error("Error approving note:", error);
    return res.status(500).json({
      success: false,
      message: "Error approving note",
      error: error.message
    });
  }
};

// Reject a credit/debit note
export const rejectCreditDebitNote = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid note ID format"
      });
    }

    // Update note status to rejected
    const note = await SnigdhaCreditDebitNote.findByIdAndUpdate(
      id,
      { status: 'rejected' },
      { new: true }
    );

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: `${note.noteType.charAt(0).toUpperCase() + note.noteType.slice(1)} note rejected successfully`,
      data: note
    });
  } catch (error) {
    console.error("Error rejecting note:", error);
    return res.status(500).json({
      success: false,
      message: "Error rejecting note",
      error: error.message
    });
  }
};

// Get all credit/debit notes
export const getAllCreditDebitNotes = async (req, res) => {
  try {
    const notes = await SnigdhaCreditDebitNote.find().sort({ createdAt: -1 });

    // Array to store notes with invoice details
    const notesWithInvoiceDetails = [];

    // Process each note to add invoice details
    for (const note of notes) {
      let invoiceDetails = null;

      // Get invoice details based on note type
      if (note.type === 'product') {
        invoiceDetails = await Invoice.findOne({ invoiceNumber: note.invoiceNumber });
      } else if (note.type === 'service') {
        invoiceDetails = await SnigdhaServiceInvoice.findOne({ invoiceNumber: note.invoiceNumber });
      } else if (note.type === 'purchase') {
        invoiceDetails = await SnigdhaPurchaseOrderNew.findOne({ invoiceNumber: note.invoiceNumber });
      }

      // Add note with invoice details to array
      notesWithInvoiceDetails.push({
        ...note.toObject(),
        invoiceDetails: invoiceDetails ? invoiceDetails.toObject() : null
      });
    }

    return res.status(200).json({
      success: true,
      message: "Credit/Debit notes retrieved successfully",
      data: notesWithInvoiceDetails,
      count: notesWithInvoiceDetails.length
    });
  } catch (error) {
    console.error("Error fetching credit/debit notes:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching credit/debit notes",
      error: error.message
    });
  }
};

// Get a single credit/debit note by ID
export const getCreditDebitNoteById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid note ID format"
      });
    }

    const note = await SnigdhaCreditDebitNote.findById(id);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found"
      });
    }

    // Get invoice details based on note type
    let invoiceDetails = null;
    if (note.type === 'product') {
      invoiceDetails = await Invoice.findOne({ invoiceNumber: note.invoiceNumber });
    } else if (note.type === 'service') {
      invoiceDetails = await SnigdhaServiceInvoice.findOne({ invoiceNumber: note.invoiceNumber });
    } else if (note.type === 'purchase') {
      invoiceDetails = await SnigdhaPurchaseOrderNew.findOne({ invoiceNumber: note.invoiceNumber });
    }

    return res.status(200).json({
      success: true,
      message: "Note retrieved successfully",
      data: {
        ...note.toObject(),
        invoiceDetails: invoiceDetails ? invoiceDetails.toObject() : null
      }
    });
  } catch (error) {
    console.error("Error fetching note:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching note",
      error: error.message
    });
  }
};

// Delete a credit/debit note
export const deleteCreditDebitNote = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid note ID format"
      });
    }

    // Find the note
    const note = await SnigdhaCreditDebitNote.findById(id);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found"
      });
    }

    // Only allow deletion if note is not approved
    if (note.status === 'approved') {
      return res.status(400).json({
        success: false,
        message: "Cannot delete an approved note"
      });
    }

    // Delete the note
    await SnigdhaCreditDebitNote.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Note deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting note:", error);
    return res.status(500).json({
      success: false,
      message: "Error deleting note",
      error: error.message
    });
  }
};

export const getAllCustomerBlance = async (req,res)=>{
  // console.log("Customer balance retrieved successfully");
  try {
    const customerBlance = await SnigdhaCustomerBalance.find().sort({createdAt:-1})
    // console.log(customerBlance);
    if(!customerBlance){
      return res.status(404).json({
        success: false,
        message: "Customer balance not found"
      })
    }
    return res.status(200).json({
      success: true,
      message: "Customer balance retrieved successfully",
      data: customerBlance
    })
  } catch (error) {
    console.error("Error fetching customer balance:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching customer balance",
      error: error.message
    })
  }
}

export const getCustomerBlanceByCustomerId = async (req,res)=>{
  try {
    const {customerId} = req.params;
    const customerBlance = await SnigdhaCustomerBalance.findOne({customerId})
    if(!customerBlance){
      return res.status(404).json({
        success: false,
        message: "Customer balance not found"
      })
    }
    return res.status(200).json({
      success: true,
      message: "Customer balance retrieved successfully",
      data: customerBlance
    })
  } catch (error) {
    console.error("Error fetching customer balance:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching customer balance",
      error: error.message
    })
  }
}

export const getAllVendorBlance = async (req,res)=>{
  // console.log("Customer balance retrieved successfully");
  try {
    const vendorBlance = await SnigdhaVendorBalance.find().sort({createdAt:-1})
    // console.log(customerBlance);
    if(!vendorBlance){
      return res.status(404).json({
        success: false,
        message: "Vendor balance not found"
      })
    }
    return res.status(200).json({
      success: true,
      message: "Vendor balance retrieved successfully",
      data: vendorBlance
    })
  } catch (error) {
    console.error("Error fetching vendor balance:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching customer balance",
      error: error.message
    })
  }
}

export const getVendorBlanceByVendorId = async (req,res)=>{
  try {
    const {vendorId} = req.params;
    const vendorBlance = await SnigdhaVendorBalance.findOne({vendorId})
    if(!vendorBlance){
      return res.status(404).json({
        success: false,
        message: "Vendor balance not found"
      })
    }
    return res.status(200).json({
      success: true,
      message: "Vendor balance retrieved successfully",
      data: vendorBlance
    })
  } catch (error) {
    console.error("Error fetching vendor balance:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching vendor balance",
      error: error.message
    })
  }
}