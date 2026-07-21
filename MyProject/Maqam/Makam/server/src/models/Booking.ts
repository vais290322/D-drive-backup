/**
 * Booking Model (MongoDB/Mongoose)
 * 
 * Replaces Supabase bookings table
 */

import mongoose, { Schema, Document } from 'mongoose';

export interface IBooking extends Document {
  user_id: mongoose.Types.ObjectId;
  booking_type: 'hotel' | 'flight' | 'package';
  hotel_id?: mongoose.Types.ObjectId;
  flight_data?: any;
  package_data?: any;

  // Booking details
  check_in_date: Date;
  check_out_date: Date;
  nights: number;
  guests: number;
  room_type: string;

  // Guest information
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  special_requests?: string;

  // Pricing
  room_price: number;
  total_amount: number;
  currency: string;

  // Payment
  payment_id?: string;
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  paid_at?: Date;

  // Status
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';

  // Timestamps
  created_at: Date;
  updated_at: Date;
}

const BookingSchema = new Schema<IBooking>({
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
    required: function (this: any) { return this.booking_type === 'hotel'; },
    index: true,
  },
  flight_data: {
    type: Object, // Store snapshot of flight offer
  },
  package_data: {
    type: Object, // Store snapshot of package details
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
BookingSchema.index({ payment_status: 1 });

export const Booking = mongoose.model<IBooking>('Booking', BookingSchema);
