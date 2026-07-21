import PurchaseWindow from "../Models/purchasewindow.model.js";
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

    // Create new purchase window
    const newPurchaseWindow = await PurchaseWindow.create({
      invoiceNumber,
      invoiceId,
      date: new Date(date),
      amount,
      vendorName,
      paymentMethod,
      bankId
    });

    // Populate references
    const populatedPurchaseWindow = await PurchaseWindow.findById(newPurchaseWindow._id)
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
    const purchaseWindows = await PurchaseWindow.find()
      .populate('invoiceId')
      .populate('bankId')
      .sort({ date: -1 });
    
    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "All Purchase  retrieved successfully",
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
        message: "Invalid purchase  ID format"
      });
    }
    
    const purchaseWindow = await PurchaseWindow.findById(id)
      .populate('invoiceId')
      .populate('bankId');
    
    if (!purchaseWindow) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Purchase  not found"
      });
    }
    
    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Purchase  retrieved successfully",
      data: purchaseWindow
    });
  } catch (error) {
    console.error("Error fetching purchase window:", error);
    return res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Error fetching purchase ",
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
        message: "Invalid purchase  ID format"
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
    
    // Update purchase window
    const updatedPurchaseWindow = await PurchaseWindow.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate('invoiceId')
      .populate('bankId');
    
    if (!updatedPurchaseWindow) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Purchase window not found"
      });
    }
    
    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Purchase  updated successfully",
      data: updatedPurchaseWindow
    });
  } catch (error) {
    console.error("Error updating purchase :", error);
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
        message: "Invalid purchase  ID format"
      });
    }
    
    const deletedPurchaseWindow = await PurchaseWindow.findByIdAndDelete(id);
    
    if (!deletedPurchaseWindow) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Purchase  not found"
      });
    }
    
    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Purchase  deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting purchase :", error);
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
    
    const purchaseWindows = await PurchaseWindow.find({ invoiceId })
      .populate('invoiceId')
      .populate('bankId')
      .sort({ date: -1 });
    
    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Purchase  retrieved successfully",
      data: purchaseWindows,
      count: purchaseWindows.length
    });
  } catch (error) {
    console.error("Error fetching purchase  by invoice ID:", error);
    return res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Error fetching purchase  by invoice ID",
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
    
    const purchaseWindows = await PurchaseWindow.find({ bankId })
      .populate('invoiceId')
      .populate('bankId')
      .sort({ date: -1 });
    
    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Purchase  retrieved successfully",
      data: purchaseWindows,
      count: purchaseWindows.length
    });
  } catch (error) {
    console.error("Error fetching purchase  by bank ID:", error);
    return res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Error fetching purchase  by bank ID",
      error: error.message
    });
  }
};