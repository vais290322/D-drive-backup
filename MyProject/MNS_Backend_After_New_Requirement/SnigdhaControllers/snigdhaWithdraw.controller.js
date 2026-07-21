import SnigdhaWithdraw from "../SnigdhaModels/snigdhaWithdraw.model.js";
import SnigdhaBank from "../SnigdhaModels/snigdhaBank.model.js";
import mongoose from "mongoose";

// Create a new withdrawal
export const createWithdraw = async (req, res) => {
  try {
    const {
      transactionType,
      date,
      amount,
      personName,
      voucherNumber,
      description,
      bankId,
    } = req.body;

    // Validate required fields
    const requiredFields = [
      "transactionType",
      "date",
      "amount",
      "personName",
      "voucherNumber",
      "description",
      "bankId",
    ];
    const missingFields = requiredFields.filter((field) => !req.body[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: `Required fields missing: ${missingFields.join(", ")}`,
      });
    }

    // Validate bankId
    if (!mongoose.Types.ObjectId.isValid(bankId)) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "Invalid bank ID format",
      });
    }

    // Ensure amount is a number
    const numericAmount = Number(amount);
    if (isNaN(numericAmount)) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "Amount must be a valid number",
      });
    }

    // Check if bank exists and has sufficient balance
    const bank = await SnigdhaBank.findById(bankId);
    if (!bank) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Bank account not found",
      });
    }

    // Convert bank.currentAmount to number for comparison
    const currentAmount = Number(bank.currentAmount);
    if (currentAmount < numericAmount) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "Insufficient balance for withdrawal",
      });
    }

    // Create new withdrawal
    const newWithdraw = await SnigdhaWithdraw.create({
      transactionType,
      date: new Date(date),
      amount: numericAmount,
      personName,
      voucherNumber,
      description,
      bankId,
    });

    // Update bank balance
    bank.currentAmount = currentAmount - numericAmount;
    bank.deductionAmount = Number(bank.deductionAmount) + numericAmount;
    await bank.save();

    // Populate bank details for response
    const populatedWithdraw = await SnigdhaWithdraw.findById(newWithdraw._id).populate(
      "bankId"
    );

    return res.status(201).json({
      success: true,
      statusCode: 201,
      message: "Withdrawal created successfully",
      data: populatedWithdraw,
    });
  } catch (error) {
    console.error("Error creating withdrawal:", error);
    return res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Error creating withdrawal",
      error: error.message,
    });
  }
};

// Get all withdrawals
export const getAllWithdraws = async (req, res) => {
  try {
    const withdraws = await SnigdhaWithdraw.find()
      .populate("bankId")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Withdrawals retrieved successfully",
      data: withdraws,
      count: withdraws.length,
    });
  } catch (error) {
    console.error("Error fetching withdrawals:", error);
    return res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Error fetching withdrawals",
      error: error.message,
    });
  }
};

// Get a single withdrawal by ID
export const getWithdrawById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "Invalid withdrawal ID format",
      });
    }

    const withdraw = await SnigdhaWithdraw.findById(id).populate("bankId");

    if (!withdraw) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Withdrawal not found",
      });
    }

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Withdrawal retrieved successfully",
      data: withdraw,
    });
  } catch (error) {
    console.error("Error fetching withdrawal:", error);
    return res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Error fetching withdrawal",
      error: error.message,
    });
  }
};

// Update a withdrawal
export const updateWithdraw = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "Invalid withdrawal ID format",
      });
    }

    // Find withdrawal first to check if it exists and get original amount
    const withdraw = await SnigdhaWithdraw.findById(id);
    if (!withdraw) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Withdrawal not found",
      });
    }

    // Ensure amount is a number if provided
    if (updateData.amount !== undefined) {
      updateData.amount = Number(updateData.amount);
      if (isNaN(updateData.amount)) {
        return res.status(400).json({
          success: false,
          statusCode: 400,
          message: "Amount must be a valid number",
        });
      }
    }

    // Handle bank balance updates
    if (updateData.amount !== undefined || updateData.bankId !== undefined) {
      // Get original bank
      const originalBank = await SnigdhaBank.findById(withdraw.bankId);

      if (!originalBank) {
        return res.status(404).json({
          success: false,
          statusCode: 404,
          message: "Original bank account not found",
        });
      }

      // First, restore the original amount to the original bank
      // This reverses the original withdrawal completely
      originalBank.currentAmount = Number(originalBank.currentAmount) + Number(withdraw.amount);
      originalBank.deductionAmount = Number(originalBank.deductionAmount) - Number(withdraw.amount);
      await originalBank.save();

      // Determine which bank to use for the new withdrawal
      let targetBank;
      if (updateData.bankId && updateData.bankId !== withdraw.bankId.toString()) {
        // If bank is changing, get the new bank
        targetBank = await SnigdhaBank.findById(updateData.bankId);
        if (!targetBank) {
          return res.status(404).json({
            success: false,
            statusCode: 404,
            message: "New bank account not found",
          });
        }
      } else {
        // If bank is not changing, use the original bank
        targetBank = originalBank;
      }

      // Determine the new amount to withdraw
      const newAmount = updateData.amount !== undefined ? Number(updateData.amount) : Number(withdraw.amount);

      // Check if target bank has sufficient balance for the new amount
      if (Number(targetBank.currentAmount) < newAmount) {
        // If insufficient balance, restore the original withdrawal
        originalBank.currentAmount = Number(originalBank.currentAmount) - Number(withdraw.amount);
        originalBank.deductionAmount = Number(originalBank.deductionAmount) + Number(withdraw.amount);
        await originalBank.save();

        return res.status(400).json({
          success: false,
          statusCode: 400,
          message: "Insufficient balance for withdrawal",
        });
      }

      // Apply the new withdrawal to the target bank
      targetBank.currentAmount = Number(targetBank.currentAmount) - newAmount;
      targetBank.deductionAmount = Number(targetBank.deductionAmount) + newAmount;
      await targetBank.save();
    }

    // Update withdrawal
    const updatedWithdraw = await SnigdhaWithdraw.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).populate("bankId");

    if (!updatedWithdraw) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Withdrawal not found",
      });
    }

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Withdrawal updated successfully",
      data: updatedWithdraw,
    });
  } catch (error) {
    console.error("Error updating withdrawal:", error);
    return res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Error updating withdrawal",
      error: error.message,
    });
  }
};

// Delete a withdrawal
export const deleteWithdraw = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "Invalid withdrawal ID format",
      });
    }

    // Find withdrawal first to get amount and bank info
    const withdraw = await SnigdhaWithdraw.findById(id);
    if (!withdraw) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Withdrawal not found",
      });
    }

    // Restore amount to bank
    const bank = await SnigdhaBank.findById(withdraw.bankId);
    if (bank) {
      bank.currentAmount = Number(bank.currentAmount) + Number(withdraw.amount);
      bank.deductionAmount = Number(bank.deductionAmount) - Number(withdraw.amount);
      await bank.save();
    }

    // Delete withdrawal
    const deletedWithdraw = await SnigdhaWithdraw.findByIdAndDelete(id);

    if (!deletedWithdraw) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Withdrawal not found",
      });
    }

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Withdrawal deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting withdrawal:", error);
    return res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Error deleting withdrawal",
      error: error.message,
    });
  }
};

// Get withdrawals by bank ID
export const getWithdrawsByBankId = async (req, res) => {
  try {
    const { bankId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(bankId)) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "Invalid bank ID format",
      });
    }

    const withdraws = await SnigdhaWithdraw.find({ bankId })
      .populate("bankId")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Withdrawals retrieved successfully",
      data: withdraws,
      count: withdraws.length,
    });
  } catch (error) {
    console.error("Error fetching withdrawals:", error);
    return res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Error fetching withdrawals",
      error: error.message,
    });
  }
};

// Get withdrawals by transaction type
export const getWithdrawsByType = async (req, res) => {
  try {
    const { type } = req.params;

    const withdraws = await SnigdhaWithdraw.find({ transactionType: type })
      .populate("bankId")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Withdrawals retrieved successfully",
      data: withdraws,
      count: withdraws.length,
    });
  } catch (error) {
    console.error("Error fetching withdrawals:", error);
    return res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Error fetching withdrawals",
      error: error.message,
    });
  }
};