import mongoose from "mongoose";

const snigdhaPurchaseOrderSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    vendorQuoteRef: {
        type: String,
        required: true,
        trim: true
    },
    companyDetails:{
        type: Object,
        required: true
    },
    clientId:{
        type:String,
        required: true,
    },
    status:{
        type:String,
        // required: true,
        trim: true,
        default:"pending"
    },
    buyer: {
        type: String,
        required: true,
        trim: true
    },
    requestedBy: {
        type: String,
        required: true,
        trim: true
    },
    contactPerson: {
        type: String,
        required: true,
        trim: true
    },
    contactPersonNumber: {
        type: String,
        required: true,
        trim: true
    },
    department: {
        type: String,
        required: true,
        trim: true
    },
    poDescription: {
        type: String,
        required: true,
        trim: true
    },
    billLocation: {
        type: String,
        required: true,
        trim: true
    },
    shipLocation: {
        type: String,
        required: true,
        trim: true
    },
    items: {
        type: Array,
        required: true
    },
    paymentTerms: {
        type: String,
        required: true,
        trim: true
    },
    totalAmount: {
        type: Number,
        required: true,
        min: 0
    }
}, { timestamps: true });

const SnigdhaPurchaseOrder = mongoose.model("SnigdhaPurchaseOrder", snigdhaPurchaseOrderSchema);

export default SnigdhaPurchaseOrder;