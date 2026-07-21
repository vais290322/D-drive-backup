import mongoose from "mongoose";

const snigdhaItemSchema = new mongoose.Schema({
    item_name:{
        type: String,
        required: true
    },
    item_id:{
        type: String,
        required: true,
        unique: true
    },
    item_description:{
        type: String,
        required: true
    },
    created_date:{
        type: Date,
        default: Date.now()
    },
    updated_date:{
        type: Date,
        default: Date.now()
    },
    unit_prize: { type: Number, required: true },
    sellingPrice: { type: Number, required: true },
    total_prize: { type: Number, required: true },
    quantity: { type: Number, required: true, default: 1 },
    hsnCode:{ type: String, required: true,unique:true},
    cgst:{ type: Number, required: true, default:0},
    igst:{ type: Number, required: true, default:0},
    sgst:{ type: Number, required: true, default:0},
})

const SnigdhaItem = mongoose.model("SnigdhaItem", snigdhaItemSchema);

export default SnigdhaItem;