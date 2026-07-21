import DummySlip from "../Models/dummyslip.model.js";
import mongoose from "mongoose";

// Create a new dummy slip
export const createDummySlip = async (req, res) => {
  try {
    const { 
      date, 
      voucherNumber, 
      customerName, 
      amount, 
      bankId, 
      invoiceNumber,
      companyName,
      companyAddress 
    } = req.body;

    // Validate required fields
    const requiredFields = [
      'date', 
      'voucherNumber', 
      'customerName', 
      'amount',
      'companyName',
      'companyAddress'
    ];
    const missingFields = requiredFields.filter(field => !req.body[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        statusCode: 400, 
        message: `Required fields missing: ${missingFields.join(', ')}`
      });
    }

    // Validate bankId if provided
    if (bankId && !mongoose.Types.ObjectId.isValid(bankId)) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "Invalid bank ID format"
      });
    }

    // Create new dummy slip
    const newDummySlip = await DummySlip.create({
      date: new Date(date),
      voucherNumber,
      customerName,
      amount,
      bankId,
      invoiceNumber,
      companyName,
      companyAddress
    });

    // Populate bank details if bankId is provided
    const populatedDummySlip = await DummySlip.findById(newDummySlip._id).populate('bankId');

    return res.status(201).json({
      success: true,
      statusCode: 201,
      message: "Dummy slip created successfully",
      data: populatedDummySlip
    });
  } catch (error) {
    console.error("Error creating dummy slip:", error);
    return res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Error creating dummy slip",
      error: error.message
    });
  }
};

// Get all dummy slips
export const getAllDummySlips = async (req, res) => {
  try {
    const dummySlips = await DummySlip.find().populate('bankId').sort({ date: -1 });
    
    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Dummy slips retrieved successfully",
      data: dummySlips,
      count: dummySlips.length
    });
  } catch (error) {
    console.error("Error fetching dummy slips:", error);
    return res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Error fetching dummy slips",
      error: error.message
    });
  }
};

// Get a single dummy slip by ID
export const getDummySlipById = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "Invalid dummy slip ID format"
      });
    }
    
    const dummySlip = await DummySlip.findById(id).populate('bankId');
    
    if (!dummySlip) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Dummy slip not found"
      });
    }
    
    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Dummy slip retrieved successfully",
      data: dummySlip
    });
  } catch (error) {
    console.error("Error fetching dummy slip:", error);
    return res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Error fetching dummy slip",
      error: error.message
    });
  }
};

// Get dummy slips by voucher number
export const getDummySlipByVoucherNumber = async (req, res) => {
  try {
    const { voucherNumber } = req.params;
    
    const dummySlip = await DummySlip.findOne({ voucherNumber }).populate('bankId');
    
    if (!dummySlip) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Dummy slip not found"
      });
    }
    
    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Dummy slip retrieved successfully",
      data: dummySlip
    });
  } catch (error) {
    console.error("Error fetching dummy slip:", error);
    return res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Error fetching dummy slip",
      error: error.message
    });
  }
};

// Update a dummy slip
export const updateDummySlip = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "Invalid dummy slip ID format"
      });
    }
    
    // Find dummy slip first to check if it exists
    const dummySlip = await DummySlip.findById(id);
    if (!dummySlip) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Dummy slip not found"
      });
    }
    
    // Validate bankId if provided
    if (updateData.bankId && !mongoose.Types.ObjectId.isValid(updateData.bankId)) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "Invalid bank ID format"
      });
    }
    
    // Convert date string to Date object if provided
    if (updateData.date) {
      updateData.date = new Date(updateData.date);
    }
    
    // Update dummy slip
    const updatedDummySlip = await DummySlip.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('bankId');
    
    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Dummy slip updated successfully",
      data: updatedDummySlip
    });
  } catch (error) {
    console.error("Error updating dummy slip:", error);
    return res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Error updating dummy slip",
      error: error.message
    });
  }
};

// Delete a dummy slip
export const deleteDummySlip = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "Invalid dummy slip ID format"
      });
    }
    
    const deletedDummySlip = await DummySlip.findByIdAndDelete(id);
    
    if (!deletedDummySlip) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Dummy slip not found"
      });
    }
    
    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Dummy slip deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting dummy slip:", error);
    return res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Error deleting dummy slip",
      error: error.message
    });
  }
};

// Get dummy slips by customer name
export const getDummySlipsByCustomerName = async (req, res) => {
  try {
    const { customerName } = req.params;
    
    const dummySlips = await DummySlip.find({ 
      customerName: { $regex: customerName, $options: 'i' } 
    }).populate('bankId').sort({ date: -1 });
    
    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Dummy slips retrieved successfully",
      data: dummySlips,
      count: dummySlips.length
    });
  } catch (error) {
    console.error("Error fetching dummy slips:", error);
    return res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Error fetching dummy slips",
      error: error.message
    });
  }
};

// Get dummy slips by company name
export const getDummySlipsByCompanyName = async (req, res) => {
  try {
    const { companyName } = req.params;
    
    const dummySlips = await DummySlip.find({ 
      companyName: { $regex: companyName, $options: 'i' } 
    }).populate('bankId').sort({ date: -1 });
    
    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Dummy slips retrieved successfully",
      data: dummySlips,
      count: dummySlips.length
    });
  } catch (error) {
    console.error("Error fetching dummy slips:", error);
    return res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Error fetching dummy slips",
      error: error.message
    });
  }
};

// Get dummy slips by bank ID
export const getDummySlipsByBankId = async (req, res) => {
  try {
    const { bankId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(bankId)) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "Invalid bank ID format"
      });
    }
    
    const dummySlips = await DummySlip.find({ bankId })
      .populate('bankId')
      .sort({ date: -1 });
    
    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Dummy slips retrieved successfully",
      data: dummySlips,
      count: dummySlips.length
    });
  } catch (error) {
    console.error("Error fetching dummy slips:", error);
    return res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Error fetching dummy slips",
      error: error.message
    });
  }
};

// Get dummy slips by date range
export const getDummySlipsByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "Both start date and end date are required"
      });
    }
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999); // Set to end of day
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "Invalid date format"
      });
    }
    
    const dummySlips = await DummySlip.find({
      date: { $gte: start, $lte: end }
    }).populate('bankId').sort({ date: -1 });
    
    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Dummy slips retrieved successfully",
      data: dummySlips,
      count: dummySlips.length
    });
  } catch (error) {
    console.error("Error fetching dummy slips:", error);
    return res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Error fetching dummy slips",
      error: error.message
    });
  }
};

// Get dummy slips by invoice number
export const getDummySlipsByInvoiceNumber = async (req, res) => {
  try {
    const { invoiceNumber } = req.params;
    
    const dummySlips = await DummySlip.find({ invoiceNumber })
      .populate('bankId')
      .sort({ date: -1 });
    
    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Dummy slips retrieved successfully",
      data: dummySlips,
      count: dummySlips.length
    });
  } catch (error) {
    console.error("Error fetching dummy slips:", error);
    return res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Error fetching dummy slips",
      error: error.message
    });
  }
};