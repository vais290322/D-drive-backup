import { Schema } from "mongoose";
import mongoose from "mongoose";

const snigdhaServiceLadgerSchema = new Schema({
    invoiceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SnigdhaServiceInvoice",
        required: true
    },
    invoiceNumber: {
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
            required: true,
            default: new Date()
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
        noteType: {
            type: String,
            // required:true
        },
    }],

    voucherDetails: [{
        amount: { type: Number },
        noteId: { type: String },
        noteNumber: { type: String },
        noteType: { type: String },
        date: { type: String, default: new Date() },
        customerId: { type: String }
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
            ref: "SnigdhaCreditDebitNote"
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
            ref: "SnigdhaCreditDebitNote"
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

export const SngidhaServiceLedger = mongoose.model("SngidhaServiceLedger", snigdhaServiceLadgerSchema);