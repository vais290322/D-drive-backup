/**
 * Booking Model (MongoDB/Mongoose)
 */

import mongoose, { Schema } from 'mongoose';

const BookingSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    booking_type: {
        type: String,
        enum: ['hotel', 'flight', 'package'],
        default: 'hotel',
        required: true,
        index: true,
    },
    hotel_id: {
        type: Schema.Types.ObjectId,
        ref: 'Hotel',
        required: function () { return this.booking_type === 'hotel'; },
        index: true,
    },
    flight_data: {
        type: Object,
    },
    package_data: {
        type: Object,
    },

    // Booking details
    check_in_date: {
        type: Date,
        required: true,
        index: true,
    },
    check_out_date: {
        type: Date,
        required: true,
        index: true,
    },
    nights: {
        type: Number,
        required: true,
        min: 1,
    },
    guests: {
        type: Number,
        required: true,
        min: 1,
    },
    room_type: {
        type: String,
        required: true,
    },

    // Guest information
    guest_name: {
        type: String,
        required: true,
    },
    guest_email: {
        type: String,
        required: true,
    },
    guest_phone: {
        type: String,
        required: true,
    },
    special_requests: {
        type: String,
    },

    // Pricing
    room_price: {
        type: Number,
        required: true,
        min: 0,
    },
    total_amount: {
        type: Number,
        required: true,
        min: 0,
    },
    currency: {
        type: String,
        default: 'INR',
    },

    // Payment
    payment_id: {
        type: String,
        index: true,
    },
    payment_status: {
        type: String,
        enum: ['pending', 'paid', 'failed', 'refunded'],
        default: 'pending',
        index: true,
    },
    paid_at: {
        type: Date,
    },

    // Status
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled', 'completed'],
        default: 'pending',
        index: true,
    },
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    },
});

// Indexes for queries
BookingSchema.index({ user_id: 1, status: 1 });
BookingSchema.index({ hotel_id: 1, status: 1 });
BookingSchema.index({ check_in_date: 1, check_out_date: 1 });

export const Booking = mongoose.model('Booking', BookingSchema);
