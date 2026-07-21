import ImprestFund from "../Models/imprestFund.model.js";
import mongoose from "mongoose";

// Create a new imprest fund 
export const createImprestFund = async (req, res) => {
  try {
    const { accountHolderName, openingAmount, openingDate } = req.body;

    // Check if an imprest fund already exists
    const existingFund = await ImprestFund.findOne();
    if (existingFund) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "An imprest fund already exists. Only one fund can be created."
      });
    }

    // Validate required fields
    const requiredFields = ['accountHolderName', 'openingAmount'];
    const missingFields = requiredFields.filter(field => !req.body[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: `Required fields missing: ${missingFields.join(', ')}`
      });
    }

    // Create new imprest fund with currentAmount equal to openingAmount
    const newImprestFund = await ImprestFund.create({
      accountHolderName,
      openingAmount,
      openingDate: openingDate || new Date(),
      currentAmount: openingAmount,
      deductionAmount: 0,
      updateAmountAndDate: [{
        amount: openingAmount,
        date: openingDate || new Date()
      }],
      beforeUpdateAmount: [{
        amount: 0, // Initial amount before first update
        date: openingDate || new Date()
      }]
    });

    return res.status(201).json({
      success: true,
      statusCode: 201,
      message: "Imprest fund created successfully",
      data: newImprestFund
    });
  } catch (error) {
    console.error("Error creating imprest fund:", error);
    return res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Error creating imprest fund",
      error: error.message
    });
  }
};

// Get all imprest funds
export const getAllImprestFunds = async (req, res) => {
  try {
    const imprestFunds = await ImprestFund.find().sort({ createdAt: -1 });
    
    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Imprest funds retrieved successfully",
      data: imprestFunds,
      count: imprestFunds.length
    });
  } catch (error) {
    console.error("Error fetching imprest funds:", error);
    return res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Error fetching imprest funds",
      error: error.message
    });
  }
};

// Get a single imprest fund by ID
export const getImprestFundById = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "Invalid imprest fund ID format"
      });
    }
    
    const imprestFund = await ImprestFund.findById(id);
    
    if (!imprestFund) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Imprest fund not found"
      });
    }
    
    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Imprest fund retrieved successfully",
      data: imprestFund
    });
  } catch (error) {
    console.error("Error fetching imprest fund:", error);
    return res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Error fetching imprest fund",
      error: error.message
    });
  }
};

// Update an imprest fund
export const updateImprestFund = async (req, res) => {
  try {
    const { id } = req.params;
    const { accountHolderName, amount } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "Invalid imprest fund ID format"
      });
    }
    
    // Find imprest fund first to check if it exists
    const imprestFund = await ImprestFund.findById(id);
    if (!imprestFund) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Imprest fund not found"
      });
    }
    
    // Prepare update data
    let updateData = {};
    
    if (accountHolderName) {
      updateData.accountHolderName = accountHolderName;
    }
    
    // If amount is provided, update the fund
    if (amount !== undefined) {
      const updateDate = new Date();
      
      // Create update entry
      const updateEntry = {
        amount: Number(amount),
        date: updateDate
      };
      
      // Create before update entry with same date
      const beforeUpdateEntry = {
        amount: imprestFund.currentAmount,
        date: updateDate
      };
      
      // Calculate new current amount
      const newCurrentAmount = imprestFund.currentAmount + Number(amount);
      
      // Update the document
      const updatedImprestFund = await ImprestFund.findByIdAndUpdate(
        id,
        {
          ...updateData,
          currentAmount: newCurrentAmount,
          $push: {
            updateAmountAndDate: updateEntry,
            beforeUpdateAmount: beforeUpdateEntry
          }
        },
        { new: true }
      );
      
      return res.status(200).json({
        success: true,
        statusCode: 200,
        message: "Imprest fund updated successfully",
        data: updatedImprestFund
      });
    } else {
      // If only updating account holder name
      const updatedImprestFund = await ImprestFund.findByIdAndUpdate(
        id,
        updateData,
        { new: true }
      );
      
      return res.status(200).json({
        success: true,
        statusCode: 200,
        message: "Imprest fund updated successfully",
        data: updatedImprestFund
      });
    }
  } catch (error) {
    console.error("Error updating imprest fund:", error);
    return res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Error updating imprest fund",
      error: error.message
    });
  }
};

// Deduct from imprest fund
export const deductFromImprestFund = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "Invalid imprest fund ID format"
      });
    }
    
    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "Valid deduction amount is required"
      });
    }
    
    // Find imprest fund first to check if it exists
    const imprestFund = await ImprestFund.findById(id);
    if (!imprestFund) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Imprest fund not found"
      });
    }
    
    // Check if sufficient balance
    if (imprestFund.currentAmount < amount) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "Insufficient balance for deduction"
      });
    }
    
    const updateDate = new Date();
    
    // Create update entry (negative amount for deduction)
    const updateEntry = {
      amount: -Number(amount),
      date: updateDate
    };
    
    // Create before update entry with same date
    const beforeUpdateEntry = {
      amount: imprestFund.currentAmount,
      date: updateDate
    };
    
    // Calculate new current amount and update deduction amount
    const newCurrentAmount = imprestFund.currentAmount - Number(amount);
    const newDeductionAmount = imprestFund.deductionAmount + Number(amount);
    
    // Update imprest fund
    const updatedImprestFund = await ImprestFund.findByIdAndUpdate(
      id,
      {
        currentAmount: newCurrentAmount,
        deductionAmount: newDeductionAmount,
        $push: {
          updateAmountAndDate: updateEntry,
          beforeUpdateAmount: beforeUpdateEntry
        }
      },
      { new: true }
    );
    
    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Amount deducted from imprest fund successfully",
      data: updatedImprestFund
    });
  } catch (error) {
    console.error("Error deducting from imprest fund:", error);
    return res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Error deducting from imprest fund",
      error: error.message
    });
  }
};

// Delete an imprest fund
export const deleteImprestFund = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "Invalid imprest fund ID format"
      });
    }
    
    const deletedImprestFund = await ImprestFund.findByIdAndDelete(id);
    
    if (!deletedImprestFund) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Imprest fund not found"
      });
    }
    
    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Imprest fund deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting imprest fund:", error);
    return res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Error deleting imprest fund",
      error: error.message
    });
  }
};

// Get imprest fund history
export const getImprestFundHistory = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "Invalid imprest fund ID format"
      });
    }
    
    const imprestFund = await ImprestFund.findById(id);
    
    if (!imprestFund) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Imprest fund not found"
      });
    }
    
    // Create history array with paired entries
    const history = [];
    
    // Ensure both arrays have the same length
    const maxLength = Math.max(
      imprestFund.updateAmountAndDate.length,
      imprestFund.beforeUpdateAmount.length
    );
    
    for (let i = 0; i < maxLength; i++) {
      const entry = {
        date: imprestFund.updateAmountAndDate[i]?.date || imprestFund.beforeUpdateAmount[i]?.date,
        beforeAmount: imprestFund.beforeUpdateAmount[i]?.amount,
        updateAmount: imprestFund.updateAmountAndDate[i]?.amount,
        resultingAmount: i > 0 
          ? (imprestFund.beforeUpdateAmount[i-1]?.amount || 0) + (imprestFund.updateAmountAndDate[i-1]?.amount || 0)
          : imprestFund.openingAmount
      };
      
      history.push(entry);
    }
    
    // Sort by date (newest first)
    history.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Imprest fund history retrieved successfully",
      data: {
        fund: imprestFund,
        history 
      }
    });
  } catch (error) {
    console.error("Error fetching imprest fund history:", error);
    return res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Error fetching imprest fund history",
      error: error.message
    });
  }
};