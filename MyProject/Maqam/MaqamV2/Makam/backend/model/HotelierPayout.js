/**
 * Hotelier Payout Model (MongoDB/Mongoose)
 */

import mongoose, { Schema } from 'mongoose';

const HotelierPayoutSchema = new Schema({
    hotelier_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },

    // Payout Details
    payout_id: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    amount: {
        type: Number,
        required: true,
        min: 0,
    },
    currency: {
        type: String,
        default: 'INR',
    },

    // Bank Details
    account_number: {
        type: String,
        required: true,
    },
    ifsc: {
        type: String,
        required: true,
    },
    account_holder_name: {
        type: String,
    },

    // Status
    status: {
        type: String,
        enum: ['queued', 'pending', 'processing', 'processed', 'reversed', 'cancelled', 'rejected'],
        default: 'pending',
        index: true,
    },

    // Purpose and Reference
    purpose: {
        type: String,
        required: true,
    },
    reference: {
        type: String,
    },
    failure_reason: {
        type: String,
    },

    // Metadata
    notes: {
        type: Schema.Types.Mixed,
        default: {},
    },

    // Timestamps
    processed_at: {
        type: Date,
    },
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    },
});

// Indexes
HotelierPayoutSchema.index({ hotelier_id: 1, status: 1 });
HotelierPayoutSchema.index({ created_at: -1 });

export const HotelierPayout = mongoose.model('HotelierPayout', HotelierPayoutSchema);
