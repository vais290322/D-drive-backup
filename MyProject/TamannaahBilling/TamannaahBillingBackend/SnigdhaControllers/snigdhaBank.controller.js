import SnigdhaBank from "../SnigdhaModels/snigdhaBank.model.js";

// Create a new bank account
export const createBank = async (req, res) => {
  try {
    const {
      accountHolderName,
      bankName,
      accountNumber,
      ifscCode,
      branch,
      openingAmount,
    } = req.body;

    // Validate required fields
    const requiredFields = ['accountHolderName', 'bankName', 'accountNumber', 'ifscCode', 'branch', 'openingAmount'];
    const missingFields = requiredFields.filter(field => !req.body[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: `Required fields missing: ${missingFields.join(', ')}`
      });
    }

    // Check if account number already exists
    const existingBank = await SnigdhaBank.findOne({ accountNumber });
    if (existingBank) {
      return res.status(409).json({
        success: false,
        statusCode: 409,
        message: "Bank account with this account number already exists"
      });
    }

    // Create new bank account
    const newBank = await SnigdhaBank.create({
      accountHolderName,
      bankName,
      accountNumber,
      ifscCode,
      branch,
      openingAmount,
      deductionAmount: 0,
      currentAmount: openingAmount || 0,
      depositeAmount: 0
    });

    return res.status(201).json({
      success: true,
      statusCode: 201,
      message: "Bank account created successfully",
      data: newBank
    });
  } catch (error) {
    console.error("Error creating bank account:", error);
    return res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Error creating bank account",
      error: error.message
    });
  }
};

// Get all bank accounts
export const getAllBanks = async (req, res) => {
  try {
    const banks = await SnigdhaBank.find().sort({ createdAt: -1 }); // Sort by creation date in descending order
    
    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Bank accounts retrieved successfully",
      data: banks,
      count: banks.length
    });
  } catch (error) {
    console.error("Error fetching bank accounts:", error);
    return res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Error fetching bank accounts",
      error: error.message
    });
  }
};

// Get a single bank account by ID
export const getBankById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const bank = await SnigdhaBank.findById(id);
    
    if (!bank) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Bank account not found"
      });
    }
    
    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Bank account retrieved successfully",
      data: bank
    });
  } catch (error) {
    console.error("Error fetching bank account:", error);
    return res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Error fetching bank account",
      error: error.message
    });
  }
};

// Update a bank account
export const updateBank = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // Find bank first to check if it exists
    const bank = await SnigdhaBank.findById(id);
    if (!bank) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Bank account not found"
      });
    }
    
    // If account number is being updated, check if it already exists
    if (updateData.accountNumber && updateData.accountNumber !== bank.accountNumber) {
      const existingBank = await SnigdhaBank.findOne({ 
        accountNumber: updateData.accountNumber,
        _id: { $ne: id }
      });
      
      if (existingBank) {
        return res.status(409).json({
          success: false,
          statusCode: 409,
          message: "Bank account with this account number already exists"
        });
      }
    }
    
    // Update bank account
    const updatedBank = await SnigdhaBank.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Bank account updated successfully",
      data: updatedBank
    });
  } catch (error) {
    console.error("Error updating bank account:", error);
    return res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Error updating bank account",
      error: error.message
    });
  }
};

// Delete a bank account
export const deleteBank = async (req, res) => {
  try {
    const { id } = req.params;
    
    const deletedBank = await SnigdhaBank.findByIdAndDelete(id);
    
    if (!deletedBank) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Bank account not found"
      });
    }
    
    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Bank account deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting bank account:", error);
    return res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Error deleting bank account",
      error: error.message
    });
  }
};

// Update bank balance (deposit or deduction)
export const updateBankBalance = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, transactionType } = req.body;
    
    // Validate required fields
    if (!amount || !transactionType) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "Amount and transaction type are required"
      });
    }
    
    // Validate transaction type
    if (!['deposit', 'deduction'].includes(transactionType)) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "Transaction type must be either 'deposit' or 'deduction'"
      });
    }
    
    // Find bank account
    const bank = await SnigdhaBank.findById(id);
    if (!bank) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Bank account not found"
      });
    }
    
    // Update balance based on transaction type
    let updateData = {};
    if (transactionType === 'deposit') {
      updateData = {
        depositeAmount: bank.depositeAmount + Number(amount),
        currentAmount: bank.currentAmount + Number(amount)
      };
    } else {
      // Check if sufficient balance
      if (bank.currentAmount < amount) {
        return res.status(400).json({
          success: false,
          statusCode: 400,
          message: "Insufficient balance for deduction"
        });
      }
      
      updateData = {
        deductionAmount: bank.deductionAmount + Number(amount),
        currentAmount: bank.currentAmount - Number(amount)
      };
    }
    
    // Update bank account
    const updatedBank = await SnigdhaBank.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );
    
    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: `Bank balance ${transactionType === 'deposit' ? 'deposited' : 'deducted'} successfully`,
      data: updatedBank
    });
  } catch (error) {
    console.error("Error updating bank balance:", error);
    return res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Error updating bank balance",
      error: error.message
    });
  }
};