import Expense from "../Models/expense.model.js";
import ImprestFund from "../Models/imprestFund.model.js";
import Bank from "../Models/bank.model.js";
import mongoose from "mongoose"; 

// Create a new expense
export const createExpense = async (req, res) => {
  try {
    const { date, voucherNumber, paymentPersonName, amount, description, paymentMethod, bankId } = req.body;

    // Validate required fields
    const requiredFields = ['date', 'voucherNumber', 'paymentPersonName', 'amount', 'description', 'paymentMethod'];
    const missingFields = requiredFields.filter(field => !req.body[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: `Required fields missing: ${missingFields.join(', ')}`
      });
    }

    // Check payment method and handle accordingly
    if (paymentMethod === 'Cash') {
      // Handle cash payment - deduct from imprest fund
      const imprestFund = await ImprestFund.findOne();
      
      if (!imprestFund) {
        return res.status(404).json({
          success: false,
          statusCode: 404,
          message: "Imprest fund not found"
        });
      }

      // Check if sufficient balance in imprest fund
      if (imprestFund.currentAmount < amount) {
        return res.status(400).json({
          success: false,
          statusCode: 400,
          message: "Insufficient balance in imprest fund"
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
      
      // Update imprest fund
      imprestFund.currentAmount -= Number(amount);
      imprestFund.deductionAmount += Number(amount);
      imprestFund.updateAmountAndDate.push(updateEntry);
      imprestFund.beforeUpdateAmount.push(beforeUpdateEntry);
      
      await imprestFund.save();
      
    } else if (paymentMethod === 'Bank') {
      // Handle bank payment - check if bankId is provided
      if (!bankId) {
        return res.status(400).json({
          success: false,
          statusCode: 400,
          message: "Bank ID is required for bank payments"
        });
      }

      // Validate bankId
      if (!mongoose.Types.ObjectId.isValid(bankId)) {
        return res.status(400).json({
          success: false,
          statusCode: 400,
          message: "Invalid bank ID format"
        });
      }

      // Find bank and update
      const bank = await Bank.findById(bankId);
      
      if (!bank) {
        return res.status(404).json({
          success: false,
          statusCode: 404,
          message: "Bank account not found"
        });
      }

      // Check if sufficient balance in bank
      if (bank.currentAmount < amount) {
        return res.status(400).json({
          success: false,
          statusCode: 400,
          message: "Insufficient balance in bank account"
        });
      }

      // Update bank
      bank.currentAmount -= Number(amount);
      bank.deductionAmount += Number(amount);
      
      await bank.save();
    }

    // Create expense record
    const newExpense = await Expense.create({
      date: new Date(date),
      voucherNumber,
      paymentPersonName,
      amount,
      description,
      paymentMethod,
      bankId: paymentMethod === 'Bank' ? bankId : null
    });

    // Populate bank details if payment method is Bank
    if (paymentMethod === 'Bank' && bankId) {
      await newExpense.populate('bankId');
    }

    return res.status(201).json({
      success: true,
      statusCode: 201,
      message: "Expense created successfully",
      data: newExpense
    });
  } catch (error) {
    console.error("Error creating expense:", error);
    return res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Error creating expense",
      error: error.message
    });
  }
};

// Get all expenses
export const getAllExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find().populate('bankId').sort({ date: -1 });
    
    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Expenses retrieved successfully",
      data: expenses,
      count: expenses.length
    });
  } catch (error) {
    console.error("Error fetching expenses:", error);
    return res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Error fetching expenses",
      error: error.message
    });
  }
};

// Get a single expense by ID
export const getExpenseById = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "Invalid expense ID format"
      });
    }
    
    const expense = await Expense.findById(id).populate('bankId');
    
    if (!expense) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Expense not found"
      });
    }
    
    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Expense retrieved successfully",
      data: expense
    });
  } catch (error) {
    console.error("Error fetching expense:", error);
    return res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Error fetching expense",
      error: error.message
    });
  }
};

// Update an expense
export const updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "Invalid expense ID format"
      });
    }
    
    // Find expense first to check if it exists and get original data
    const expense = await Expense.findById(id);
    if (!expense) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Expense not found"
      });
    }
    
    // Handle changes in payment method, amount, or bank
    const originalMethod = expense.paymentMethod;
    const originalAmount = expense.amount;
    const originalBankId = expense.bankId ? expense.bankId.toString() : null;
    
    const newMethod = updateData.paymentMethod || originalMethod;
    const newAmount = updateData.amount !== undefined ? Number(updateData.amount) : originalAmount;
    const newBankId = updateData.bankId || originalBankId;
    
    // Restore original amounts
    if (originalMethod === 'Cash') {
      // Restore amount to imprest fund
      const imprestFund = await ImprestFund.findOne();
      if (imprestFund) {
        const updateDate = new Date();
        
        // Create update entry (positive amount for restoration)
        const updateEntry = {
          amount: Number(originalAmount),
          date: updateDate
        };
        
        // Create before update entry with same date
        const beforeUpdateEntry = {
          amount: imprestFund.currentAmount,
          date: updateDate
        };
        
        imprestFund.currentAmount += Number(originalAmount);
        imprestFund.deductionAmount -= Number(originalAmount);
        imprestFund.updateAmountAndDate.push(updateEntry);
        imprestFund.beforeUpdateAmount.push(beforeUpdateEntry);
        
        await imprestFund.save();
      }
    } else if (originalMethod === 'Bank' && originalBankId) {
      // Restore amount to original bank
      const originalBank = await Bank.findById(originalBankId);
      if (originalBank) {
        originalBank.currentAmount += Number(originalAmount);
        originalBank.deductionAmount -= Number(originalAmount);
        await originalBank.save();
      }
    }
    
    // Apply new deductions
    if (newMethod === 'Cash') {
      // Deduct from imprest fund
      const imprestFund = await ImprestFund.findOne();
      
      if (!imprestFund) {
        return res.status(404).json({
          success: false,
          statusCode: 404,
          message: "Imprest fund not found"
        });
      }
      
      // Check if sufficient balance
      if (imprestFund.currentAmount < newAmount) {
        return res.status(400).json({
          success: false,
          statusCode: 400,
          message: "Insufficient balance in imprest fund"
        });
      }
      
      const updateDate = new Date();
      
      // Create update entry (negative amount for deduction)
      const updateEntry = {
        amount: -Number(newAmount),
        date: updateDate
      };
      
      // Create before update entry with same date
      const beforeUpdateEntry = {
        amount: imprestFund.currentAmount,
        date: updateDate
      };
      
      imprestFund.currentAmount -= Number(newAmount);
      imprestFund.deductionAmount += Number(newAmount);
      imprestFund.updateAmountAndDate.push(updateEntry);
      imprestFund.beforeUpdateAmount.push(beforeUpdateEntry);
      
      await imprestFund.save();
      
      // Clear bankId if switching from Bank to Cash
      updateData.bankId = null;
      
    } else if (newMethod === 'Bank') {
      // Check if bankId is provided
      if (!newBankId) {
        return res.status(400).json({
          success: false,
          statusCode: 400,
          message: "Bank ID is required for bank payments"
        });
      }
      
      // Validate bankId
      if (!mongoose.Types.ObjectId.isValid(newBankId)) {
        return res.status(400).json({
          success: false,
          statusCode: 400,
          message: "Invalid bank ID format"
        });
      }
      
      // Find bank and update
      const bank = await Bank.findById(newBankId);
      
      if (!bank) {
        return res.status(404).json({
          success: false,
          statusCode: 404,
          message: "Bank account not found"
        });
      }
      
      // Check if sufficient balance
      if (bank.currentAmount < newAmount) {
        return res.status(400).json({
          success: false,
          statusCode: 400,
          message: "Insufficient balance in bank account"
        });
      }
      
      // Update bank
      bank.currentAmount -= Number(newAmount);
      bank.deductionAmount += Number(newAmount);
      
      await bank.save();
      
      // Ensure bankId is set
      updateData.bankId = newBankId;
    }
    
    // Update expense
    const updatedExpense = await Expense.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('bankId');
    
    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Expense updated successfully",
      data: updatedExpense
    });
  } catch (error) {
    console.error("Error updating expense:", error);
    return res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Error updating expense",
      error: error.message
    });
  }
};

// Delete an expense
export const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "Invalid expense ID format"
      });
    }
    
    // Find expense first to get payment method and amount
    const expense = await Expense.findById(id);
    if (!expense) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Expense not found"
      });
    }
    
    // Restore amount based on payment method
    if (expense.paymentMethod === 'Cash') {
      // Restore amount to imprest fund
      const imprestFund = await ImprestFund.findOne();
      if (imprestFund) {
        const updateDate = new Date();
        
        // Create update entry (positive amount for restoration)
        const updateEntry = {
          amount: Number(expense.amount),
          date: updateDate
        };
        
        // Create before update entry with same date
        const beforeUpdateEntry = {
          amount: imprestFund.currentAmount,
          date: updateDate
        };
        
        imprestFund.currentAmount += Number(expense.amount);
        imprestFund.deductionAmount -= Number(expense.amount);
        imprestFund.updateAmountAndDate.push(updateEntry);
        imprestFund.beforeUpdateAmount.push(beforeUpdateEntry);
        
        await imprestFund.save();
      }
    } else if (expense.paymentMethod === 'Bank' && expense.bankId) {
      // Restore amount to bank
      const bank = await Bank.findById(expense.bankId);
      if (bank) {
        bank.currentAmount += Number(expense.amount);
        bank.deductionAmount -= Number(expense.amount);
        await bank.save();
      }
    }
    
    // Delete expense
    const deletedExpense = await Expense.findByIdAndDelete(id);
    
    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Expense deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting expense:", error);
    return res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Error deleting expense",
      error: error.message
    });
  }
};

// Get expenses by payment method
export const getExpensesByPaymentMethod = async (req, res) => {
  try {
    const { method } = req.params;
    
    if (!['Cash', 'Bank'].includes(method)) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "Invalid payment method. Must be 'Cash' or 'Bank'"
      });
    }
    
    const expenses = await Expense.find({ paymentMethod: method })
      .populate('bankId')
      .sort({ date: -1 });
    
    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: `Expenses with payment method '${method}' retrieved successfully`,
      data: expenses,
      count: expenses.length
    });
  } catch (error) {
    console.error("Error fetching expenses by payment method:", error);
    return res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Error fetching expenses by payment method",
      error: error.message
    });
  }
};

// Get expenses by bank ID
export const getExpensesByBankId = async (req, res) => {
  try {
    const { bankId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(bankId)) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "Invalid bank ID format"
      });
    }
    
    const expenses = await Expense.find({ bankId })
      .populate('bankId')
      .sort({ date: -1 });
    
    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Expenses for specified bank retrieved successfully",
      data: expenses,
      count: expenses.length
    });
  } catch (error) {
    console.error("Error fetching expenses by bank ID:", error);
    return res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Error fetching expenses by bank ID",
      error: error.message
    });
  }
};