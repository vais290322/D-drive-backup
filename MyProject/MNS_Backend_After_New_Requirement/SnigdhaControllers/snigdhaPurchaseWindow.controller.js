import SnigdhaPurchaseWindow from "../SnigdhaModels/snigdhaPurchaseWindow.model.js";
import SnigdhaBank from "../SnigdhaModels/snigdhaBank.model.js";
import mongoose from "mongoose";

// Create a new purchase window 
export const createPurchaseWindow = async (req, res) => {
  try {
    const { invoiceNumber, invoiceId, date, amount, vendorName, paymentMethod, bankId } = req.body;

    // Validate required fields
    const requiredFields = ['invoiceNumber', 'invoiceId', 'date', 'amount', 'vendorName', 'paymentMethod', 'bankId'];
    const missingFields = requiredFields.filter(field => !req.body[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: `Required fields missing: ${missingFields.join(', ')}`
      });
    }

    // Validate ObjectIds
    if (!mongoose.Types.ObjectId.isValid(invoiceId) || !mongoose.Types.ObjectId.isValid(bankId)) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "Invalid invoiceId or bankId format"
      });
    }

    // Ensure amount is a number
    const numericAmount = Number(amount);
    if (isNaN(numericAmount)) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "Amount must be a valid number"
      });
    }

    // Check if bank exists and has sufficient balance
    const bank = await SnigdhaBank.findById(bankId);
    if (!bank) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Bank account not found"
      });
    }

    // Convert bank.currentAmount to number for comparison
    const currentAmount = Number(bank.currentAmount);
    if (currentAmount < numericAmount) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "Insufficient balance for purchase payment"
      });
    }

    // Update bank balance
    bank.currentAmount = currentAmount - numericAmount;
    bank.deductionAmount = Number(bank.deductionAmount) + numericAmount;
    await bank.save();

    // Create new purchase window
    const newPurchaseWindow = await SnigdhaPurchaseWindow.create({
      invoiceNumber,
      invoiceId,
      date: new Date(date),
      amount: numericAmount,
      vendorName,
      paymentMethod,
      bankId
    });

    // Populate references
    const populatedPurchaseWindow = await SnigdhaPurchaseWindow.findById(newPurchaseWindow._id)
      .populate('invoiceId')
      .populate('bankId');

    return res.status(201).json({
      success: true,
      statusCode: 201,
      message: "Purchase created successfully",
      data: populatedPurchaseWindow
    });
  } catch (error) {
    console.error("Error creating purchase window:", error);
    return res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Error creating purchase window",
      error: error.message
    });
  }
};

// Get all purchase windows
export const getAllPurchaseWindows = async (req, res) => {
  try {
    const purchaseWindows = await SnigdhaPurchaseWindow.find()
      .populate('invoiceId')
      .populate('bankId')
      .sort({ date: -1 });
    
    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "All Purchase retrieved successfully",
      data: purchaseWindows,
      count: purchaseWindows.length
    });
  } catch (error) {
    console.error("Error fetching purchase windows:", error);
    return res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Error fetching purchase windows",
      error: error.message
    });
  }
};

// Get a single purchase window by ID
export const getPurchaseWindowById = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "Invalid purchase ID format"
      });
    }
    
    const purchaseWindow = await SnigdhaPurchaseWindow.findById(id)
      .populate('invoiceId')
      .populate('bankId');
    
    if (!purchaseWindow) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Purchase not found"
      });
    }
    
    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Purchase retrieved successfully",
      data: purchaseWindow
    });
  } catch (error) {
    console.error("Error fetching purchase window:", error);
    return res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Error fetching purchase",
      error: error.message
    });
  }
};

// Update a purchase window
export const updatePurchaseWindow = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "Invalid purchase ID format"
      });
    }
    
    // Find purchase window first to check if it exists and get original data
    const purchaseWindow = await SnigdhaPurchaseWindow.findById(id);
    if (!purchaseWindow) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Purchase window not found"
      });
    }

    // Validate ObjectIds if provided
    if (updateData.invoiceId && !mongoose.Types.ObjectId.isValid(updateData.invoiceId)) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "Invalid invoiceId format"
      });
    }
    
    if (updateData.bankId && !mongoose.Types.ObjectId.isValid(updateData.bankId)) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "Invalid bankId format"
      });
    }
    
    // Convert date string to Date object if provided
    if (updateData.date) {
      updateData.date = new Date(updateData.date);
    }

    // Handle changes in amount or bank
    const originalAmount = Number(purchaseWindow.amount);
    const originalBankId = purchaseWindow.bankId.toString();
    
    const newAmount = updateData.amount !== undefined ? Number(updateData.amount) : originalAmount;
    const newBankId = updateData.bankId || originalBankId;
    
    // Ensure amount is a number if provided
    if (updateData.amount !== undefined && isNaN(Number(updateData.amount))) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "Amount must be a valid number"
      });
    }

    // Restore original amount to original bank
    const originalBank = await SnigdhaBank.findById(originalBankId);
    if (originalBank) {
      originalBank.currentAmount = Number(originalBank.currentAmount) + originalAmount;
      originalBank.deductionAmount = Number(originalBank.deductionAmount) - originalAmount;
      await originalBank.save();
    }

    // Apply new amount to target bank
    let targetBank;
    if (newBankId !== originalBankId) {
      // If bank is changing, get the new bank
      targetBank = await SnigdhaBank.findById(newBankId);
      if (!targetBank) {
        return res.status(404).json({
          success: false,
          statusCode: 404,
          message: "New bank account not found"
        });
      }
    } else {
      // If bank is not changing, use the original bank
      targetBank = originalBank;
    }

    // Check if target bank has sufficient balance
    if (Number(targetBank.currentAmount) < newAmount) {
      // If insufficient balance, restore the original deduction
      originalBank.currentAmount = Number(originalBank.currentAmount) - originalAmount;
      originalBank.deductionAmount = Number(originalBank.deductionAmount) + originalAmount;
      await originalBank.save();

      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "Insufficient balance in bank account"
      });
    }

    // Apply the new deduction to the target bank
    targetBank.currentAmount = Number(targetBank.currentAmount) - newAmount;
    targetBank.deductionAmount = Number(targetBank.deductionAmount) + newAmount;
    await targetBank.save();
    
    // Update purchase window
    const updatedPurchaseWindow = await SnigdhaPurchaseWindow.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate('invoiceId')
      .populate('bankId');
    
    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Purchase updated successfully",
      data: updatedPurchaseWindow
    });
  } catch (error) {
    console.error("Error updating purchase:", error);
    return res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Error updating purchase window",
      error: error.message
    });
  }
};

// Delete a purchase window
export const deletePurchaseWindow = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "Invalid purchase ID format"
      });
    }
    
    // Find purchase window first to get amount and bank info
    const purchaseWindow = await SnigdhaPurchaseWindow.findById(id);
    if (!purchaseWindow) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Purchase not found"
      });
    }

    // Restore amount to bank
    const bank = await SnigdhaBank.findById(purchaseWindow.bankId);
    if (bank) {
      bank.currentAmount = Number(bank.currentAmount) + Number(purchaseWindow.amount);
      bank.deductionAmount = Number(bank.deductionAmount) - Number(purchaseWindow.amount);
      await bank.save();
    }
    
    // Delete purchase window
    const deletedPurchaseWindow = await SnigdhaPurchaseWindow.findByIdAndDelete(id);
    
    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Purchase deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting purchase:", error);
    return res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Error deleting purchase window",
      error: error.message
    });
  }
};

// Get purchase windows by invoice ID
export const getPurchaseWindowsByInvoiceId = async (req, res) => {
  try {
    const { invoiceId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(invoiceId)) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "Invalid invoice ID format"
      });
    }
    
    const purchaseWindows = await SnigdhaPurchaseWindow.find({ invoiceId })
      .populate('invoiceId')
      .populate('bankId')
      .sort({ date: -1 });
    
    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Purchase retrieved successfully",
      data: purchaseWindows,
      count: purchaseWindows.length
    });
  } catch (error) {
    console.error("Error fetching purchase by invoice ID:", error);
    return res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Error fetching purchase by invoice ID",
      error: error.message
    });
  }
};

// Get purchase windows by bank ID
export const getPurchaseWindowsByBankId = async (req, res) => {
  try {
    const { bankId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(bankId)) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "Invalid bank ID format"
      });
    }
    
    const purchaseWindows = await SnigdhaPurchaseWindow.find({ bankId })
      .populate('invoiceId')
      .populate('bankId')
      .sort({ date: -1 });
    
    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Purchase retrieved successfully",
      data: purchaseWindows,
      count: purchaseWindows.length
    });
  } catch (error) {
    console.error("Error fetching purchase by bank ID:", error);
    return res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Error fetching purchase by bank ID",
      error: error.message
    });
  }
};