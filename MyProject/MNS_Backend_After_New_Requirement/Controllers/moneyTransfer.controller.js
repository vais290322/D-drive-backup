import MoneyTransfer from "../Models/moneyTransfer.model.js";
import Bank from "../Models/bank.model.js";
import mongoose from "mongoose";

// Create a new money transfer
export const createMoneyTransfer = async (req, res) => {
  // Start a session for transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { 
      date, 
      transferFromBankId, 
      transferToBankId, 
      transferAmount, 
      transferNote, 
      transferBy 
    } = req.body;

    // Validate required fields
    const requiredFields = [
      'date', 
      'transferFromBankId', 
      'transferToBankId', 
      'transferAmount', 
      'transferNote', 
      'transferBy'
    ];
    
    const missingFields = requiredFields.filter(field => !req.body[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: `Required fields missing: ${missingFields.join(', ')}`
      });
    }

    // Validate bank IDs
    if (!mongoose.Types.ObjectId.isValid(transferFromBankId) || 
        !mongoose.Types.ObjectId.isValid(transferToBankId)) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "Invalid bank ID format"
      });
    }

    // Check if source and destination banks are different
    if (transferFromBankId === transferToBankId) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "Source and destination banks must be different"
      });
    }

    // Validate transfer amount
    if (transferAmount <= 0) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "Transfer amount must be greater than zero"
      });
    }

    // Find source bank
    const sourceBank = await Bank.findById(transferFromBankId).session(session);
    if (!sourceBank) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Source bank account not found"
      });
    }

    // Find destination bank
    const destinationBank = await Bank.findById(transferToBankId).session(session);
    if (!destinationBank) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Destination bank account not found"
      });
    }

    // Check if source bank has sufficient balance
    if (sourceBank.currentAmount < transferAmount) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "Insufficient balance in source bank account"
      });
    }

    // Create new money transfer record
    const newMoneyTransfer = new MoneyTransfer({
      date: new Date(date),
      transferFromBankId,
      transferToBankId,
      transferAmount,
      transferNote,
      transferBy
    });

    // Save the transfer record
    await newMoneyTransfer.save({ session });

    // Update source bank balance
    sourceBank.currentAmount -= Number(transferAmount);
    sourceBank.deductionAmount += Number(transferAmount);
    sourceBank.totalMoneyTransferDebit += Number(transferAmount); // Track money going out
    await sourceBank.save({ session });

    // Update destination bank balance
    destinationBank.currentAmount += Number(transferAmount);
    destinationBank.depositeAmount += Number(transferAmount);
    destinationBank.totalMoneyTransferCredit += Number(transferAmount); // Track money coming in
    await destinationBank.save({ session });

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    // Populate bank details for response
    const populatedTransfer = await MoneyTransfer.findById(newMoneyTransfer._id)
      .populate('transferFromBankId')
      .populate('transferToBankId');

    return res.status(201).json({
      success: true,
      statusCode: 201,
      message: "Money transfer completed successfully",
      data: populatedTransfer
    });
  } catch (error) {
    // Abort transaction in case of error
    await session.abortTransaction();
    session.endSession();
    
    console.error("Error creating money transfer:", error);
    return res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Error creating money transfer",
      error: error.message
    });
  }
};

// Get all money transfers
export const getAllMoneyTransfers = async (req, res) => {
  try {
    const moneyTransfers = await MoneyTransfer.find()
      .populate('transferFromBankId')
      .populate('transferToBankId')
      .sort({ date: -1 });
    
    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Money transfers retrieved successfully",
      data: moneyTransfers,
      count: moneyTransfers.length
    });
  } catch (error) {
    console.error("Error fetching money transfers:", error);
    return res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Error fetching money transfers",
      error: error.message
    });
  }
};

// Get a single money transfer by ID
export const getMoneyTransferById = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "Invalid money transfer ID format"
      });
    }
    
    const moneyTransfer = await MoneyTransfer.findById(id)
      .populate('transferFromBankId')
      .populate('transferToBankId');
    
    if (!moneyTransfer) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Money transfer not found"
      });
    }
    
    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Money transfer retrieved successfully",
      data: moneyTransfer
    });
  } catch (error) {
    console.error("Error fetching money transfer:", error);
    return res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Error fetching money transfer",
      error: error.message
    });
  }
};

// Get money transfers by bank ID (either source or destination)
export const getMoneyTransfersByBankId = async (req, res) => {
  try {
    const { bankId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(bankId)) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "Invalid bank ID format"
      });
    }
    
    const moneyTransfers = await MoneyTransfer.find({
      $or: [
        { transferFromBankId: bankId },
        { transferToBankId: bankId }
      ]
    })
      .populate('transferFromBankId')
      .populate('transferToBankId')
      .sort({ date: -1 });
    
    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Money transfers retrieved successfully",
      data: moneyTransfers,
      count: moneyTransfers.length
    });
  } catch (error) {
    console.error("Error fetching money transfers by bank ID:", error);
    return res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Error fetching money transfers by bank ID",
      error: error.message
    });
  }
};

// Get money transfers by date range
export const getMoneyTransfersByDateRange = async (req, res) => {
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
    
    if (start > end) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "Start date cannot be after end date"
      });
    }
    
    const moneyTransfers = await MoneyTransfer.find({
      date: { $gte: start, $lte: end }
    })
      .populate('transferFromBankId')
      .populate('transferToBankId')
      .sort({ date: -1 });
    
    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Money transfers retrieved successfully",
      data: moneyTransfers,
      count: moneyTransfers.length
    });
  } catch (error) {
    console.error("Error fetching money transfers by date range:", error);
    return res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Error fetching money transfers by date range",
      error: error.message
    });
  }
};