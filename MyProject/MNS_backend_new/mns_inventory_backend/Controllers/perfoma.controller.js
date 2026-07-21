import Perfoma from "../Models/perfoma.model.js";
import mongoose from "mongoose";

// Create a new perfoma invoice
export const createPerfoma = async (req, res) => {
  try {
    const {
      date,
      taxGroup,
      invoiceNumber,
      priceGroup,
      location,
      paymentType,
      items,
      discount,
      taxableAmount,
      taxAmount,
      grandTotal,
      receiverDetails,
    } = req.body;

    // Validate required fields
    if (!invoiceNumber || !paymentType || !items || items.length === 0 || !receiverDetails) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    // Create new perfoma invoice
    const perfoma = await Perfoma.create({
      date: date || new Date().toISOString().split('T')[0],
      taxGroup,
      invoiceNumber,
      priceGroup,
      location,
      paymentType,
      items,
      discount,
      taxableAmount,
      taxAmount,
      grandTotal,
      receiverDetails,
    });

    res.status(201).json({
      success: true,
      message: "Perfoma invoice created successfully",
      data: perfoma,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create perfoma invoice",
      error: error.message,
    });
  }
};

// Get all perfoma invoices
export const getAllPerfomas = async (req, res) => {
  try {
    const perfomas = await Perfoma.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: perfomas.length,
      message: "Perfoma invoices retrieved successfully",
      data: perfomas,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve perfoma invoices",
      error: error.message,
    });
  }
};

// Get a single perfoma invoice by ID
export const getPerfomaById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid perfoma invoice ID format",
      });
    }

    const perfoma = await Perfoma.findById(id);

    if (!perfoma) {
      return res.status(404).json({
        success: false,
        message: "Perfoma invoice not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Perfoma invoice retrieved successfully",
      data: perfoma,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve perfoma invoice",
      error: error.message,
    });
  }
};

// Get perfoma invoices by invoice number
export const getPerfomaByInvoiceNumber = async (req, res) => {
  try {
    const { invoiceNumber } = req.params;

    const perfoma = await Perfoma.findOne({ invoiceNumber });

    if (!perfoma) {
      return res.status(404).json({
        success: false,
        message: "Perfoma invoice not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Perfoma invoice retrieved successfully",
      data: perfoma,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve perfoma invoice",
      error: error.message,
    });
  }
};

// Update a perfoma invoice
export const updatePerfoma = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid perfoma invoice ID format",
      });
    }

    // Find and update the perfoma invoice
    const updatedPerfoma = await Perfoma.findByIdAndUpdate(
      id,
      { ...updateData },
      { new: true, runValidators: true }
    );

    if (!updatedPerfoma) {
      return res.status(404).json({
        success: false,
        message: "Perfoma invoice not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Perfoma invoice updated successfully",
      data: updatedPerfoma,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update perfoma invoice",
      error: error.message,
    });
  }
};

// Delete a perfoma invoice
export const deletePerfoma = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid perfoma invoice ID format",
      });
    }

    const deletedPerfoma = await Perfoma.findByIdAndDelete(id);

    if (!deletedPerfoma) {
      return res.status(404).json({
        success: false,
        message: "Perfoma invoice not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Perfoma invoice deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete perfoma invoice",
      error: error.message,
    });
  }
};

// Get perfoma invoices by receiver ID
export const getPerfomasByReceiverId = async (req, res) => {
  try {
    const { receiverId } = req.params;

    const perfomas = await Perfoma.find({ "receiverDetails.id": receiverId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: perfomas.length,
      message: "Perfoma invoices retrieved successfully",
      data: perfomas,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve perfoma invoices",
      error: error.message,
    });
  }
};