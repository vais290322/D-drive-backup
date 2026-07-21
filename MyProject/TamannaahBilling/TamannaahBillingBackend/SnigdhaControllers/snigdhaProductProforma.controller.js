import SnigdhaProductProformaInvoice from "../SnigdhaModels/snigdhaProductProforma.model.js";

// Helper function to convert string numbers to actual numbers
const convertStringToNumber = (data) => {
  if (data.transportationCharges) {
    data.transportationCharges = Number(data.transportationCharges);
  }

  if (data.items && Array.isArray(data.items)) {
    data.items = data.items.map((item) => ({
      ...item,
      quantity: Number(item.quantity),
      cgst: Number(item.cgst || 0),
      sgst: Number(item.sgst || 0),
      igst: Number(item.igst || 0),
      unitPrice: Number(item.unitPrice || 0),
      grossAmount: Number(item.grossAmount),
      discountRate: Number(item.discountRate || 0),
      discountAmount: Number(item.discountAmount || 0),
      netAmount: Number(item.netAmount || 0),
      taxRate: Number(item.taxRate || 0),
      taxAmount: Number(item.taxAmount || 0),
      amount: Number(item.amount || 0),
      sellingPrice: Number(item.sellingPrice || 0),
    }));
  }

  return {
    ...data,
    discount: Number(data.discount || 0),
    taxableAmount: Number(data.taxableAmount || 0),
    taxAmount: Number(data.taxAmount || 0),
    grandTotal: Number(data.grandTotal),
  };
};

// Validate required fields
const validateProforma = (data) => {
  const required = [
    "invoiceNumber",
    "paymentType",
    "grandTotal",
    "receiverDetails.name",
  ];

  const missing = required.filter((field) => {
    if (field.includes(".")) {
      const [obj, prop] = field.split(".");
      return !data[obj] || !data[obj][prop];
    }
    return !data[field];
  });

  if (missing.length > 0) {
    throw new Error(`Missing required fields: ${missing.join(", ")}`);
  }

  // Validate items array
  if (!data.items || !Array.isArray(data.items) || data.items.length === 0) {
    throw new Error("At least one item is required");
  }

  data.items.forEach((item, index) => {
    const requiredItemFields = [
      "itemName",
      "quantity",
      "hsnCode",
      "grossAmount",
    ];
    const missingItemFields = requiredItemFields.filter(
      (field) => !item[field]
    );
    if (missingItemFields.length > 0) {
      throw new Error(
        `Item ${index + 1} missing required fields: ${missingItemFields.join(
          ", "
        )}`
      );
    }
  });
};

// Create new proforma invoice
export const createProformaInvoice = async (req, res) => {
  try {
    const data = convertStringToNumber(req.body);
    validateProforma(data);

    const proforma = new SnigdhaProductProformaInvoice(data);
    const savedProforma = await proforma.save();

    res.status(201).json({
      success: true,
      message: "Proforma invoice created successfully",
      data: savedProforma,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all proforma invoices with filters and pagination
export const getAllProformaInvoices = async (req, res) => {
  try {
    const { search } = req.query;

    let query = {};
    if (search) {
      query = {
        $or: [
          { invoiceNumber: { $regex: search, $options: "i" } },
          { "receiverDetails.name": { $regex: search, $options: "i" } },
        ],
      };
    }

    const proformas = await SnigdhaProductProformaInvoice.find(query)
      .sort({ createdAt: -1 }); // Sort by creation date in descending order

    res.status(200).json({
      success: true,
      count: proformas.length,
      data: proformas,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get single proforma invoice
export const getProformaInvoiceById = async (req, res) => {
  try {
    const proforma = await SnigdhaProductProformaInvoice.findById(
      req.params.id
    );
    if (!proforma) {
      return res.status(404).json({
        success: false,
        message: "Proforma invoice not found",
      });
    }

    res.status(200).json({
      success: true,
      data: proforma,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update proforma invoice
export const updateProformaInvoice = async (req, res) => {
  try {
    const data = convertStringToNumber(req.body);
    validateProforma(data);

    const proforma = await SnigdhaProductProformaInvoice.findByIdAndUpdate(
      req.params.id,
      data,
      {new: true, runValidators: true}
    );

    if (!proforma) {
      return res.status(404).json({
        success: false,
        message: "Proforma invoice not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Proforma invoice updated successfully",
      data: proforma,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete proforma invoice
export const deleteProformaInvoice = async (req, res) => {
  try {
    const proforma = await SnigdhaProductProformaInvoice.findByIdAndDelete(
      req.params.id
    );

    if (!proforma) {
      return res.status(404).json({
        success: false,
        message: "Proforma invoice not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Proforma invoice deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
