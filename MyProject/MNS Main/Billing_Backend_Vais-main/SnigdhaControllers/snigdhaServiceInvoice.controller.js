import SnigdhaServiceInvoice from "../SnigdhaModels/snigdhaServiceInvoice.model.js";

// Create a new service invoice
export const createServiceInvoice = async (req, res) => {
  try {
    const newInvoice = new SnigdhaServiceInvoice(req.body);
    const savedInvoice = await newInvoice.save();
    res.status(201).json({
      success: true,
      message: "Invoice created successfully",
      data: savedInvoice,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all service invoices
export const getAllServiceInvoices = async (req, res) => {
  try {
    const invoices = await SnigdhaServiceInvoice.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: invoices.length,
      data: invoices,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get single service invoice by ID
export const getServiceInvoiceById = async (req, res) => {
  try {
    const invoice = await SnigdhaServiceInvoice.findById(req.params.id);
    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found",
      });
    }
    res.status(200).json({
      success: true,
      data: invoice,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update service invoice
export const updateServiceInvoice = async (req, res) => {
  try {
    const invoice = await SnigdhaServiceInvoice.findByIdAndUpdate(
      req.params.id,
      req.body,
      {new: true, runValidators: true}
    );

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Invoice updated successfully",
      data: invoice,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete service invoice
export const deleteServiceInvoice = async (req, res) => {
  try {
    const invoice = await SnigdhaServiceInvoice.findByIdAndDelete(
      req.params.id
    );

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Invoice deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get invoices by date range
export const getInvoicesByDateRange = async (req, res) => {
  try {
    const {startDate, endDate} = req.query;
    const invoices = await SnigdhaServiceInvoice.find({
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    });

    res.status(200).json({
      success: true,
      count: invoices.length,
      data: invoices,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
