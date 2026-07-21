import SnigdhaCreditDebitNote from "../SnigdhaModels/snigdhaCreditDebitNotes.model.js";
import Invoice from "../invoicemodel/invoice.model.js";
import SnigdhaServiceInvoice from "../SnigdhaModels/snigdhaServiceInvoice.model.js";
import SnigdhaPurchaseOrderNew from "../SnigdhaModels/SnigdhaPurchaseOrderNew.model.js";
import { SngidhaLedger } from "../SnigdhaModels/snigdhaLadgerAccount.model.js";
import { SngidhaServiceLedger } from "../SnigdhaModels/snigdhaServiceLedgerAccount.model.js";
import SnigdhaPurchaseAccount from "../SnigdhaModels/snigdhaPurchaseAccount.model.js";
import SnigdhaBank from "../SnigdhaModels/snigdhaBank.model.js";
import mongoose from "mongoose";

// Helper function to generate reference number
const generateReferenceNumber = async (noteType) => {
  try {
    // Get count of existing notes of this type
    const count = await SnigdhaCreditDebitNote.countDocuments({ noteType });
    // Generate reference number with format: CN/DN + current year + 4-digit sequential number
    const prefix = noteType === 'credit' ? 'SCN' : 'SDN';
    const year = new Date().getFullYear().toString().slice(-2);
    const sequentialNumber = (count + 1).toString().padStart(4, '0');
    return `${prefix}${year}-${sequentialNumber}`;
  } catch (error) {
    console.error("Error generating reference number:", error);
    throw error;
  }
};

// Create a new credit/debit note
export const createCreditDebitNote = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { title, date, noteType, description, invoiceNumber, amount, type, reason } = req.body;

    // Validate required fields
    const requiredFields = ['title', 'date', 'noteType', 'description', 'invoiceNumber', 'amount', 'type', 'reason'];
    const missingFields = requiredFields.filter(field => !req.body[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Required fields missing: ${missingFields.join(', ')}`
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

    // Generate reference number
    const referenceNumber = await generateReferenceNumber(noteType);

    // Create the note
    const newNote = await SnigdhaCreditDebitNote.create([{
      title,
      date: new Date(date),
      noteType,
      description,
      invoiceNumber,
      amount,
      type,
      reason,
      referenceNumber,
      status: 'pending'
    }], { session });

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
      
      // Update invoice grandTotal and totalPayableAmount based on noteType
      if (note.noteType === 'credit') {
        invoice.grandTotal -= note.amount;
        invoice.totalPayableAmount = invoice.grandTotal;
      } else { // debit note
        invoice.grandTotal += note.amount;
        invoice.totalPayableAmount = invoice.grandTotal;
      }
      
      await invoice.save({ session });
      
      // Update ledger
      const ledgerEntry = await SngidhaLedger.findOne({ invoiceNumber: note.invoiceNumber }).session(session);
      
      if (ledgerEntry) {
        // Update ledger totalAmount based on noteType
        if (note.noteType === 'credit') {
          ledgerEntry.totalAmount -= note.amount;
          ledgerEntry.dueAmount = ledgerEntry.totalAmount - ledgerEntry.totalPaidAmount;
          ledgerEntry.isPaid = ledgerEntry.dueAmount <= 0;
        } else { // debit note
          ledgerEntry.totalAmount += note.amount;
          ledgerEntry.dueAmount = ledgerEntry.totalAmount - ledgerEntry.totalPaidAmount;
          ledgerEntry.isPaid = ledgerEntry.dueAmount <= 0;
        }
        
        await ledgerEntry.save({ session });
      }
      
      // Update bank
      const banks = await SnigdhaBank.find().session(session);
      
      if (banks.length > 0) {
        const bank = banks[0];
        
        if (note.noteType === 'credit') {
          bank.totalProductsNotesAmount += note.amount;
          bank.currentAmount -= note.amount;
        } else { // debit note
          bank.totalProductsNotesAmount -= note.amount;
          bank.currentAmount += note.amount;
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
      
      // Update service grandTotal and totalPayableAmount based on noteType
      if (note.noteType === 'credit') {
        service.grandTotal -= note.amount;
        service.totalPayableAmount = service.grandTotal;
      } else { // debit note
        service.grandTotal += note.amount;
        service.totalPayableAmount = service.grandTotal;
      }
      
      await service.save({ session });
      
      // Update service ledger
      const serviceLedgerEntry = await SngidhaServiceLedger.findOne({ invoiceNumber: note.invoiceNumber }).session(session);
      
      if (serviceLedgerEntry) {
        // Update ledger totalAmount based on noteType
        if (note.noteType === 'credit') {
          serviceLedgerEntry.totalAmount -= note.amount;
          serviceLedgerEntry.dueAmount = serviceLedgerEntry.totalAmount - serviceLedgerEntry.totalPaidAmount;
          serviceLedgerEntry.isPaid = serviceLedgerEntry.dueAmount <= 0;
        } else { // debit note
          serviceLedgerEntry.totalAmount += note.amount;
          serviceLedgerEntry.dueAmount = serviceLedgerEntry.totalAmount - serviceLedgerEntry.totalPaidAmount;
          serviceLedgerEntry.isPaid = serviceLedgerEntry.dueAmount <= 0;
        }
        
        await serviceLedgerEntry.save({ session });
      }
      
      // Update bank
      const banks = await SnigdhaBank.find().session(session);
      
      if (banks.length > 0) {
        const bank = banks[0];
        
        if (note.noteType === 'credit') {
          bank.totalServicesNotesAmount += note.amount;
          bank.currentAmount -= note.amount;
        } else { // debit note
          bank.totalServicesNotesAmount -= note.amount;
          bank.currentAmount += note.amount;
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
      
      // Update purchase order grandTotal based on noteType
      if (note.noteType === 'credit') {
        purchaseOrder.grandTotal -= note.amount;
      } else { // debit note
        purchaseOrder.grandTotal += note.amount;
      }
      
      await purchaseOrder.save({ session });
      
      // Update purchase account
      const purchaseAccount = await SnigdhaPurchaseAccount.findOne({ invoiceNumber: note.invoiceNumber }).session(session);
      
      if (purchaseAccount) {
        // Update purchaseAccount totalAmount based on noteType
        if (note.noteType === 'credit') {
          purchaseAccount.totalAmount -= note.amount;
          purchaseAccount.dueAmount = purchaseAccount.totalAmount - purchaseAccount.totalPaidAmount;
          purchaseAccount.isPaid = purchaseAccount.dueAmount <= 0;
        } else { // debit note
          purchaseAccount.totalAmount += note.amount;
          purchaseAccount.dueAmount = purchaseAccount.totalAmount - purchaseAccount.totalPaidAmount;
          purchaseAccount.isPaid = purchaseAccount.dueAmount <= 0;
        }
        
        await purchaseAccount.save({ session });
      }
      
      // Update bank
      const banks = await SnigdhaBank.find().session(session);
      
      if (banks.length > 0) {
        const bank = banks[0];
        
        if (note.noteType === 'credit') {
          bank.totalPurchasesNotesAmount += note.amount;
          bank.currentAmount += note.amount; // For purchases, credit note increases bank balance
        } else { // debit note
          bank.totalPurchasesNotesAmount -= note.amount;
          bank.currentAmount -= note.amount; // For purchases, debit note decreases bank balance
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