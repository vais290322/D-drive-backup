// controller/product.controller.js
import Product from "../model/product.model.js";
import SchemaDef from "../model/schemaDef.model.js";

const createProduct = async (req, res) => {
  try {
    const input = req.body; // { name, price, ... }

    // 🔹 Fetch schema definition for "Product"
    const schemaDef = await SchemaDef.findOne({ schemaName: "Product" });
    if (!schemaDef) {
      return res.status(400).json({ success: false, message: "Schema not defined" });
    }

    // 🔹 Validate input
    for (const field of schemaDef.fields) {
      const value = input[field.fieldName];

      if (field.required && (value === undefined || value === "")) {
        return res.status(400).json({ success: false, message: `${field.fieldName} is required` });
      }

      if (value !== undefined) {
        if (field.fieldType === "string" && typeof value !== "string") {
          return res.status(400).json({ success: false, message: `${field.fieldName} must be a string` });
        }
        if (field.fieldType === "number" && typeof value !== "number") {
          return res.status(400).json({ success: false, message: `${field.fieldName} must be a number` });
        }
        if (field.min !== undefined && value < field.min) {
          return res.status(400).json({ success: false, message: `${field.fieldName} must be >= ${field.min}` });
        }
        if (field.max !== undefined && value > field.max) {
          return res.status(400).json({ success: false, message: `${field.fieldName} must be <= ${field.max}` });
        }
      }
    }

    // 🔹 Save product
    const product = await Product.create({ data: input });

    res.status(201).json({ success: true, data: product, message: "Product created successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({
      success: true,
      data: products.map(p => p.data),
      message: "Products fetched successfully"
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export { createProduct, getAllProducts };
