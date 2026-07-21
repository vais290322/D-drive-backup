// model/schemaDef.model.js
import mongoose, { Schema } from "mongoose";

const fieldSchema = new Schema({
  fieldName: { type: String, required: true },   // e.g. "price"
  fieldType: { type: String, required: true },   // "string", "number"
  required: { type: Boolean, default: false },
  min: { type: Number },                         // for numbers
  max: { type: Number }                          // optional rule
});

const schemaDefSchema = new Schema({
  schemaName: { type: String, required: true }, // e.g. "Product"
  fields: [fieldSchema]
});

const SchemaDef = mongoose.model("SchemaDef", schemaDefSchema);
export default SchemaDef;
