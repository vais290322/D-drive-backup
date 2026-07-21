import mongoose from "mongoose";

const snigdhaCurrentItemSchema = new mongoose.Schema({
   item_name: { type: String, required: true },
   inventory_id:{type: String, required: true},
   item_id: { type: String, required: true  },
   unit_prize: { type: Number, required: true },
   sellingPrice: { type: Number, required: true },
   total_prize: { type: Number, required: true },
   quantity: { type: Number, required: true, default: 1 }, // Added quantity field
   hsnCode:{ type: String, required: true,unique:true},
    cgst:{ type: Number, required: true, default:0},
    igst:{ type: Number, required: true, default:0},
    sgst:{ type: Number, required: true, default:0},
   seller_details: {
     seller_name: { type: String, required: true },
     ph_no: { type: String, required: true },
     address: { type: String, required: true },
     email: { type: String, required: true },
   },
   buyier_details: {
     buyer_name: { type: String, required: true },
     ph_no: { type: String, required: true },
     address: { type: String, required: true },
     email: { type: String, required: true },
   },
   imported: { type: Boolean, default: false },
   exported: { type: Boolean, default: false },
 },
 { timestamps: true }
)

snigdhaCurrentItemSchema.methods.reduceStock = async function (soldQuantity) {
  if (soldQuantity > this.quantity) {
    throw new Error("Sold quantity exceeds available stock");
  }

  // Reduce the stock quantity
  this.quantity -= soldQuantity;

  // Update the total price (unit price remains fixed)
  this.total_prize = this.unit_prize * this.quantity;

  // Save the updated stock and pricing details in the database
  try {
    await this.save();
    console.log(`${soldQuantity} of ${this.item_name} sold. Updated stock: ${this.quantity}. Updated total price: ${this.total_prize}`);
  } catch (err) {
    console.error("Error updating stock:", err);
    throw err;
  }
};

const SnigdhaCurrentItems = mongoose.model("SnigdhaCurrentItems", snigdhaCurrentItemSchema);

export default SnigdhaCurrentItems;
