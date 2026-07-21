import SnigdhaExpense from "../SnigdhaModels/snigdhaExpense.model.js";
import SnigdhaImprestFund from "../SnigdhaModels/snigdhaImprestFund.model.js";
import SnigdhaBank from "../SnigdhaModels/snigdhaBank.model.js";
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

    // Ensure amount is a number
    const numericAmount = Number(amount);
    if (isNaN(numericAmount)) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "Amount must be a valid number"
      });
    }

    // Check payment method and handle accordingly
    if (paymentMethod === 'Cash') {
      // Handle cash payment - deduct from imprest fund
      const imprestFund = await SnigdhaImprestFund.findOne();
      
      if (!imprestFund) {
        return res.status(404).json({
          success: false,
          statusCode: 404,
          message: "Imprest fund not found"
        });
      }

      // Check if sufficient balance in imprest fund
      const currentImprestAmount = Number(imprestFund.currentAmount);
      if (currentImprestAmount < numericAmount) {
        return res.status(400).json({
          success: false,
          statusCode: 400,
          message: "Insufficient balance in imprest fund"
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
        amount: currentImprestAmount,
        date: updateDate
      };
      
      // Update imprest fund
      imprestFund.currentAmount = currentImprestAmount - numericAmount;
      imprestFund.deductionAmount = Number(imprestFund.deductionAmount) + numericAmount;
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
      const bank = await SnigdhaBank.findById(bankId);
      
      if (!bank) {
        return res.status(404).json({
          success: false,
          statusCode: 404,
          message: "Bank account not found"
        });
      }

      // Check if sufficient balance in bank
      const currentBankAmount = Number(bank.currentAmount);
      if (currentBankAmount < numericAmount) {
        return res.status(400).json({
          success: false,
          statusCode: 400,
          message: "Insufficient balance in bank account"
        });
      }

      // Update bank
      bank.currentAmount = currentBankAmount - numericAmount;
      bank.deductionAmount = Number(bank.deductionAmount) + numericAmount;
      
      await bank.save();
    }

    // Create expense record
    const newExpense = await SnigdhaExpense.create({
      date: new Date(date),
      voucherNumber,
      paymentPersonName,
      amount: numericAmount,
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
    const expenses = await SnigdhaExpense.find().populate('bankId').sort({ date: -1 });
    
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
    
    const expense = await SnigdhaExpense.findById(id).populate('bankId');
    
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
    const expense = await SnigdhaExpense.findById(id);
    if (!expense) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Expense not found"
      });
    }
    
    // Handle changes in payment method, amount, or bank
    const originalMethod = expense.paymentMethod;
    const originalAmount = Number(expense.amount);
    const originalBankId = expense.bankId ? expense.bankId.toString() : null;
    
    const newMethod = updateData.paymentMethod || originalMethod;
    const newAmount = updateData.amount !== undefined ? Number(updateData.amount) : originalAmount;
    const newBankId = updateData.bankId || originalBankId;
    
    // Ensure amount is a number
    if (updateData.amount !== undefined && isNaN(Number(updateData.amount))) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "Amount must be a valid number"
      });
    }
    
    // Restore original amounts
    if (originalMethod === 'Cash') {
      // Restore amount to imprest fund
      const imprestFund = await SnigdhaImprestFund.findOne();
      if (imprestFund) {
        const updateDate = new Date();
        
        // Create update entry (positive amount for restoration)
        const updateEntry = {
          amount: originalAmount,
          date: updateDate
        };
        
        // Create before update entry with same date
        const beforeUpdateEntry = {
          amount: Number(imprestFund.currentAmount),
          date: updateDate
        };
        
        imprestFund.currentAmount = Number(imprestFund.currentAmount) + originalAmount;
        imprestFund.deductionAmount = Number(imprestFund.deductionAmount) - originalAmount;
        imprestFund.updateAmountAndDate.push(updateEntry);
        imprestFund.beforeUpdateAmount.push(beforeUpdateEntry);
        
        await imprestFund.save();
      }
    } else if (originalMethod === 'Bank' && originalBankId) {
      // Restore amount to original bank
      const originalBank = await SnigdhaBank.findById(originalBankId);
      if (originalBank) {
        originalBank.currentAmount = Number(originalBank.currentAmount) + originalAmount;
        originalBank.deductionAmount = Number(originalBank.deductionAmount) - originalAmount;
        await originalBank.save();
      }
    }
    
    // Apply new deductions
    if (newMethod === 'Cash') {
      // Deduct from imprest fund
      const imprestFund = await SnigdhaImprestFund.findOne();
      
      if (!imprestFund) {
        return res.status(404).json({
          success: false,
          statusCode: 404,
          message: "Imprest fund not found"
        });
      }
      
      // Check if sufficient balance
      const currentImprestAmount = Number(imprestFund.currentAmount);
      if (currentImprestAmount < newAmount) {
        return res.status(400).json({
          success: false,
          statusCode: 400,
          message: "Insufficient balance in imprest fund"
        });
      }
      
      const updateDate = new Date();
      
      // Create update entry (negative amount for deduction)
      const updateEntry = {
        amount: -newAmount,
        date: updateDate
      };
      
      // Create before update entry with same date
      const beforeUpdateEntry = {
        amount: currentImprestAmount,
        date: updateDate
      };
      
      imprestFund.currentAmount = currentImprestAmount - newAmount;
      imprestFund.deductionAmount = Number(imprestFund.deductionAmount) + newAmount;
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
      const bank = await SnigdhaBank.findById(newBankId);
      
      if (!bank) {
        return res.status(404).json({
          success: false,
          statusCode: 404,
          message: "Bank account not found"
        });
      }
      
      // Check if sufficient balance
      const currentBankAmount = Number(bank.currentAmount);
      if (currentBankAmount < newAmount) {
        return res.status(400).json({
          success: false,
          statusCode: 400,
          message: "Insufficient balance in bank account"
        });
      }
      
      // Update bank
      bank.currentAmount = currentBankAmount - newAmount;
      bank.deductionAmount = Number(bank.deductionAmount) + newAmount;
      
      await bank.save();
      
      // Ensure bankId is set
      updateData.bankId = newBankId;
    }
    
    // Update expense
    const updatedExpense = await SnigdhaExpense.findByIdAndUpdate(
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
    const expense = await SnigdhaExpense.findById(id);
    if (!expense) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Expense not found"
      });
    }
    
    // Restore amount based on payment method
    const expenseAmount = Number(expense.amount);
    
    if (expense.paymentMethod === 'Cash') {
      // Restore amount to imprest fund
      const imprestFund = await SnigdhaImprestFund.findOne();
      if (imprestFund) {
        const updateDate = new Date();
        
        // Create update entry (positive amount for restoration)
        const updateEntry = {
          amount: expenseAmount,
          date: updateDate
        };
        
        // Create before update entry with same date
        const beforeUpdateEntry = {
          amount: Number(imprestFund.currentAmount),
          date: updateDate
        };
        
        imprestFund.currentAmount = Number(imprestFund.currentAmount) + expenseAmount;
        imprestFund.deductionAmount = Number(imprestFund.deductionAmount) - expenseAmount;
        imprestFund.updateAmountAndDate.push(updateEntry);
        imprestFund.beforeUpdateAmount.push(beforeUpdateEntry);
        
        await imprestFund.save();
      }
    } else if (expense.paymentMethod === 'Bank' && expense.bankId) {
      // Restore amount to bank
      const bank = await SnigdhaBank.findById(expense.bankId);
      if (bank) {
        bank.currentAmount = Number(bank.currentAmount) + expenseAmount;
        bank.deductionAmount = Number(bank.deductionAmount) - expenseAmount;
        await bank.save();
      }
    }
    
    // Delete expense
    const deletedExpense = await SnigdhaExpense.findByIdAndDelete(id);
    
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
    
    const expenses = await SnigdhaExpense.find({ paymentMethod: method })
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
    
    const expenses = await SnigdhaExpense.find({ bankId })
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