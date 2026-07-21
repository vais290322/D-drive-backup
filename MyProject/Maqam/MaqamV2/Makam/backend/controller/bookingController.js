/**
 * Booking Controller
 *
 * Handles booking operations and payment integration
 */

import { Booking } from '../model/Booking.js';
import { Hotel } from '../model/Hotel.js';
import crypto from 'crypto';
import { createOrder, capturePayment } from '../services/paypalService.js';
import { sendWhatsAppNotification } from '../services/whatsappService.js';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || '';

/**
 * Create new booking
 */
export const createBooking = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Authentication required' });
            return;
        }

        const {
            booking_type = 'hotel',
            hotel_id,
            check_in_date,
            check_out_date,
            guests,
            room_type,
            guest_name,
            guest_email,
            guest_phone,
            special_requests,
            flight_data,
            package_data,
            total_amount: client_total_amount,
        } = req.body;

        // DEBUG: Log payload
        try {
            const fs = require('fs');
            const path = require('path');
            fs.writeFileSync(path.join(import.meta.dirname, '../server_debug_payload.json'), JSON.stringify(req.body, null, 2));
        } catch (e) { }

        let finalCheckInDate = check_in_date;
        let finalCheckOutDate = check_out_date;

        if (booking_type === 'flight' && flight_data) {
            if (flight_data.departure_time) {
                finalCheckInDate = flight_data.departure_time;
                finalCheckOutDate = flight_data.arrival_time || flight_data.departure_time;
            } else {
                finalCheckInDate = new Date();
                finalCheckOutDate = new Date(Date.now() + 86400000);
            }
        }

        if ((!finalCheckInDate || !finalCheckOutDate) && booking_type === 'hotel') {
            res.status(400).json({ error: 'Missing required dates for hotel booking' });
            return;
        }

        if (!guests) {
            res.status(400).json({ error: 'Missing number of guests' });
            return;
        }

        let bookingPayload = {
            user_id: req.user._id,
            booking_type,
            check_in_date: new Date(finalCheckInDate),
            check_out_date: new Date(finalCheckOutDate),
            guests,
            guest_name: guest_name || req.user.full_name,
            guest_email: guest_email || req.user.email,
            guest_phone: guest_phone || req.user.phone,
            special_requests,
            payment_status: 'pending',
            status: 'pending',
            currency: 'INR',
        };

        if (booking_type === 'hotel') {
            if (!hotel_id || !room_type) {
                res.status(400).json({ error: 'Missing hotel_id or room_type' });
                return;
            }

            const hotel = await Hotel.findById(hotel_id);
            if (!hotel) {
                res.status(404).json({ error: 'Hotel not found' });
                return;
            }

            bookingPayload.hotel_id = hotel_id;
            bookingPayload.room_type = room_type;
            bookingPayload.currency = hotel.currency;
            bookingPayload.room_price = hotel.price_per_night;

            const nights = Math.ceil((bookingPayload.check_out_date.getTime() - bookingPayload.check_in_date.getTime()) / (1000 * 60 * 60 * 24));
            if (nights < 1) {
                res.status(400).json({ error: 'Invalid dates' });
                return;
            }
            bookingPayload.nights = nights;
            bookingPayload.total_amount = hotel.price_per_night * nights;

        } else if (booking_type === 'flight') {
            if (!client_total_amount) {
                res.status(400).json({ error: 'Missing price information for flight' });
                return;
            }
            bookingPayload.flight_data = flight_data;
            bookingPayload.room_type = 'Economy';
            bookingPayload.nights = 1;
            bookingPayload.room_price = client_total_amount;
            bookingPayload.total_amount = client_total_amount;

        } else if (booking_type === 'package') {
            if (!client_total_amount) {
                res.status(400).json({ error: 'Missing price information for package' });
                return;
            }
            bookingPayload.package_data = package_data;
            bookingPayload.room_type = 'Package';
            bookingPayload.nights = Math.ceil((bookingPayload.check_out_date.getTime() - bookingPayload.check_in_date.getTime()) / (1000 * 60 * 60 * 24)) || 1;
            bookingPayload.room_price = client_total_amount;
            bookingPayload.total_amount = client_total_amount;
        }

        if (booking_type === 'flight' && (!finalCheckInDate || !finalCheckOutDate)) {
            console.error('Flight data missing dates:', flight_data);
            res.status(400).json({ error: 'Flight data missing departure/arrival times' });
            return;
        }

        const booking = await Booking.create(bookingPayload);

        if (booking_type === 'hotel') {
            await booking.populate('hotel_id', 'name location city images');
        }

        res.status(201).json({
            message: 'Booking created successfully',
            booking,
        });
    } catch (error) {
        console.error('Create booking error details:', error);
        res.status(500).json({ error: error.message || 'Failed to create booking' });
    }
};

/**
 * Verify Razorpay payment and confirm booking
 */
export const verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_payment_id,
            razorpay_order_id,
            razorpay_signature,
            booking_id,
        } = req.body;

        if (!razorpay_payment_id || !booking_id) {
            res.status(400).json({ error: 'Missing required fields' });
            return;
        }

        let verified = true;
        if (razorpay_order_id && razorpay_signature) {
            const body = `${razorpay_order_id}|${razorpay_payment_id}`;
            const expectedSignature = crypto
                .createHmac('sha256', RAZORPAY_KEY_SECRET)
                .update(body)
                .digest('hex');

            verified = expectedSignature === razorpay_signature;
        }

        if (!verified) {
            res.status(400).json({ error: 'Invalid payment signature' });
            return;
        }

        const booking = await Booking.findByIdAndUpdate(
            booking_id,
            {
                payment_id: razorpay_payment_id,
                payment_status: 'paid',
                status: 'confirmed',
                paid_at: new Date(),
            },
            { new: true }
        ).populate('hotel_id', 'name location city');

        if (!booking) {
            res.status(404).json({ error: 'Booking not found' });
            return;
        }

        res.json({
            verified: true,
            message: 'Payment verified successfully',
            booking,
        });
    } catch (error) {
        console.error('Verify payment error:', error);
        res.status(500).json({ error: 'Failed to verify payment' });
    }
};

/**
 * Get user bookings
 */
export const getMyBookings = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Authentication required' });
            return;
        }

        const bookings = await Booking.find({ user_id: req.user._id })
            .populate('hotel_id', 'name location city images')
            .sort({ created_at: -1 });

        res.json({ bookings });
    } catch (error) {
        console.error('Get my bookings error:', error);
        res.status(500).json({ error: 'Failed to get bookings' });
    }
};

/**
 * Get booking by ID
 */
export const getBookingById = async (req, res) => {
    try {
        const { id } = req.params;

        const booking = await Booking.findById(id)
            .populate('hotel_id', 'name location city images address')
            .populate('user_id', 'username email phone');

        if (!booking) {
            res.status(404).json({ error: 'Booking not found' });
            return;
        }

        if (req.user) {
            const isOwner = booking.user_id._id.toString() === req.user._id.toString();
            const isAdmin = req.user.role === 'admin';
            const hotel = booking.hotel_id;
            const isHotelier = req.user.role === 'hotelier' &&
                hotel.owner_id?.toString() === req.user._id.toString();

            if (!isOwner && !isAdmin && !isHotelier) {
                res.status(403).json({ error: 'Access denied' });
                return;
            }
        }

        res.json({ booking });
    } catch (error) {
        console.error('Get booking by ID error:', error);
        res.status(500).json({ error: 'Failed to get booking' });
    }
};

/**
 * Cancel booking
 */
export const cancelBooking = async (req, res) => {
    try {
        const { id } = req.params;

        if (!req.user) {
            res.status(401).json({ error: 'Authentication required' });
            return;
        }

        const booking = await Booking.findById(id);

        if (!booking) {
            res.status(404).json({ error: 'Booking not found' });
            return;
        }

        if (booking.user_id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            res.status(403).json({ error: 'Access denied' });
            return;
        }

        if (booking.status === 'cancelled') {
            res.status(400).json({ error: 'Booking already cancelled' });
            return;
        }

        booking.status = 'cancelled';
        await booking.save();

        res.json({
            message: 'Booking cancelled successfully',
            booking,
        });
    } catch (error) {
        console.error('Cancel booking error:', error);
        res.status(500).json({ error: 'Failed to cancel booking' });
    }
};

/**
 * Get all bookings (admin only)
 */
export const getAllBookings = async (req, res) => {
    try {
        if (!req.user || req.user.role !== 'admin') {
            res.status(403).json({ error: 'Admin access required' });
            return;
        }

        const { status, payment_status, page = 1, limit = 20 } = req.query;

        const query = {};
        if (status) query.status = status;
        if (payment_status) query.payment_status = payment_status;

        const pageNum = Number(page);
        const limitNum = Number(limit);
        const skip = (pageNum - 1) * limitNum;

        const bookings = await Booking.find(query)
            .populate('hotel_id', 'name location city')
            .populate('user_id', 'username email')
            .sort({ created_at: -1 })
            .skip(skip)
            .limit(limitNum);

        const total = await Booking.countDocuments(query);

        res.json({
            bookings,
            pagination: {
                page: pageNum,
                limit: limitNum,
                total,
                pages: Math.ceil(total / limitNum),
            },
        });
    } catch (error) {
        console.error('Get all bookings error:', error);
        res.status(500).json({ error: 'Failed to get bookings' });
    }
};

/**
 * Get hotelier bookings
 */
export const getHotelierBookings = async (req, res) => {
    try {
        if (!req.user || req.user.role !== 'hotelier') {
            res.status(403).json({ error: 'Hotelier access required' });
            return;
        }

        const hotels = await Hotel.find({ owner_id: req.user._id }).select('_id');
        const hotelIds = hotels.map(h => h._id);

        const bookings = await Booking.find({ hotel_id: { $in: hotelIds } })
            .populate('hotel_id', 'name location city')
            .populate('user_id', 'username email phone')
            .sort({ created_at: -1 });

        res.json({ bookings });
    } catch (error) {
        console.error('Get hotelier bookings error:', error);
        res.status(500).json({ error: 'Failed to get bookings' });
    }
};

/**
 * Initiate PayPal Payment
 */
export const initiatePayPalPayment = async (req, res) => {
    try {
        const { id } = req.params;
        const booking = await Booking.findById(id);

        if (!booking) {
            res.status(404).json({ error: 'Booking not found' });
            return;
        }

        const order = await createOrder(booking.total_amount);

        res.json({
            orderId: order.id,
            bookingId: booking._id,
        });
    } catch (error) {
        console.error('Initiate PayPal error:', error);
        res.status(500).json({ error: 'Failed to initiate PayPal payment' });
    }
};

/**
 * Confirm PayPal Payment
 */
export const confirmPayPalPayment = async (req, res) => {
    try {
        const { bookingId, orderId } = req.body;

        if (!bookingId || !orderId) {
            res.status(400).json({ error: 'Missing bookingId or orderId' });
            return;
        }

        const captureData = await capturePayment(orderId);

        if (captureData.status === 'COMPLETED') {
            const booking = await Booking.findByIdAndUpdate(
                bookingId,
                {
                    payment_id: orderId,
                    payment_status: 'paid',
                    status: 'confirmed',
                    paid_at: new Date(),
                },
                { new: true }
            ).populate('hotel_id', 'name location city')
                .populate('user_id', 'username email phone');

            if (booking) {
                const userPhone = booking.guest_phone || booking.user_id?.phone;
                if (userPhone) {
                    await sendWhatsAppNotification(
                        userPhone,
                        'booking_confirmation',
                        [booking.guest_name, booking.hotel_id?.name]
                    );
                }
            }

            res.json({
                status: 'success',
                booking,
                captureData,
            });
        } else {
            res.status(400).json({ error: 'Payment not completed', details: captureData });
        }
    } catch (error) {
        console.error('Confirm PayPal error:', error);
        res.status(500).json({ error: 'Failed to confirm PayPal payment' });
    }
};
