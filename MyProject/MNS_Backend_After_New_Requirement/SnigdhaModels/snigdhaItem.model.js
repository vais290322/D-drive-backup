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
    group:{
        type: String,
        required: true
    },
    openingStock:{
        type: Number,
        default: 0
    },
    created_date:{
        type: Date,
        default: Date.now()
    },
    updated_date:{
        type: Date,
        default: Date.now()
    },
    uom:{
        type: String,
        
    },
    gst:{
        type: String,
    },
    unit_prize: { type: Number, default: 0  },
    sellingPrice: { type: Number, default: 0},
    total_prize: { type: Number, default: 0 },
    quantity: { type: Number,  default: 1 },
    hsnCode:{ type: String, required: true,},
    cgst:{ type: Number,  default:0},
    igst:{ type: Number,  default:0},
    sgst:{ type: Number, default:0},
})

const SnigdhaItem = mongoose.model("SnigdhaItem", snigdhaItemSchema);

export default SnigdhaItem;