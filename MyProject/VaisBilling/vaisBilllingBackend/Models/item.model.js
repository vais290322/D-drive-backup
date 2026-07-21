import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema({
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
    openningStock:{
        type: Number,
        default: 0
    },
    totalPurchase:{
        type: Number,
        default: 0
    },
    totalSales:{
        type: Number,
        default: 0
    },
    totalStock:{
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
    unit_prize: { type: Number, default: 0 },
    sellingPrice: { type: Number,  },
    total_prize: { type: Number, default: 0 },
    quantity: { type: Number,  default:0 },
    hsnCode:{ type: String, required: true},
    cgst:{ type: Number, default:0},
    igst:{ type: Number,  default:0},
    sgst:{ type: Number,  default:0},
    uom:{ type: String,  },
    gst:{ type: Number,  },
},
{ timestamps: true } // Automatically adds createdAt & updatedAt
);

const Item = mongoose.model("MNS_Items", ItemSchema);

export default Item;