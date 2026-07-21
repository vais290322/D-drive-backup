/**
 * Hotel Model (MongoDB/Mongoose)
 */

import mongoose, { Schema } from 'mongoose';

const HotelSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        index: true,
    },
    description: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
        index: true,
    },
    city: {
        type: String,
        required: true,
        index: true,
    },
    country: {
        type: String,
        required: true,
        default: 'Saudi Arabia',
    },
    address: {
        type: String,
        required: true,
    },
    latitude: {
        type: Number,
    },
    longitude: {
        type: Number,
    },

    // Islamic-friendly features
    proximity_to_haram: {
        type: Number, // in meters
    },
    proximity_to_masjid_nabawi: {
        type: Number, // in meters
    },
    prayer_facilities: {
        type: Boolean,
        default: true,
    },
    halal_food: {
        type: Boolean,
        default: true,
    },
    gender_segregated_facilities: {
        type: Boolean,
        default: false,
    },

    // Hotel details
    star_rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
        default: 3,
    },
    images: [{
        type: String,
    }],
    amenities: [{
        type: String,
    }],
    check_in_time: {
        type: String,
        default: '14:00',
    },
    check_out_time: {
        type: String,
        default: '12:00',
    },

    // Pricing
    price_per_night: {
        type: Number,
        required: true,
        min: 0,
    },
    currency: {
        type: String,
        default: 'INR',
    },

    // Status
    is_active: {
        type: Boolean,
        default: true,
        index: true,
    },
    is_verified: {
        type: Boolean,
        default: false,
        index: true,
    },

    // Owner
    owner_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    },
});

// Indexes for search
HotelSchema.index({ name: 'text', description: 'text', location: 'text' });
HotelSchema.index({ city: 1, is_active: 1, is_verified: 1 });
HotelSchema.index({ price_per_night: 1 });

export const Hotel = mongoose.model('Hotel', HotelSchema);
