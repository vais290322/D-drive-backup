// controller/schemaDef.controller.js
import SchemaDef from "../model/schemaDef.model.js";

// Create schema if not exist, else update existing
const upsertSchema = async (req, res) => {
  try {
    const { schemaName, fields } = req.body;

    if (!schemaName || !fields) {
      return res.status(400).json({ success: false, message: "Schema name and fields required" });
    }

    let schemaDef = await SchemaDef.findOne({ schemaName });

    if (!schemaDef) {
      // First time -> create schema
      schemaDef = await SchemaDef.create({ schemaName, fields });
    } else {
      // Update existing -> overwrite fields
      schemaDef.fields = fields;
      await schemaDef.save();
    }

    res.status(200).json({ success: true, data: schemaDef, message: "Schema saved" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get schema definition
const getSchema = async (req, res) => {
  try {
    const { schemaName } = req.params;
    let schemaDef = await SchemaDef.findOne({ schemaName });

    if (!schemaDef) {
      // Auto-create empty schema if not found
      schemaDef = await SchemaDef.create({ schemaName, fields: [] });
    }

    res.status(200).json({ success: true, data: schemaDef });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export { upsertSchema, getSchema };
