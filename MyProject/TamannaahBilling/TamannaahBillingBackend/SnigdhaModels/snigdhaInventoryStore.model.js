import mongoose from "mongoose"; 

const snigdhainventoryStoreSchema = new mongoose.Schema(
  {
    item_name: { type: String, required: true },
    item_id: { type: String, required: true  },
    unit_prize: { type: Number, required: true },
    sellingPrice: { type: Number, required: true },
    total_prize: { type: Number, required: true },
    quantity: { type: Number, required: true, default: 1 },
    hsnCode:{ type: String, required: true, unique:true},
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
);

const SnigdhaInventoryItem = mongoose.model("SnigdhaInventoryItem", snigdhainventoryStoreSchema);

export default SnigdhaInventoryItem;