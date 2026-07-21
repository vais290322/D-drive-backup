import SnigdhaImprestFund from "../SnigdhaModels/snigdhaImprestFund.model.js";
import mongoose from "mongoose";

// Create a new imprest fund 
export const createImprestFund = async (req, res) => {
  try {
    const { accountHolderName, openingAmount, openingDate } = req.body;

    // Check if an imprest fund already exists
    const existingFund = await SnigdhaImprestFund.findOne();
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

    // Ensure openingAmount is a number
    const numericOpeningAmount = Number(openingAmount);
    if (isNaN(numericOpeningAmount)) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "Opening amount must be a valid number"
      });
    }

    // Create new imprest fund with currentAmount equal to openingAmount
    const newImprestFund = await SnigdhaImprestFund.create({
      accountHolderName,
      openingAmount: numericOpeningAmount,
      openingDate: openingDate || new Date(),
      currentAmount: numericOpeningAmount,
      deductionAmount: 0,
      updateAmountAndDate: [{
        amount: numericOpeningAmount,
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
    const imprestFunds = await SnigdhaImprestFund.find().sort({ createdAt: -1 });
    
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
    
    const imprestFund = await SnigdhaImprestFund.findById(id);
    
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
    const imprestFund = await SnigdhaImprestFund.findById(id);
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
      // Ensure amount is a number
      const numericAmount = Number(amount);
      if (isNaN(numericAmount)) {
        return res.status(400).json({
          success: false,
          statusCode: 400,
          message: "Amount must be a valid number"
        });
      }

      const updateDate = new Date();
      
      // Create update entry
      const updateEntry = {
        amount: numericAmount,
        date: updateDate
      };
      
      // Create before update entry with same date
      const beforeUpdateEntry = {
        amount: Number(imprestFund.currentAmount),
        date: updateDate
      };
      
      // Calculate new current amount
      const newCurrentAmount = Number(imprestFund.currentAmount) + numericAmount;
      
      // Update the document
      const updatedImprestFund = await SnigdhaImprestFund.findByIdAndUpdate(
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
      const updatedImprestFund = await SnigdhaImprestFund.findByIdAndUpdate(
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
    
    // Ensure amount is a number
    const numericAmount = Number(amount);
    if (!amount || isNaN(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "Valid deduction amount is required"
      });
    }
    
    // Find imprest fund first to check if it exists
    const imprestFund = await SnigdhaImprestFund.findById(id);
    if (!imprestFund) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Imprest fund not found"
      });
    }
    
    // Check if sufficient balance
    const currentAmount = Number(imprestFund.currentAmount);
    if (currentAmount < numericAmount) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "Insufficient balance for deduction"
      });
    }
    
    const updateDate = new Date();
    
    // Create update entry (negative amount for deduction)
    const updateEntry = {
      amount: -numericAmount,
      date: updateDate
    };
    
    // Create before update entry with same date
    const beforeUpdateEntry = {
      amount: currentAmount,
      date: updateDate
    };
    
    // Calculate new current amount and update deduction amount
    const newCurrentAmount = currentAmount - numericAmount;
    const newDeductionAmount = Number(imprestFund.deductionAmount) + numericAmount;
    
    // Update imprest fund
    const updatedImprestFund = await SnigdhaImprestFund.findByIdAndUpdate(
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
    
    const deletedImprestFund = await SnigdhaImprestFund.findByIdAndDelete(id);
    
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
    
    const imprestFund = await SnigdhaImprestFund.findById(id);
    
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
        beforeAmount: Number(imprestFund.beforeUpdateAmount[i]?.amount || 0),
        updateAmount: Number(imprestFund.updateAmountAndDate[i]?.amount || 0),
        resultingAmount: i > 0 
          ? Number(imprestFund.beforeUpdateAmount[i-1]?.amount || 0) + Number(imprestFund.updateAmountAndDate[i-1]?.amount || 0)
          : Number(imprestFund.openingAmount)
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