import SnigdhaDepositCredit from "../SnigdhaModels/snigdhaDepositCredit.model.js";
import SnigdhaBank from "../SnigdhaModels/snigdhaBank.model.js";
import mongoose from "mongoose"; 

// Create a new deposit credit entry
export const createDepositCredit = async (req, res) => {
  try {
    const { date, amount, transactionId, invoiceNumber, paymentMethod, invoiceId, bankId,  } = req.body;

    // Validate required fields
    const requiredFields = ['date', 'amount', 'transactionId', 'invoiceNumber', 'paymentMethod', 'bankId', ];
    const missingFields = requiredFields.filter(field => !req.body[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: `Required fields missing: ${missingFields.join(', ')}`
      });
    }

    // Validate bankId
    if (bankId && !mongoose.Types.ObjectId.isValid(bankId)) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "Invalid bank ID format"
      });
    }

    // Create new deposit credit entry
    const newDepositCredit = await SnigdhaDepositCredit.create({
      date: new Date(date),
      amount,
      transactionId,
      invoiceNumber,
      paymentMethod,
      invoiceId,
      bankId,
    });

    // Update bank balance
    if (bankId) {
      const bank = await SnigdhaBank.findById(bankId);
      if (bank) {
        bank.currentAmount += Number(amount);
        bank.depositeAmount += Number(amount);
        await bank.save();
      }
    }

    // Populate bank details for response
    const populatedDepositCredit = await SnigdhaDepositCredit.findById(newDepositCredit._id)
      .populate('bankId')
      .populate('invoiceId');

    return res.status(201).json({
      success: true,
      statusCode: 201,
      message: "Deposit credit entry created successfully",
      data: populatedDepositCredit
    });
  } catch (error) {
    console.error("Error creating deposit credit entry:", error);
    return res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Error creating deposit credit entry",
      error: error.message
    });
  }
};

// Get all deposit credit entries
export const getAllDepositCredits = async (req, res) => {
  try {
    const depositCredits = await SnigdhaDepositCredit.find()
      .populate('bankId')
      .populate('invoiceId')
      .sort({ createdAt: -1 });
    
    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Deposit credit entries retrieved successfully",
      data: depositCredits,
      count: depositCredits.length
    });
  } catch (error) {
    console.error("Error fetching deposit credit entries:", error);
    return res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Error fetching deposit credit entries",
      error: error.message
    });
  }
};

// Get a single deposit credit entry by ID
export const getDepositCreditById = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "Invalid deposit credit ID format"
      });
    }
    
    const depositCredit = await SnigdhaDepositCredit.findById(id)
      .populate('bankId')
      .populate('invoiceId');
    
    if (!depositCredit) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Deposit credit entry not found"
      });
    }
    
    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Deposit credit entry retrieved successfully",
      data: depositCredit
    });
  } catch (error) {
    console.error("Error fetching deposit credit entry:", error);
    return res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Error fetching deposit credit entry",
      error: error.message
    });
  }
};

// Update a deposit credit entry
export const updateDepositCredit = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "Invalid deposit credit ID format"
      });
    }
    
    // Find deposit credit first to check if it exists and get original amount
    const depositCredit = await SnigdhaDepositCredit.findById(id);
    if (!depositCredit) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Deposit credit entry not found"
      });
    }
    
    // If amount is being updated, adjust bank balance
    if (updateData.amount && updateData.amount !== depositCredit.amount) {
      const amountDifference = Number(updateData.amount) - Number(depositCredit.amount);
      
      if (depositCredit.bankId) {
        const bank = await SnigdhaBank.findById(depositCredit.bankId);
        if (bank) {
          bank.currentAmount += amountDifference;
          bank.depositeAmount += amountDifference;
          await bank.save();
        }
      }
    }
    
    // If bank is being changed, adjust both banks' balances
    if (updateData.bankId && updateData.bankId !== depositCredit.bankId.toString()) {
      // Deduct from old bank
      if (depositCredit.bankId) {
        const oldBank = await SnigdhaBank.findById(depositCredit.bankId);
        if (oldBank) {
          oldBank.currentAmount -= Number(depositCredit.amount);
          oldBank.depositeAmount -= Number(depositCredit.amount);
          await oldBank.save();
        }
      }
      
      // Add to new bank
      const newBank = await SnigdhaBank.findById(updateData.bankId);
      if (newBank) {
        newBank.currentAmount += Number(updateData.amount || depositCredit.amount);
        newBank.depositeAmount += Number(updateData.amount || depositCredit.amount);
        await newBank.save();
      }
    }
    
    // Update deposit credit entry
    const updatedDepositCredit = await SnigdhaDepositCredit.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('bankId').populate('invoiceId');
    
    if (!updatedDepositCredit) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Deposit credit entry not found"
      });
    }
    
    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Deposit credit entry updated successfully",
      data: updatedDepositCredit
    });
  } catch (error) {
    console.error("Error updating deposit credit entry:", error);
    return res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Error updating deposit credit entry",
      error: error.message
    });
  }
};

// Delete a deposit credit entry
export const deleteDepositCredit = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "Invalid deposit credit ID format"
      });
    }
    
    // Find deposit credit first to get amount and bank info
    const depositCredit = await SnigdhaDepositCredit.findById(id);
    if (!depositCredit) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Deposit credit entry not found"
      });
    }
    
    // Adjust bank balance
    if (depositCredit.bankId) {
      const bank = await SnigdhaBank.findById(depositCredit.bankId);
      if (bank) {
        bank.currentAmount -= Number(depositCredit.amount);
        bank.depositeAmount -= Number(depositCredit.amount);
        await bank.save();
      }
    }
    
    // Delete deposit credit entry
    const deletedDepositCredit = await SnigdhaDepositCredit.findByIdAndDelete(id);
    
    if (!deletedDepositCredit) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Deposit credit entry not found"
      });
    }
    
    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Deposit credit entry deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting deposit credit entry:", error);
    return res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Error deleting deposit credit entry",
      error: error.message
    });
  }
};

// Get deposit credit entries by invoice ID
export const getDepositCreditsByInvoiceId = async (req, res) => {
  try {
    const { invoiceId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(invoiceId)) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "Invalid invoice ID format"
      });
    }
    
    const depositCredits = await SnigdhaDepositCredit.find({ invoiceId })
      .populate('bankId')
      .populate('invoiceId')
      .sort({ createdAt: -1 });
    
    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Deposit credit entries retrieved successfully",
      data: depositCredits,
      count: depositCredits.length
    });
  } catch (error) {
    console.error("Error fetching deposit credit entries:", error);
    return res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Error fetching deposit credit entries",
      error: error.message
    });
  }
};

// Get deposit credit entries by bank ID
export const getDepositCreditsByBankId = async (req, res) => {
  try {
    const { bankId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(bankId)) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "Invalid bank ID format"
      });
    }
    
    const depositCredits = await SnigdhaDepositCredit.find({ bankId })
      .populate('bankId')
      .populate('invoiceId')
      .sort({ createdAt: -1 });
    
    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Deposit credit entries retrieved successfully",
      data: depositCredits,
      count: depositCredits.length
    });
  } catch (error) {
    console.error("Error fetching deposit credit entries:", error);
    return res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Error fetching deposit credit entries",
      error: error.message
    });
  }
};