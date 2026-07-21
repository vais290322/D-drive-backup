import Notes from "../Models/notes.model.js";
import InvoiceMns from "../invoicemodel/invoice-mns.model.js";
import { Ledger } from "../Models/ledgerAccount.model.js";
import Bank from "../Models/bank.model.js";
import Service from "../Models/service.model.js";
import { ServiceAccount } from "../Models/serviceAccount.model.js";
import MnsPurchaseOrderNew from "../Models/mnsPurchaseOrderNew.model.js";
import PurchaseAccount from "../Models/purchaseAccount.model.js";
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
    if (!['product', 'service', 'purchase'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: "type must be either 'product', 'service', or 'purchase'"
      });
    }

    // Create the note
    const newNote = await Notes.create([{
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
      const invoice = await InvoiceMns.findOne({ invoiceNumber }).session(session);
      
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
      const ledgerEntry = await Ledger.findOne({ invoiceNumber }).session(session);
      
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
      const banks = await Bank.find().session(session);
      
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
    else if (type === 'service') {
      // Find the service
      const service = await Service.findOne({ invoiceNumber }).session(session);
      
      if (!service) {
        await session.abortTransaction();
        session.endSession();
        return res.status(404).json({
          success: false,
          message: "Service not found"
        });
      }

      // Update service grandTotal based on amountType
      if (amountType === 'increase') {
        service.total.grandTotal += amount;
      } else {
        service.total.grandTotal -= amount;
      }
      
      await service.save({ session });

      // Check if service exists in serviceAccount
      const serviceAccount = await ServiceAccount.findOne({ invoiceNumber }).session(session);
      
      if (serviceAccount) {
        // Update serviceAccount totalAmount based on amountType
        if (amountType === 'increase') {
          serviceAccount.totalAmount += amount;
          
          // Recalculate dueAmount
          serviceAccount.dueAmount = serviceAccount.totalAmount - serviceAccount.totalPaidAmount;
          
          // Update isPaid status
          serviceAccount.isPaid = serviceAccount.dueAmount <= 0;
        } else {
          serviceAccount.totalAmount -= amount;
          
          // Recalculate dueAmount
          serviceAccount.dueAmount = serviceAccount.totalAmount - serviceAccount.totalPaidAmount;
          
          // Update isPaid status
          serviceAccount.isPaid = serviceAccount.dueAmount <= 0;
        }
        
        await serviceAccount.save({ session });
      }

      // Update bank totalServicesNotesAmount
      const banks = await Bank.find().session(session);
      
      if (banks.length > 0) {
        // Get the first bank (or you could specify which bank to update)
        const bank = banks[0];
        
        if (amountType === 'increase') {
          bank.totalServicesNotesAmount += amount;
          
          // If serviceAccount entry exists and is paid, update bank currentAmount
          if (serviceAccount && serviceAccount.isPaid) {
            bank.currentAmount += amount;
          }
        } else {
          bank.totalServicesNotesAmount -= amount;
          
          // If serviceAccount entry exists and is paid, update bank currentAmount
          if (serviceAccount && serviceAccount.isPaid) {
            bank.currentAmount -= amount;
          }
        }
        
        await bank.save({ session });
      }
    } 
    else if (type === 'purchase') {
      // Find the purchase order
      const purchaseOrder = await MnsPurchaseOrderNew.findOne({ invoiceNumber }).session(session);
      
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
      const purchaseAccount = await PurchaseAccount.findOne({ invoiceNumber }).session(session);
      
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
      const banks = await Bank.find().session(session);
      
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
    const notes = await Notes.find().sort({ date: -1 });
    
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
    
    const note = await Notes.findById(id);
    
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
    const originalNote = await Notes.findById(id).session(session);
    
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
    if (updateData.type && !['product', 'service', 'purchase'].includes(updateData.type)) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: "type must be either 'product', 'service', or 'purchase'"
      });
    }
    
    // Revert changes made by the original note
    if (originalNote.type === 'product') {
      // Find the invoice
      const invoice = await InvoiceMns.findOne({ invoiceNumber: originalNote.invoiceNumber }).session(session);
      
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
      const ledgerEntry = await Ledger.findOne({ invoiceNumber: originalNote.invoiceNumber }).session(session);
      
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
      const banks = await Bank.find().session(session);
      
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
    else if (originalNote.type === 'service') {
      // Find the service
      const service = await Service.findOne({ invoiceNumber: originalNote.invoiceNumber }).session(session);
      
      if (service) {
        // Revert service grandTotal based on original amountType
        if (originalNote.amountType === 'increase') {
          service.total.grandTotal -= originalNote.amount;
        } else {
          service.total.grandTotal += originalNote.amount;
        }
        
        await service.save({ session });
      }

      // Check if service exists in serviceAccount
      const serviceAccount = await ServiceAccount.findOne({ invoiceNumber: originalNote.invoiceNumber }).session(session);
      
      if (serviceAccount) {
        // Revert serviceAccount totalAmount based on original amountType
        if (originalNote.amountType === 'increase') {
          serviceAccount.totalAmount -= originalNote.amount;
        } else {
          serviceAccount.totalAmount += originalNote.amount;
        }
        
        // Recalculate dueAmount
        serviceAccount.dueAmount = serviceAccount.totalAmount - serviceAccount.totalPaidAmount;
        
        // Update isPaid status
        serviceAccount.isPaid = serviceAccount.dueAmount <= 0;
        
        await serviceAccount.save({ session });
      }

      // Revert bank totalServicesNotesAmount
      const banks = await Bank.find().session(session);
      
      if (banks.length > 0) {
        const bank = banks[0];
        
        if (originalNote.amountType === 'increase') {
          bank.totalServicesNotesAmount -= originalNote.amount;
          
          // If serviceAccount entry exists and is paid, revert bank currentAmount
          if (serviceAccount && serviceAccount.isPaid) {
            bank.currentAmount -= originalNote.amount;
          }
        } else {
          bank.totalServicesNotesAmount += originalNote.amount;
          
          // If serviceAccount entry exists and is paid, revert bank currentAmount
          if (serviceAccount && serviceAccount.isPaid) {
            bank.currentAmount += originalNote.amount;
          }
        }
        
        await bank.save({ session });
      }
    } 
    else if (originalNote.type === 'purchase') {
      // Find the purchase order
      const purchaseOrder = await MnsPurchaseOrderNew.findOne({ invoiceNumber: originalNote.invoiceNumber }).session(session);
      
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
      const purchaseAccount = await PurchaseAccount.findOne({ invoiceNumber: originalNote.invoiceNumber }).session(session);
      
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
      const banks = await Bank.find().session(session);
      
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
    const updatedNote = await Notes.findByIdAndUpdate(
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
      const invoice = await InvoiceMns.findOne({ invoiceNumber: newInvoiceNumber }).session(session);
      
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
      const ledgerEntry = await Ledger.findOne({ invoiceNumber: newInvoiceNumber }).session(session);
      
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
      const banks = await Bank.find().session(session);
      
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
    else if (newType === 'service') {
      // Find the service
      const service = await Service.findOne({ invoiceNumber: newInvoiceNumber }).session(session);
      
      if (!service) {
        await session.abortTransaction();
        session.endSession();
        return res.status(404).json({
          success: false,
          message: "Service not found"
        });
      }

      // Update service grandTotal based on new amountType
      if (newAmountType === 'increase') {
        service.total.grandTotal += newAmount;
      } else {
        service.total.grandTotal -= newAmount;
      }
      
      await service.save({ session });

      // Check if service exists in serviceAccount
      const serviceAccount = await ServiceAccount.findOne({ invoiceNumber: newInvoiceNumber }).session(session);
      
      if (serviceAccount) {
        // Update serviceAccount totalAmount based on new amountType
        if (newAmountType === 'increase') {
          serviceAccount.totalAmount += newAmount;
        } else {
          serviceAccount.totalAmount -= newAmount;
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
        const bank = banks[0];
        
        if (newAmountType === 'increase') {
          bank.totalServicesNotesAmount += newAmount;
          
          // If serviceAccount entry exists and is paid, update bank currentAmount
          if (serviceAccount && serviceAccount.isPaid) {
            bank.currentAmount += newAmount;
          }
        } else {
          bank.totalServicesNotesAmount -= newAmount;
          
          // If serviceAccount entry exists and is paid, update bank currentAmount
          if (serviceAccount && serviceAccount.isPaid) {
            bank.currentAmount -= newAmount;
          }
        }
        
        await bank.save({ session });
      }
    } 
    else if (newType === 'purchase') {
      // Find the purchase order
      const purchaseOrder = await MnsPurchaseOrderNew.findOne({ invoiceNumber: newInvoiceNumber }).session(session);
      
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
      const purchaseAccount = await PurchaseAccount.findOne({ invoiceNumber: newInvoiceNumber }).session(session);
      
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
      const banks = await Bank.find().session(session);
      
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
    const note = await Notes.findById(id).session(session);
    
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
      const invoice = await InvoiceMns.findOne({ invoiceNumber: note.invoiceNumber }).session(session);
      
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
      const ledgerEntry = await Ledger.findOne({ invoiceNumber: note.invoiceNumber }).session(session);
      
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
      const banks = await Bank.find().session(session);
      
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
    else if (note.type === 'service') {
      // Find the service
      const service = await Service.findOne({ invoiceNumber: note.invoiceNumber }).session(session);
      
      if (service) {
        // Revert service grandTotal based on amountType
        if (note.amountType === 'increase') {
          service.total.grandTotal -= note.amount;
        } else {
          service.total.grandTotal += note.amount;
        }
        
        await service.save({ session });
      }

      // Check if service exists in serviceAccount
      const serviceAccount = await ServiceAccount.findOne({ invoiceNumber: note.invoiceNumber }).session(session);
      
      if (serviceAccount) {
        // Revert serviceAccount totalAmount based on amountType
        if (note.amountType === 'increase') {
          serviceAccount.totalAmount -= note.amount;
        } else {
          serviceAccount.totalAmount += note.amount;
        }
        
        // Recalculate dueAmount
        serviceAccount.dueAmount = serviceAccount.totalAmount - serviceAccount.totalPaidAmount;
        
        // Update isPaid status
        serviceAccount.isPaid = serviceAccount.dueAmount <= 0;
        
        await serviceAccount.save({ session });
      }

      // Revert bank totalServicesNotesAmount
      const banks = await Bank.find().session(session);
      
      if (banks.length > 0) {
        const bank = banks[0];
        
        if (note.amountType === 'increase') {
          bank.totalServicesNotesAmount -= note.amount;
          
          // If serviceAccount entry exists and is paid, revert bank currentAmount
          if (serviceAccount && serviceAccount.isPaid) {
            bank.currentAmount -= note.amount;
          }
        } else {
          bank.totalServicesNotesAmount += note.amount;
          
          // If serviceAccount entry exists and is paid, revert bank currentAmount
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
      const purchaseAccount = await PurchaseAccount.findOne({ invoiceNumber: note.invoiceNumber }).session(session);
      
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
      const banks = await Bank.find().session(session);
      
      if (banks.length > 0) {
        const bank = banks[0];
        
        if (note.amountType === 'increase') {
          bank.totalPurchasesNotesAmount -= note.amount;
          
          // If purchaseAccount entry exists and is paid, revert bank currentAmount
          if (purchaseAccount && purchaseAccount.isPaid) {
            bank.currentAmount += note.amount;
          }
        } else {
          bank.totalPurchasesNotesAmount += note.amount;
          
          // If purchaseAccount entry exists and is paid, revert bank currentAmount
          if (purchaseAccount && purchaseAccount.isPaid) {
            bank.currentAmount -= note.amount;
          }
        }
        
        await bank.save({ session });
      }
    }
    
    // Delete the note
    await Notes.findByIdAndDelete(id).session(session);
    
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
    
    // Validate type
    if (!['product', 'service', 'purchase'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Type must be either 'product', 'service', or 'purchase'"
      });
    }
    
    const notes = await Notes.find({ type }).sort({ date: -1 });
    
    return res.status(200).json({
      success: true,
      message: `${type} notes retrieved successfully`,
      data: notes,
      count: notes.length
    });
  } catch (error) {
    console.error(`Error fetching ${req.params.type} notes:`, error);
    return res.status(500).json({
      success: false,
      message: `Error fetching ${req.params.type} notes`,
      error: error.message
    });
  }
};

// Get notes by invoice number
export const getNotesByInvoiceNumber = async (req, res) => {
  try {
    const { invoiceNumber } = req.params;
    
    const notes = await Notes.find({ invoiceNumber }).sort({ date: -1 });
    
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

// Get notes by date range
export const getNotesByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "Both start date and end date are required"
      });
    }
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999); // Set to end of day
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid date format"
      });
    }
    
    const notes = await Notes.find({
      date: { $gte: start, $lte: end }
    }).sort({ date: -1 });
    
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

// Get notes by amount type
export const getNotesByAmountType = async (req, res) => {
  try {
    const { amountType } = req.params;
    
    // Validate amountType
    if (!['increase', 'decrease'].includes(amountType)) {
      return res.status(400).json({
        success: false,
        message: "amountType must be either 'increase' or 'decrease'"
      });
    }
    
    const notes = await Notes.find({ amountType }).sort({ date: -1 });
    
    return res.status(200).json({
      success: true,
      message: `${amountType} notes retrieved successfully`,
      data: notes,
      count: notes.length
    });
  } catch (error) {
    console.error(`Error fetching ${req.params.amountType} notes:`, error);
    return res.status(500).json({
      success: false,
      message: `Error fetching ${req.params.amountType} notes`,
      error: error.message
    });
  }
};

// Get notes by title (partial match)
export const getNotesByTitle = async (req, res) => {
  try {
    const { title } = req.params;
    
    const notes = await Notes.find({ 
      title: { $regex: title, $options: 'i' } 
    }).sort({ date: -1 });
    
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

// Get notes with advanced filtering
export const getFilteredNotes = async (req, res) => {
  try {
    const { type, amountType, startDate, endDate, minAmount, maxAmount } = req.query;
    
    // Build filter object
    const filter = {};
    
    // Add type filter if provided
    if (type) {
      if (!['product', 'service', 'purchase'].includes(type)) {
        return res.status(400).json({
          success: false,
          message: "Type must be either 'product', 'service', or 'purchase'"
        });
      }
      filter.type = type;
    }
    
    // Add amountType filter if provided
    if (amountType) {
      if (!['increase', 'decrease'].includes(amountType)) {
        return res.status(400).json({
          success: false,
          message: "amountType must be either 'increase' or 'decrease'"
        });
      }
      filter.amountType = amountType;
    }
    
    // Add date range filter if provided
    if (startDate || endDate) {
      filter.date = {};
      
      if (startDate) {
        const start = new Date(startDate);
        if (isNaN(start.getTime())) {
          return res.status(400).json({
            success: false,
            message: "Invalid start date format"
          });
        }
        filter.date.$gte = start;
      }
      
      if (endDate) {
        const end = new Date(endDate);
        if (isNaN(end.getTime())) {
          return res.status(400).json({
            success: false,
            message: "Invalid end date format"
          });
        }
        end.setHours(23, 59, 59, 999); // Set to end of day
        filter.date.$lte = end;
      }
    }
    
    // Add amount range filter if provided
    if (minAmount !== undefined || maxAmount !== undefined) {
      filter.amount = {};
      
      if (minAmount !== undefined) {
        const min = Number(minAmount);
        if (isNaN(min)) {
          return res.status(400).json({
            success: false,
            message: "Invalid minimum amount format"
          });
        }
        filter.amount.$gte = min;
      }
      
      if (maxAmount !== undefined) {
        const max = Number(maxAmount);
        if (isNaN(max)) {
          return res.status(400).json({
            success: false,
            message: "Invalid maximum amount format"
          });
        }
        filter.amount.$lte = max;
      }
    }
    
    const notes = await Notes.find(filter).sort({ date: -1 });
    
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

// Get total amount of notes by type
export const getTotalAmountByType = async (req, res) => {
  try {
    const result = await Notes.aggregate([
      {
        $group: {
          _id: "$type",
          totalAmount: { 
            $sum: {
              $cond: [
                { $eq: ["$amountType", "increase"] },
                "$amount",
                { $multiply: ["$amount", -1] }
              ]
            }
          },
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Transform result into a more user-friendly format
    const formattedResult = {};
    result.forEach(item => {
      formattedResult[item._id] = {
        totalAmount: item.totalAmount,
        count: item.count
      };
    });
    
    return res.status(200).json({
      success: true,
      message: "Total amounts retrieved successfully",
      data: formattedResult
    });
  } catch (error) {
    console.error("Error calculating total amounts:", error);
    return res.status(500).json({
      success: false,
      message: "Error calculating total amounts",
      error: error.message
    });
  }
};