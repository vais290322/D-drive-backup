import { Schema } from "mongoose";
import mongoose from "mongoose";

const purchaseAccountSchema = new Schema({
    invoiceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MnsPurchaseOrderNew",
        required: true
    },
    invoiceNumber: {
        type: String,
        required: true
    },

    vendorName: {
        type: String,
        required: true
    },

    totalAmount: {
        type: Number,
        required: true
    },

    dueAmount: {
        type: Number,

    },

    totalPaidAmount: {
        type: Number,
        default: 0,
    },

    isPaid: {
        type: Boolean,
        default: false,
    },

    paymentDetails: [{
        paymentDate: {
            type: String,
            required: true
        },
        paymentAmount: {
            type: Number,
            required: true
        },
        paymentMode: {
            type: String,
            required: true
        },
        transactionId: {
            type: String,
            required: true
        },
        bankId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Bank",

        }

    }],

    voucherDetails: [{
        amount: { type: Number },
        noteId: { type: String },
        noteNumber: { type: String },
        noteType: { type: String },
        date: { type: String, default: new Date() },
        vendorId: { type: String }
    }],

    totalDebitNoteAmount: {
        type: Number,
        default: 0
    },
    totalWithoutDebitNoteAmount: {
        type: Number,
        default: 0
    },
    debitNoteHistory: [{
        referenceNumber: {
            type: String,
            // required: true
        },
        amount: {
            type: Number,
            // required: true
        },
        date: {
            type: Date,
            default: Date.now
        },
        noteId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "CreditDebitNote"
        },
        reason: {
            type: String,
            // required: true
        }
    }],

    creditApplied: {
        type: Number,
        default: 0,
    },
    creditNoteAdjustments: [{
        noteId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "CreditDebitNote"
        },
        noteNumber: { type: String },
        noteType: {
            type: String,
            enum: ["credit", "debit"]
        },
        amount: {
            type: Number
        },
        date: {
            type: Date,
            default: Date.now
        }
    }]


}, { timestamps: true });

const PurchaseAccount = mongoose.model("PurchaseAccount", purchaseAccountSchema);

export default PurchaseAccount;