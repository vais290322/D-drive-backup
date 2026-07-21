import mongoose from "mongoose";

const margProductSchema = new mongoose.Schema(
  {
    rid: String,
    catcode: String,
    code: String,
    name: String,
    stock: String,
    remark: String,
    company: String,
    shopcode: String,
    MRP: String,
    Rate: String,
    Deal: String,
    Free: String,
    PRate: String,
    Is_Deleted: String,
    curbatch: String,
    exp: String,
    gcode: String,
    MargCode: String,
    Conversion: String,
    Salt: String,
    ENCODE: String,
    remarks: String,
    Gcode6: String,
    ProductCode: String,
  },
  {
    timestamps: true,
    collection: "marg_products",
  },
);

margProductSchema.index({ rid: 1 }, { unique: true });
margProductSchema.index({ code: 1 });

const MargProducts = mongoose.model("MargProduct", margProductSchema);

export default MargProducts;
