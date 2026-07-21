import SnigdhaNotes from "../SnigdhaModels/snigdhaNotes.model.js";
import Invoice from "../invoicemodel/invoice.model.js"
import { SngidhaLedger } from "../SnigdhaModels/snigdhaLadgerAccount.model.js";
import SnigdhaBank from "../SnigdhaModels/snigdhaBank.model.js";
import SnigdhaPurchaseOrderNew from "../SnigdhaModels/SnigdhaPurchaseOrderNew.model.js";
import SnigdhaPurchaseAccount from "../SnigdhaModels/snigdhaPurchaseAccount.model.js";
import mongoose from "mongoose";

// Create a new note
export const createNote = async (req, res) => { 
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { title, date, amountType, description, invoiceNumber, amount, type } = req.body;

    // Validate required fields
    const requiredFields = ['title', 'date', 'amountType', 'description', 'invoiceNumber', 'amount', 'type'];
    const missingFields = requiredFields.filter(field => !req.body[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Required fields missing: ${missingFields.join(', ')}`
      });
    }

    // Validate amountType
    if (!['increase', 'decrease'].includes(amountType)) {
      return res.status(400).json({
        success: false,
        message: "amountType must be either 'increase' or 'decrease'"
      });
    }

    // Validate type
    if (!['product', 'purchase'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: "type must be either 'product' or 'purchase'"
      });
    }

    // Create the note
    const newNote = await SnigdhaNotes.create([{
      title,
      date: new Date(date),
      amountType,
      description,
      invoiceNumber,
      amount,
      type
    }], { session });

    // Process based on note type
    if (type === 'product') {
      // Find the invoice
      const invoice = await Invoice.findOne({ invoiceNumber }).session(session);
      
      if (!invoice) {
        await session.abortTransaction();
        session.endSession();
        return res.status(404).json({
          success: false,
          message: "Invoice not found"
        });
      }

      // Update invoice grandTotal based on amountType
      if (amountType === 'increase') {
        invoice.grandTotal += amount;
      } else {
        invoice.grandTotal -= amount;
      }
      
      await invoice.save({ session });

      // Check if invoice exists in ledger
      const ledgerEntry = await SngidhaLedger.findOne({ invoiceNumber }).session(session);
      
      if (ledgerEntry) {
        // Update ledger totalAmount based on amountType
        if (amountType === 'increase') {
          ledgerEntry.totalAmount += amount;
          
          // Recalculate dueAmount
          ledgerEntry.dueAmount = ledgerEntry.totalAmount - ledgerEntry.totalPaidAmount;
          
          // Update isPaid status
          ledgerEntry.isPaid = ledgerEntry.dueAmount <= 0;
        } else {
          ledgerEntry.totalAmount -= amount;
          
          // Recalculate dueAmount
          ledgerEntry.dueAmount = ledgerEntry.totalAmount - ledgerEntry.totalPaidAmount;
          
          // Update isPaid status
          ledgerEntry.isPaid = ledgerEntry.dueAmount <= 0;
        }
        
        await ledgerEntry.save({ session });
      }

      // Update bank totalProductsNotesAmount
      const banks = await SnigdhaBank.find().session(session);
      
      if (banks.length > 0) {
        // Get the first bank (or you could specify which bank to update)
        const bank = banks[0];
        
        if (amountType === 'increase') {
          bank.totalProductsNotesAmount += amount;
          
          // If ledger entry exists and is paid, update bank currentAmount
          if (ledgerEntry && ledgerEntry.isPaid) {
            bank.currentAmount += amount;
          }
        } else {
          bank.totalProductsNotesAmount -= amount;
          
          // If ledger entry exists and is paid, update bank currentAmount
          if (ledgerEntry && ledgerEntry.isPaid) {
            bank.currentAmount -= amount;
          }
        }
        
        await bank.save({ session });
      }
    } 
    else if (type === 'purchase') {
      // Find the purchase order
      const purchaseOrder = await SnigdhaPurchaseOrderNew.findOne({ invoiceNumber }).session(session);
      
      if (!purchaseOrder) {
        await session.abortTransaction();
        session.endSession();
        return res.status(404).json({
          success: false,
          message: "Purchase order not found"
        });
      }

      // Update purchase order grandTotal based on amountType
      if (amountType === 'increase') {
        purchaseOrder.grandTotal += amount;
      } else {
        purchaseOrder.grandTotal -= amount;
      }
      
      await purchaseOrder.save({ session });

      // Check if purchase order exists in purchaseAccount
      const purchaseAccount = await SnigdhaPurchaseAccount.findOne({ invoiceNumber }).session(session);
      
      if (purchaseAccount) {
        // Update purchaseAccount totalAmount based on amountType
        if (amountType === 'increase') {
          purchaseAccount.totalAmount += amount;
          
          // Recalculate dueAmount
          purchaseAccount.dueAmount = purchaseAccount.totalAmount - purchaseAccount.totalPaidAmount;
          
          // Update isPaid status
          purchaseAccount.isPaid = purchaseAccount.dueAmount <= 0;
        } else {
          purchaseAccount.totalAmount -= amount;
          
          // Recalculate dueAmount
          purchaseAccount.dueAmount = purchaseAccount.totalAmount - purchaseAccount.totalPaidAmount;
          
          // Update isPaid status
          purchaseAccount.isPaid = purchaseAccount.dueAmount <= 0;
        }
        
        await purchaseAccount.save({ session });
      }

      // Update bank totalPurchasesNotesAmount
      const banks = await SnigdhaBank.find().session(session);
      
      if (banks.length > 0) {
        // Get the first bank (or you could specify which bank to update)
        const bank = banks[0];
        
        if (amountType === 'increase') {
          bank.totalPurchasesNotesAmount += amount;
          
          // If purchaseAccount entry exists and is paid, update bank currentAmount
          if (purchaseAccount && purchaseAccount.isPaid) {
            bank.currentAmount -= amount; // For purchases, we deduct from bank when amount increases
          }
        } else {
          bank.totalPurchasesNotesAmount -= amount;
          
          // If purchaseAccount entry exists and is paid, update bank currentAmount
          if (purchaseAccount && purchaseAccount.isPaid) {
            bank.currentAmount += amount; // For purchases, we add to bank when amount decreases
          }
        }
        
        await bank.save({ session });
      }
    }

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      success: true,
      message: "Note created successfully",
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

// Get all notes
export const getAllNotes = async (req, res) => {
  try {
    const notes = await SnigdhaNotes.find().sort({ date: -1 });
    
    return res.status(200).json({
      success: true,
      message: "Notes retrieved successfully",
      data: notes,
      count: notes.length
    });
  } catch (error) {
    console.error("Error fetching notes:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching notes",
      error: error.message
    });
  }
};

// Get a single note by ID
export const getNoteById = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid note ID format"
      });
    }
    
    const note = await SnigdhaNotes.findById(id);
    
    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found"
      });
    }
    
    return res.status(200).json({
      success: true,
      message: "Note retrieved successfully",
      data: note
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

// Update a note
export const updateNote = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    const updateData = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid note ID format"
      });
    }
    
    // Find the original note
    const originalNote = await SnigdhaNotes.findById(id).session(session);
    
    if (!originalNote) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        success: false,
        message: "Note not found"
      });
    }
    
    // Validate amountType if provided
    if (updateData.amountType && !['increase', 'decrease'].includes(updateData.amountType)) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: "amountType must be either 'increase' or 'decrease'"
      });
    }
    
    // Validate type if provided
    if (updateData.type && !['product', 'purchase'].includes(updateData.type)) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: "type must be either 'product' or 'purchase'"
      });
    }
    
    // Revert changes made by the original note
    if (originalNote.type === 'product') {
      // Find the invoice
      const invoice = await Invoice.findOne({ invoiceNumber: originalNote.invoiceNumber }).session(session);
      
      if (invoice) {
        // Revert invoice grandTotal based on original amountType
        if (originalNote.amountType === 'increase') {
          invoice.grandTotal -= originalNote.amount;
        } else {
          invoice.grandTotal += originalNote.amount;
        }
        
        await invoice.save({ session });
      }

      // Check if invoice exists in ledger
      const ledgerEntry = await SngidhaLedger.findOne({ invoiceNumber: originalNote.invoiceNumber }).session(session);
      
      if (ledgerEntry) {
        // Revert ledger totalAmount based on original amountType
        if (originalNote.amountType === 'increase') {
          ledgerEntry.totalAmount -= originalNote.amount;
        } else {
          ledgerEntry.totalAmount += originalNote.amount;
        }
        
        // Recalculate dueAmount
        ledgerEntry.dueAmount = ledgerEntry.totalAmount - ledgerEntry.totalPaidAmount;
        
        // Update isPaid status
        ledgerEntry.isPaid = ledgerEntry.dueAmount <= 0;
        
        await ledgerEntry.save({ session });
      }

      // Revert bank totalProductsNotesAmount
      const banks = await SnigdhaBank.find().session(session);
      
      if (banks.length > 0) {
        const bank = banks[0];
        
        if (originalNote.amountType === 'increase') {
          bank.totalProductsNotesAmount -= originalNote.amount;
          
          // If ledger entry exists and is paid, revert bank currentAmount
          if (ledgerEntry && ledgerEntry.isPaid) {
            bank.currentAmount -= originalNote.amount;
          }
        } else {
          bank.totalProductsNotesAmount += originalNote.amount;
          
          // If ledger entry exists and is paid, revert bank currentAmount
          if (ledgerEntry && ledgerEntry.isPaid) {
            bank.currentAmount += originalNote.amount;
          }
        }
        
        await bank.save({ session });
      }
    } 
    else if (originalNote.type === 'purchase') {
      // Find the purchase order
      const purchaseOrder = await SnigdhaPurchaseOrderNew.findOne({ invoiceNumber: originalNote.invoiceNumber }).session(session);
      
      if (purchaseOrder) {
        // Revert purchase order grandTotal based on original amountType
        if (originalNote.amountType === 'increase') {
          purchaseOrder.grandTotal -= originalNote.amount;
        } else {
          purchaseOrder.grandTotal += originalNote.amount;
        }
        
        await purchaseOrder.save({ session });
      }

      // Check if purchase order exists in purchaseAccount
      const purchaseAccount = await SnigdhaPurchaseAccount.findOne({ invoiceNumber: originalNote.invoiceNumber }).session(session);
      
      if (purchaseAccount) {
        // Revert purchaseAccount totalAmount based on original amountType
        if (originalNote.amountType === 'increase') {
          purchaseAccount.totalAmount -= originalNote.amount;
        } else {
          purchaseAccount.totalAmount += originalNote.amount;
        }
        
        // Recalculate dueAmount
        purchaseAccount.dueAmount = purchaseAccount.totalAmount - purchaseAccount.totalPaidAmount;
        
        // Update isPaid status
        purchaseAccount.isPaid = purchaseAccount.dueAmount <= 0;
        
        await purchaseAccount.save({ session });
      }

      // Revert bank totalPurchasesNotesAmount
      const banks = await SnigdhaBank.find().session(session);
      
      if (banks.length > 0) {
        const bank = banks[0];
        
        if (originalNote.amountType === 'increase') {
          bank.totalPurchasesNotesAmount -= originalNote.amount;
          
          // If purchaseAccount entry exists and is paid, revert bank currentAmount
          if (purchaseAccount && purchaseAccount.isPaid) {
            bank.currentAmount += originalNote.amount; // For purchases, we add to bank when reverting an increase
          }
        } else {
          bank.totalPurchasesNotesAmount += originalNote.amount;
          
          // If purchaseAccount entry exists and is paid, revert bank currentAmount
          if (purchaseAccount && purchaseAccount.isPaid) {
            bank.currentAmount -= originalNote.amount; // For purchases, we deduct from bank when reverting a decrease
          }
        }
        
        await bank.save({ session });
      }
    }
    
    // Update the note
    const updatedNote = await SnigdhaNotes.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true, session }
    );
    
    // Apply changes based on the updated note
    const newType = updateData.type || originalNote.type;
    const newAmountType = updateData.amountType || originalNote.amountType;
    const newAmount = updateData.amount || originalNote.amount;
    const newInvoiceNumber = updateData.invoiceNumber || originalNote.invoiceNumber;
    
    if (newType === 'product') {
      // Find the invoice
      const invoice = await Invoice.findOne({ invoiceNumber: newInvoiceNumber }).session(session);
      
      if (!invoice) {
        await session.abortTransaction();
        session.endSession();
        return res.status(404).json({
          success: false,
          message: "Invoice not found"
        });
      }

      // Update invoice grandTotal based on new amountType
      if (newAmountType === 'increase') {
        invoice.grandTotal += newAmount;
      } else {
        invoice.grandTotal -= newAmount;
      }
      
      await invoice.save({ session });

      // Check if invoice exists in ledger
      const ledgerEntry = await SngidhaLedger.findOne({ invoiceNumber: newInvoiceNumber }).session(session);
      
      if (ledgerEntry) {
        // Update ledger totalAmount based on new amountType
        if (newAmountType === 'increase') {
          ledgerEntry.totalAmount += newAmount;
        } else {
          ledgerEntry.totalAmount -= newAmount;
        }
        
        // Recalculate dueAmount
        ledgerEntry.dueAmount = ledgerEntry.totalAmount - ledgerEntry.totalPaidAmount;
        
        // Update isPaid status
        ledgerEntry.isPaid = ledgerEntry.dueAmount <= 0;
        
        await ledgerEntry.save({ session });
      }

      // Update bank totalProductsNotesAmount
      const banks = await SnigdhaBank.find().session(session);
      
      if (banks.length > 0) {
        const bank = banks[0];
        
        if (newAmountType === 'increase') {
          bank.totalProductsNotesAmount += newAmount;
          
          // If ledger entry exists and is paid, update bank currentAmount
          if (ledgerEntry && ledgerEntry.isPaid) {
            bank.currentAmount += newAmount;
          }
        } else {
          bank.totalProductsNotesAmount -= newAmount;
          
          // If ledger entry exists and is paid, update bank currentAmount
          if (ledgerEntry && ledgerEntry.isPaid) {
            bank.currentAmount -= newAmount;
          }
        }
        
        await bank.save({ session });
      }
    } 
    else if (newType === 'purchase') {
      // Find the purchase order
      const purchaseOrder = await SnigdhaPurchaseOrderNew.findOne({ invoiceNumber: newInvoiceNumber }).session(session);
      
      if (!purchaseOrder) {
        await session.abortTransaction();
        session.endSession();
        return res.status(404).json({
          success: false,
          message: "Purchase order not found"
        });
      }

      // Update purchase order grandTotal based on new amountType
      if (newAmountType === 'increase') {
        purchaseOrder.grandTotal += newAmount;
      } else {
        purchaseOrder.grandTotal -= newAmount;
      }
      
      await purchaseOrder.save({ session });

      // Check if purchase order exists in purchaseAccount
      const purchaseAccount = await SnigdhaPurchaseAccount.findOne({ invoiceNumber: newInvoiceNumber }).session(session);
      
      if (purchaseAccount) {
        // Update purchaseAccount totalAmount based on new amountType
        if (newAmountType === 'increase') {
          purchaseAccount.totalAmount += newAmount;
        } else {
          purchaseAccount.totalAmount -= newAmount;
        }
        
        // Recalculate dueAmount
        purchaseAccount.dueAmount = purchaseAccount.totalAmount - purchaseAccount.totalPaidAmount;
        
        // Update isPaid status
        purchaseAccount.isPaid = purchaseAccount.dueAmount <= 0;
        
        await purchaseAccount.save({ session });
      }

      // Update bank totalPurchasesNotesAmount
      const banks = await SnigdhaBank.find().session(session);
      
      if (banks.length > 0) {
        const bank = banks[0];
        
        if (newAmountType === 'increase') {
          bank.totalPurchasesNotesAmount += newAmount;
          
          // If purchaseAccount entry exists and is paid, update bank currentAmount
          if (purchaseAccount && purchaseAccount.isPaid) {
            bank.currentAmount -= newAmount; // For purchases, we deduct from bank when amount increases
          }
        } else {
          bank.totalPurchasesNotesAmount -= newAmount;
          
          // If purchaseAccount entry exists and is paid, update bank currentAmount
          if (purchaseAccount && purchaseAccount.isPaid) {
            bank.currentAmount += newAmount; // For purchases, we add to bank when amount decreases
          }
        }
        
        await bank.save({ session });
      }
    }

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      success: true,
      message: "Note updated successfully",
      data: updatedNote
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    
    console.error("Error updating note:", error);
    return res.status(500).json({
      success: false,
      message: "Error updating note",
      error: error.message
    });
  }
};

// Delete a note
export const deleteNote = async (req, res) => {
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
    
    // Find the note to be deleted
    const note = await SnigdhaNotes.findById(id).session(session);
    
    if (!note) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        success: false,
        message: "Note not found"
      });
    }
    
    // Revert changes made by the note
    if (note.type === 'product') {
      // Find the invoice
      const invoice = await Invoice.findOne({ invoiceNumber: note.invoiceNumber }).session(session);
      
      if (invoice) {
        // Revert invoice grandTotal based on amountType
        if (note.amountType === 'increase') {
          invoice.grandTotal -= note.amount;
        } else {
          invoice.grandTotal += note.amount;
        }
        
        await invoice.save({ session });
      }

      // Check if invoice exists in ledger
      const ledgerEntry = await SngidhaLedger.findOne({ invoiceNumber: note.invoiceNumber }).session(session);
      
      if (ledgerEntry) {
        // Revert ledger totalAmount based on amountType
        if (note.amountType === 'increase') {
          ledgerEntry.totalAmount -= note.amount;
        } else {
          ledgerEntry.totalAmount += note.amount;
        }
        
        // Recalculate dueAmount
        ledgerEntry.dueAmount = ledgerEntry.totalAmount - ledgerEntry.totalPaidAmount;
        
        // Update isPaid status
        ledgerEntry.isPaid = ledgerEntry.dueAmount <= 0;
        
        await ledgerEntry.save({ session });
      }

      // Revert bank totalProductsNotesAmount
      const banks = await SnigdhaBank.find().session(session);
      
      if (banks.length > 0) {
        const bank = banks[0];
        
        if (note.amountType === 'increase') {
          bank.totalProductsNotesAmount -= note.amount;
          
          // If ledger entry exists and is paid, revert bank currentAmount
          if (ledgerEntry && ledgerEntry.isPaid) {
            bank.currentAmount -= note.amount;
          }
        } else {
          bank.totalProductsNotesAmount += note.amount;
          
          // If ledger entry exists and is paid, revert bank currentAmount
          if (ledgerEntry && ledgerEntry.isPaid) {
            bank.currentAmount += note.amount;
          }
        }
        
        await bank.save({ session });
      }
    } 
    else if (note.type === 'purchase') {
      // Find the purchase order
      const purchaseOrder = await SnigdhaPurchaseOrderNew.findOne({ invoiceNumber: note.invoiceNumber }).session(session);
      
      if (purchaseOrder) {
        // Revert purchase order grandTotal based on amountType
        if (note.amountType === 'increase') {
          purchaseOrder.grandTotal -= note.amount;
        } else {
          purchaseOrder.grandTotal += note.amount;
        }
        
        await purchaseOrder.save({ session });
      }

      // Check if purchase order exists in purchaseAccount
      const purchaseAccount = await SnigdhaPurchaseAccount.findOne({ invoiceNumber: note.invoiceNumber }).session(session);
      
      if (purchaseAccount) {
        // Revert purchaseAccount totalAmount based on amountType
        if (note.amountType === 'increase') {
          purchaseAccount.totalAmount -= note.amount;
        } else {
          purchaseAccount.totalAmount += note.amount;
        }
        
        // Recalculate dueAmount
        purchaseAccount.dueAmount = purchaseAccount.totalAmount - purchaseAccount.totalPaidAmount;
        
        // Update isPaid status
        purchaseAccount.isPaid = purchaseAccount.dueAmount <= 0;
        
        await purchaseAccount.save({ session });
      }

      // Revert bank totalPurchasesNotesAmount
      const banks = await SnigdhaBank.find().session(session);
      
      if (banks.length > 0) {
        const bank = banks[0];
        
        if (note.amountType === 'increase') {
          bank.totalPurchasesNotesAmount -= note.amount;
          
          // If purchaseAccount entry exists and is paid, revert bank currentAmount
          if (purchaseAccount && purchaseAccount.isPaid) {
            bank.currentAmount += note.amount; // For purchases, we add to bank when reverting an increase
          }
        } else {
          bank.totalPurchasesNotesAmount += note.amount;
          
          // If purchaseAccount entry exists and is paid, revert bank currentAmount
          if (purchaseAccount && purchaseAccount.isPaid) {
            bank.currentAmount -= note.amount; // For purchases, we deduct from bank when reverting a decrease
          }
        }
        
        await bank.save({ session });
      }
    }
    
    // Delete the note
    await SnigdhaNotes.findByIdAndDelete(id).session(session);
    
    await session.commitTransaction();
    session.endSession();
    
    return res.status(200).json({
      success: true,
      message: "Note deleted successfully"
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    
    console.error("Error deleting note:", error);
    return res.status(500).json({
      success: false,
      message: "Error deleting note",
      error: error.message
    });
  }
};

// Get notes by type
export const getNotesByType = async (req, res) => {
  try {
    const { type } = req.params;
    
    if (!['product', 'purchase'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: "type must be either 'product' or 'purchase'"
      });
    }
    
    const notes = await SnigdhaNotes.find({ type }).sort({ date: -1 });
    
    return res.status(200).json({
      success: true,
      message: `Notes of type '${type}' retrieved successfully`,
      data: notes,
      count: notes.length
    });
  } catch (error) {
    console.error("Error fetching notes by type:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching notes by type",
      error: error.message
    });
  }
};

// Get notes by invoice number
export const getNotesByInvoiceNumber = async (req, res) => {
  try {
    const { invoiceNumber } = req.params;
    
    const notes = await SnigdhaNotes.find({ invoiceNumber }).sort({ date: -1 });
    
    return res.status(200).json({
      success: true,
      message: `Notes for invoice '${invoiceNumber}' retrieved successfully`,
      data: notes,
      count: notes.length
    });
  } catch (error) {
    console.error("Error fetching notes by invoice number:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching notes by invoice number",
      error: error.message
    });
  }
};

// ... existing code ...

// Get notes by date range
export const getNotesByDateRange = async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      
      if (!startDate || !endDate) {
        return res.status(400).json({
          success: false,
          message: "Both startDate and endDate are required"
        });
      }
      
      const notes = await SnigdhaNotes.find({
        date: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      }).sort({ date: -1 });
      
      return res.status(200).json({
        success: true,
        message: "Notes within date range retrieved successfully",
        data: notes,
        count: notes.length
      });
    } catch (error) {
      console.error("Error fetching notes by date range:", error);
      return res.status(500).json({
        success: false,
        message: "Error fetching notes by date range",
        error: error.message
      });
    }
  };
  
  // Get notes summary
  export const getNotesSummary = async (req, res) => {
    try {
      // Get total count of notes
      const totalCount = await SnigdhaNotes.countDocuments();
      
      // Get count by type
      const productCount = await SnigdhaNotes.countDocuments({ type: 'product' });
      const purchaseCount = await SnigdhaNotes.countDocuments({ type: 'purchase' });
      
      // Get count by amountType
      const increaseCount = await SnigdhaNotes.countDocuments({ amountType: 'increase' });
      const decreaseCount = await SnigdhaNotes.countDocuments({ amountType: 'decrease' });
      
      // Get sum of amounts by type and amountType
      const productIncreaseTotal = await SnigdhaNotes.aggregate([
        { $match: { type: 'product', amountType: 'increase' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]);
      
      const productDecreaseTotal = await SnigdhaNotes.aggregate([
        { $match: { type: 'product', amountType: 'decrease' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]);
      
      const purchaseIncreaseTotal = await SnigdhaNotes.aggregate([
        { $match: { type: 'purchase', amountType: 'increase' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]);
      
      const purchaseDecreaseTotal = await SnigdhaNotes.aggregate([
        { $match: { type: 'purchase', amountType: 'decrease' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]);
      
      // Get recent notes
      const recentNotes = await SnigdhaNotes.find()
        .sort({ date: -1 })
        .limit(5);
      
      return res.status(200).json({
        success: true,
        message: "Notes summary retrieved successfully",
        data: {
          totalCount,
          byType: {
            product: productCount,
            purchase: purchaseCount
          },
          byAmountType: {
            increase: increaseCount,
            decrease: decreaseCount
          },
          totals: {
            product: {
              increase: productIncreaseTotal.length > 0 ? productIncreaseTotal[0].total : 0,
              decrease: productDecreaseTotal.length > 0 ? productDecreaseTotal[0].total : 0,
              net: (productIncreaseTotal.length > 0 ? productIncreaseTotal[0].total : 0) - 
                   (productDecreaseTotal.length > 0 ? productDecreaseTotal[0].total : 0)
            },
            purchase: {
              increase: purchaseIncreaseTotal.length > 0 ? purchaseIncreaseTotal[0].total : 0,
              decrease: purchaseDecreaseTotal.length > 0 ? purchaseDecreaseTotal[0].total : 0,
              net: (purchaseIncreaseTotal.length > 0 ? purchaseIncreaseTotal[0].total : 0) - 
                   (purchaseDecreaseTotal.length > 0 ? purchaseDecreaseTotal[0].total : 0)
            }
          },
          recentNotes
        }
      });
    } catch (error) {
      console.error("Error fetching notes summary:", error);
      return res.status(500).json({
        success: false,
        message: "Error fetching notes summary",
        error: error.message
      });
    }
  };
  
  // Search notes
  export const searchNotes = async (req, res) => {
    try {
      const { query } = req.query;
      
      if (!query) {
        return res.status(400).json({
          success: false,
          message: "Search query is required"
        });
      }
      
      const notes = await SnigdhaNotes.find({
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } },
          { invoiceNumber: { $regex: query, $options: 'i' } }
        ]
      }).sort({ date: -1 });
      
      return res.status(200).json({
        success: true,
        message: "Search results retrieved successfully",
        data: notes,
        count: notes.length
      });
    } catch (error) {
      console.error("Error searching notes:", error);
      return res.status(500).json({
        success: false,
        message: "Error searching notes",
        error: error.message
      });
    }
  };
  
  // Get notes statistics by month
  export const getNoteStatsByMonth = async (req, res) => {
    try {
      const { year } = req.query;
      
      // Default to current year if not provided
      const targetYear = year ? parseInt(year) : new Date().getFullYear();
      
      const startDate = new Date(targetYear, 0, 1); // January 1st of the target year
      const endDate = new Date(targetYear, 11, 31, 23, 59, 59); // December 31st of the target year
      
      // Aggregate notes by month
      const monthlyStats = await SnigdhaNotes.aggregate([
        {
          $match: {
            date: { $gte: startDate, $lte: endDate }
          }
        },
        {
          $group: {
            _id: {
              month: { $month: "$date" },
              type: "$type",
              amountType: "$amountType"
            },
            count: { $sum: 1 },
            totalAmount: { $sum: "$amount" }
          }
        },
        {
          $sort: { "_id.month": 1 }
        }
      ]);
      
      // Transform the data into a more usable format
      const months = Array.from({ length: 12 }, (_, i) => i + 1);
      const result = months.map(month => {
        const monthData = monthlyStats.filter(stat => stat._id.month === month);
        
        const productIncrease = monthData.find(item => 
          item._id.type === 'product' && item._id.amountType === 'increase'
        ) || { count: 0, totalAmount: 0 };
        
        const productDecrease = monthData.find(item => 
          item._id.type === 'product' && item._id.amountType === 'decrease'
        ) || { count: 0, totalAmount: 0 };
        
        const purchaseIncrease = monthData.find(item => 
          item._id.type === 'purchase' && item._id.amountType === 'increase'
        ) || { count: 0, totalAmount: 0 };
        
        const purchaseDecrease = monthData.find(item => 
          item._id.type === 'purchase' && item._id.amountType === 'decrease'
        ) || { count: 0, totalAmount: 0 };
        
        return {
          month,
          monthName: new Date(targetYear, month - 1, 1).toLocaleString('default', { month: 'long' }),
          product: {
            increase: {
              count: productIncrease.count,
              amount: productIncrease.totalAmount
            },
            decrease: {
              count: productDecrease.count,
              amount: productDecrease.totalAmount
            },
            net: productIncrease.totalAmount - productDecrease.totalAmount
          },
          purchase: {
            increase: {
              count: purchaseIncrease.count,
              amount: purchaseIncrease.totalAmount
            },
            decrease: {
              count: purchaseDecrease.count,
              amount: purchaseDecrease.totalAmount
            },
            net: purchaseIncrease.totalAmount - purchaseDecrease.totalAmount
          },
          total: {
            count: monthData.reduce((sum, item) => sum + item.count, 0),
            net: (productIncrease.totalAmount - productDecrease.totalAmount) + 
                 (purchaseIncrease.totalAmount - purchaseDecrease.totalAmount)
          }
        };
      });
      
      return res.status(200).json({
        success: true,
        message: `Monthly notes statistics for year ${targetYear} retrieved successfully`,
        data: result,
        year: targetYear
      });
    } catch (error) {
      console.error("Error fetching monthly notes statistics:", error);
      return res.status(500).json({
        success: false,
        message: "Error fetching monthly notes statistics",
        error: error.message
      });
    }
  };
  
  // Bulk delete notes
  export const bulkDeleteNotes = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
      const { ids } = req.body;
      
      if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Array of note IDs is required"
        });
      }
      
      // Validate all IDs
      const invalidIds = ids.filter(id => !mongoose.Types.ObjectId.isValid(id));
      if (invalidIds.length > 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid note ID format found in the request"
        });
      }
      
      // Find all notes to be deleted
      const notesToDelete = await SnigdhaNotes.find({ _id: { $in: ids } }).session(session);
      
      if (notesToDelete.length === 0) {
        await session.abortTransaction();
        session.endSession();
        return res.status(404).json({
          success: false,
          message: "No notes found with the provided IDs"
        });
      }
      
      // Process each note to revert its effects
      for (const note of notesToDelete) {
        if (note.type === 'product') {
          // Find the invoice
          const invoice = await Invoice.findOne({ invoiceNumber: note.invoiceNumber }).session(session);
          
          if (invoice) {
            // Revert invoice grandTotal based on amountType
            if (note.amountType === 'increase') {
              invoice.grandTotal -= note.amount;
            } else {
              invoice.grandTotal += note.amount;
            }
            
            await invoice.save({ session });
          }
    
          // Check if invoice exists in ledger
          const ledgerEntry = await SngidhaLedger.findOne({ invoiceNumber: note.invoiceNumber }).session(session);
          
          if (ledgerEntry) {
            // Revert ledger totalAmount based on amountType
            if (note.amountType === 'increase') {
              ledgerEntry.totalAmount -= note.amount;
            } else {
              ledgerEntry.totalAmount += note.amount;
            }
            
            // Recalculate dueAmount
            ledgerEntry.dueAmount = ledgerEntry.totalAmount - ledgerEntry.totalPaidAmount;
            
            // Update isPaid status
            ledgerEntry.isPaid = ledgerEntry.dueAmount <= 0;
            
            await ledgerEntry.save({ session });
          }
    
          // Revert bank totalProductsNotesAmount
          const banks = await SnigdhaBank.find().session(session);
          
          if (banks.length > 0) {
            const bank = banks[0];
            
            if (note.amountType === 'increase') {
              bank.totalProductsNotesAmount -= note.amount;
              
              // If ledger entry exists and is paid, revert bank currentAmount
              if (ledgerEntry && ledgerEntry.isPaid) {
                bank.currentAmount -= note.amount;
              }
            } else {
              bank.totalProductsNotesAmount += note.amount;
              
              // If ledger entry exists and is paid, revert bank currentAmount
              if (ledgerEntry && ledgerEntry.isPaid) {
                bank.currentAmount += note.amount;
              }
            }
            
            await bank.save({ session });
          }
        } 
        else if (note.type === 'purchase') {
          // Find the purchase order
          const purchaseOrder = await SnigdhaPurchaseOrderNew.findOne({ invoiceNumber: note.invoiceNumber }).session(session);
          
          if (purchaseOrder) {
            // Revert purchase order grandTotal based on amountType
            if (note.amountType === 'increase') {
              purchaseOrder.grandTotal -= note.amount;
            } else {
              purchaseOrder.grandTotal += note.amount;
            }
            
            await purchaseOrder.save({ session });
          }
    
          // Check if purchase order exists in purchaseAccount
          const purchaseAccount = await SnigdhaPurchaseAccount.findOne({ invoiceNumber: note.invoiceNumber }).session(session);
          
          if (purchaseAccount) {
            // Revert purchaseAccount totalAmount based on amountType
            if (note.amountType === 'increase') {
              purchaseAccount.totalAmount -= note.amount;
            } else {
              purchaseAccount.totalAmount += note.amount;
            }
            
            // Recalculate dueAmount
            purchaseAccount.dueAmount = purchaseAccount.totalAmount - purchaseAccount.totalPaidAmount;
            
            // Update isPaid status
            purchaseAccount.isPaid = purchaseAccount.dueAmount <= 0;
            
            await purchaseAccount.save({ session });
          }
    
          // Revert bank totalPurchasesNotesAmount
          const banks = await SnigdhaBank.find().session(session);
          
          if (banks.length > 0) {
            const bank = banks[0];
            
            if (note.amountType === 'increase') {
              bank.totalPurchasesNotesAmount -= note.amount;
              
              // If purchaseAccount entry exists and is paid, revert bank currentAmount
              if (purchaseAccount && purchaseAccount.isPaid) {
                bank.currentAmount += note.amount; // For purchases, we add to bank when reverting an increase
              }
            } else {
              bank.totalPurchasesNotesAmount += note.amount;
              
              // If purchaseAccount entry exists and is paid, revert bank currentAmount
              if (purchaseAccount && purchaseAccount.isPaid) {
                bank.currentAmount -= note.amount; // For purchases, we deduct from bank when reverting a decrease
              }
            }
            
            await bank.save({ session });
          }
        }
      }
      
      // Delete all notes
      await SnigdhaNotes.deleteMany({ _id: { $in: ids } }).session(session);
      
      await session.commitTransaction();
      session.endSession();
      
      return res.status(200).json({
        success: true,
        message: `Successfully deleted ${notesToDelete.length} notes`,
        deletedCount: notesToDelete.length
      });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      
      console.error("Error bulk deleting notes:", error);
      return res.status(500).json({
        success: false,
        message: "Error bulk deleting notes",
        error: error.message
      });
    }
  };