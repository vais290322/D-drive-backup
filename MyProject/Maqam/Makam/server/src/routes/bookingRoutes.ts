/**
 * Booking Routes
 */

import express from 'express';
import {
  createBooking,
  verifyPayment,
  getMyBookings,
  getBookingById,
  cancelBooking,
  getAllBookings,
  getHotelierBookings,
  initiatePayPalPayment,
  confirmPayPalPayment,
} from '../controllers/bookingController';
import { authenticate, authorize } from '../middleware/auth';

const router = express.Router();

// Protected routes
router.post('/', authenticate, createBooking);
router.post('/verify-payment', verifyPayment);
router.get('/my/bookings', authenticate, getMyBookings);
router.get('/:id', authenticate, getBookingById);
router.put('/:id/cancel', authenticate, cancelBooking);
router.post('/:id/paypal/init', authenticate, initiatePayPalPayment);
router.post('/paypal/confirm', authenticate, confirmPayPalPayment);

// Admin routes
router.get('/admin/all', authenticate, authorize('admin'), getAllBookings);

// Hotelier routes
router.get('/hotelier/bookings', authenticate, authorize('hotelier'), getHotelierBookings);

export default router;
