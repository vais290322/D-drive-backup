/**
 * Hotel Routes
 */

import express from 'express';
import {
    getHotels,
    getHotelById,
    createHotel,
    updateHotel,
    deleteHotel,
    getMyHotels,
    verifyHotel,
    getAllHotels,
} from '../controller/hotelController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getHotels);
router.get('/all', getAllHotels);
router.get('/:id', getHotelById);

// Protected routes
router.post('/', authenticate, authorize('hotelier', 'admin'), createHotel);
router.put('/:id', authenticate, updateHotel);
router.delete('/:id', authenticate, deleteHotel);
router.get('/my/hotels', authenticate, authorize('hotelier', 'admin'), getMyHotels);

// Admin routes
router.put('/:id/verify', authenticate, authorize('admin'), verifyHotel);

export default router;
