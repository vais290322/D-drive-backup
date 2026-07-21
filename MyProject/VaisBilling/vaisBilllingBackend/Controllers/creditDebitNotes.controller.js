import CreditDebitNote from "../Models/creditDebitNotes.model.js";
import InvoiceMns from "../invoicemodel/invoice-mns.model.js";
import { Ledger } from "../Models/ledgerAccount.model.js";
import Bank from "../Models/bank.model.js";
import Service from "../Models/service.model.js";
import { ServiceAccount } from "../Models/serviceAccount.model.js";
import MnsPurchaseOrderNew from "../Models/mnsPurchaseOrderNew.model.js";
import PurchaseAccount from "../Models/purchaseAccount.model.js";
import mongoose from "mongoose"; 

// Generate a unique reference number
const generateReferenceNumber = async (noteType) => {
  const prefix = noteType === 'credit' ? 'CN' : 'DN';
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  
  // Get the count of existing notes of this type
  const count = await CreditDebitNote.countDocuments({ noteType });
  const sequence = (count + 1).toString().padStart(4, '0');
  
  return `${prefix}${year}${month}-${sequence}`;
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
        message: "type must be either 'product', 'service', or 'purchase'"
      });
    }

    // Generate reference number
    const referenceNumber = await generateReferenceNumber(noteType);

    // Create the note
    const newNote = await CreditDebitNote.create([{
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
    
    console.error(`Error creating ${req.body.noteType} note:`, error);
    return res.status(500).json({
      success: false,
      message: `Error creating ${req.body.noteType} note`,
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
    const note = await CreditDebitNote.findById(id).session(session);
    
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
      const invoice = await InvoiceMns.findOne({ invoiceNumber: note.invoiceNumber }).session(session);
      
      if (!invoice) {
        await session.abortTransaction();
        session.endSession();
        return res.status(404).json({
          success: false,
          message: "Invoice not found"
        });
      }

      // Update invoice grandTotal based on noteType
      if (note.noteType === 'credit') {
        invoice.grandTotal -= note.amount;
        invoice.totalPayableAmount -= note.amount;
      } else { // debit note
        invoice.grandTotal += note.amount;
        invoice.totalPayableAmount += note.amount;
      }
      
      await invoice.save({ session });

      // Check if invoice exists in ledger
      const ledgerEntry = await Ledger.findOne({ invoiceNumber: note.invoiceNumber }).session(session);
      
      if (ledgerEntry) {
        // Update ledger totalAmount based on noteType
        if (note.noteType === 'credit') {
          ledgerEntry.totalAmount -= note.amount;
        } else { // debit note
          ledgerEntry.totalAmount += note.amount;
        }
        
        // Recalculate dueAmount
        ledgerEntry.dueAmount = ledgerEntry.totalAmount - ledgerEntry.totalPaidAmount;
        
        // Update isPaid status
        ledgerEntry.isPaid = ledgerEntry.dueAmount <= 0;
        
        await ledgerEntry.save({ session });
      }

      // Update bank totalProductsNotesAmount
      const banks = await Bank.find().session(session);
      
      if (banks.length > 0) {
        // Get the first bank (or you could specify which bank to update)
        const bank = banks[0];
        
        if (note.noteType === 'credit') {
          bank.totalProductsNotesAmount -= note.amount;
          
          // If ledger entry exists and is paid, update bank currentAmount
          if (ledgerEntry && ledgerEntry.isPaid) {
            bank.currentAmount -= note.amount;
          }
        } else { // debit note
          bank.totalProductsNotesAmount += note.amount;
          
          // If ledger entry exists and is paid, update bank currentAmount
          // if (ledgerEntry && ledgerEntry.isPaid) {
          //   bank.currentAmount += note.amount;
          // }
        }
        
        await bank.save({ session });
      }
    } 
    else if (note.type === 'service') {
      // Find the service
      const service = await Service.findOne({ invoiceNumber: note.invoiceNumber }).session(session);
      
      if (!service) {
        await session.abortTransaction();
        session.endSession();
        return res.status(404).json({
          success: false,
          message: "Service not found"
        });
      }

      // Update service grandTotal based on noteType
      if (note.noteType === 'credit') {
        service.total.grandTotal -= note.amount;
        if (service.total.totalPayableAmount !== undefined) {
          service.total.totalPayableAmount -= note.amount;
        }
      } else { // debit note
        service.total.grandTotal += note.amount;
        if (service.total.totalPayableAmount !== undefined) {
          service.total.totalPayableAmount += note.amount;
        }
      }
      
      await service.save({ session });

      // Check if service exists in serviceAccount
      const serviceAccount = await ServiceAccount.findOne({ invoiceNumber: note.invoiceNumber }).session(session);
      
      if (serviceAccount) {
        // Update serviceAccount totalAmount based on noteType
        if (note.noteType === 'credit') {
          serviceAccount.totalAmount -= note.amount;
        } else { // debit note
          serviceAccount.totalAmount += note.amount;
        }
        
        // Recalculate dueAmount
        serviceAccount.dueAmount = serviceAccount.totalAmount - serviceAccount.totalPaidAmount;
        
        // Update isPaid status
        serviceAccount.isPaid = serviceAccount.dueAmount <= 0;
        
        await serviceAccount.save({ session });
      }

      // Update bank totalServicesNotesAmount
      const banks = await Bank.find().session(session);
      
      if (banks.length > 0) {
        // Get the first bank (or you could specify which bank to update)
        const bank = banks[0];
        
        if (note.noteType === 'credit') {
          bank.totalServicesNotesAmount -= note.amount;
          
          // If serviceAccount entry exists and is paid, update bank currentAmount
          // if (serviceAccount && serviceAccount.isPaid) {
          //   bank.currentAmount -= note.amount;
          // }
        } else { // debit note
          bank.totalServicesNotesAmount += note.amount;
          
          // If serviceAccount entry exists and is paid, update bank currentAmount
          if (serviceAccount && serviceAccount.isPaid) {
            bank.currentAmount += note.amount;
          }
        }
        
        await bank.save({ session });
      }
    } 
    else if (note.type === 'purchase') {
      // Find the purchase order
      const purchaseOrder = await MnsPurchaseOrderNew.findOne({ invoiceNumber: note.invoiceNumber }).session(session);
      
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

      // Check if purchase order exists in purchaseAccount
      const purchaseAccount = await PurchaseAccount.findOne({ invoiceNumber: note.invoiceNumber }).session(session);
      
      if (purchaseAccount) {
        // Update purchaseAccount totalAmount based on noteType
        if (note.noteType === 'credit') {
          purchaseAccount.totalAmount -= note.amount;
        } else { // debit note
          purchaseAccount.totalAmount += note.amount;
        }
        
        // Recalculate dueAmount
        purchaseAccount.dueAmount = purchaseAccount.totalAmount - purchaseAccount.totalPaidAmount;
        
        // Update isPaid status
        purchaseAccount.isPaid = purchaseAccount.dueAmount <= 0;
        
        await purchaseAccount.save({ session });
      }

      // Update bank totalPurchasesNotesAmount
      const banks = await Bank.find().session(session);
      
      if (banks.length > 0) {
        // Get the first bank (or you could specify which bank to update)
        const bank = banks[0];
        
        if (note.noteType === 'credit') {
          bank.totalPurchasesNotesAmount -= note.amount;
          
          // If purchaseAccount entry exists and is paid, update bank currentAmount
          if (purchaseAccount && purchaseAccount.isPaid) {
            bank.currentAmount += note.amount; // For purchases, we add to bank when amount decreases
          }
        } else { // debit note
          bank.totalPurchasesNotesAmount += note.amount;
          
          // If purchaseAccount entry exists and is paid, update bank currentAmount
          // if (purchaseAccount && purchaseAccount.isPaid) {
          //   bank.currentAmount -= note.amount; // For purchases, we deduct from bank when amount increases
          // }
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
    
    // Find and update the note
    const note = await CreditDebitNote.findByIdAndUpdate(
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
    const notes = await CreditDebitNote.find().sort({ createdAt: -1 });

     // Array to store notes with invoice details
     const notesWithInvoiceDetails = [];
    
     // Process each note to add invoice details
     for (const note of notes) {
       let invoiceDetails = null;
       
       // Get invoice details based on note type
       if (note.type === 'product') {
         invoiceDetails = await InvoiceMns.findOne({ invoiceNumber: note.invoiceNumber });
       } else if (note.type === 'service') {
         invoiceDetails = await Service.findOne({ invoiceNumber: note.invoiceNumber });
       } else if (note.type === 'purchase') {
         invoiceDetails = await MnsPurchaseOrderNew.findOne({ invoiceNumber: note.invoiceNumber });
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
    
    const note = await CreditDebitNote.findById(id);
    
    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found"
      });
    }

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found"
      });
    }
    
    // Get invoice details based on note type
    let invoiceDetails = null;
    if (note.type === 'product') {
      invoiceDetails = await InvoiceMns.findOne({ invoiceNumber: note.invoiceNumber });
    } else if (note.type === 'service') {
      invoiceDetails = await Service.findOne({ invoiceNumber: note.invoiceNumber });
    } else if (note.type === 'purchase') {
      invoiceDetails = await MnsPurchaseOrderNew.findOne({ invoiceNumber: note.invoiceNumber }); 
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
    const note = await CreditDebitNote.findById(id);
    
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
    await CreditDebitNote.findByIdAndDelete(id);
    
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