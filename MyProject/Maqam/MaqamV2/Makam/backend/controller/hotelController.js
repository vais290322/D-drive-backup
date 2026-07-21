/**
 * Hotel Controller
 *
 * Handles hotel CRUD operations and search
 */

import { Hotel } from '../model/Hotel.js';

/**
 * Get all hotels with filters
 */
export const getHotels = async (req, res) => {
    try {
        const {
            city,
            location,
            min_price,
            max_price,
            star_rating,
            prayer_facilities,
            halal_food,
            search,
            page = 1,
            limit = 10,
        } = req.query;

        const query = {
            is_active: true,
            is_verified: true,
        };

        if (city) query.city = city;
        if (location) query.location = location;
        if (star_rating) query.star_rating = Number(star_rating);
        if (prayer_facilities === 'true') query.prayer_facilities = true;
        if (halal_food === 'true') query.halal_food = true;

        if (min_price || max_price) {
            query.price_per_night = {};
            if (min_price) query.price_per_night.$gte = Number(min_price);
            if (max_price) query.price_per_night.$lte = Number(max_price);
        }

        if (search) {
            query.$text = { $search: search };
        }

        const pageNum = Number(page);
        const limitNum = Number(limit);
        const skip = (pageNum - 1) * limitNum;

        const hotels = await Hotel.find(query)
            .populate('owner_id', 'username email')
            .sort({ created_at: -1 })
            .skip(skip)
            .limit(limitNum);

        const total = await Hotel.countDocuments(query);

        res.json({
            hotels,
            pagination: {
                page: pageNum,
                limit: limitNum,
                total,
                pages: Math.ceil(total / limitNum),
            },
        });
    } catch (error) {
        console.error('Get hotels error:', error);
        res.status(500).json({ error: 'Failed to get hotels' });
    }
};

/**
 * Get hotel by ID
 */
export const getHotelById = async (req, res) => {
    try {
        const { id } = req.params;

        const hotel = await Hotel.findById(id).populate('owner_id', 'username email phone');

        if (!hotel) {
            res.status(404).json({ error: 'Hotel not found' });
            return;
        }

        res.json({ hotel });
    } catch (error) {
        console.error('Get hotel by ID error:', error);
        res.status(500).json({ error: 'Failed to get hotel' });
    }
};

/**
 * Create new hotel (hotelier only)
 */
export const createHotel = async (req, res) => {
    try {
        if (!req.user || (req.user.role !== 'hotelier' && req.user.role !== 'admin')) {
            res.status(403).json({ error: 'Only hoteliers can create hotels' });
            return;
        }

        const hotelData = {
            ...req.body,
            address: req.body.location,
            owner_id: req.user._id,
            is_verified: req.user.role === 'admin',
        };

        const hotel = await Hotel.create(hotelData);

        res.status(201).json({
            message: 'Hotel created successfully',
            hotel,
        });
    } catch (error) {
        console.error('Create hotel error:', error);
        res.status(500).json({ error: 'Failed to create hotel' });
    }
};

/**
 * Update hotel (owner or admin only)
 */
export const updateHotel = async (req, res) => {
    try {
        const { id } = req.params;

        if (!req.user) {
            res.status(401).json({ error: 'Authentication required' });
            return;
        }

        const hotel = await Hotel.findById(id);

        if (!hotel) {
            res.status(404).json({ error: 'Hotel not found' });
            return;
        }

        if (hotel.owner_id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            res.status(403).json({ error: 'You do not have permission to update this hotel' });
            return;
        }

        const updatedHotel = await Hotel.findByIdAndUpdate(id, req.body, { new: true });

        res.json({
            message: 'Hotel updated successfully',
            hotel: updatedHotel,
        });
    } catch (error) {
        console.error('Update hotel error:', error);
        res.status(500).json({ error: 'Failed to update hotel' });
    }
};

/**
 * Delete hotel (owner or admin only)
 */
export const deleteHotel = async (req, res) => {
    try {
        const { id } = req.params;

        if (!req.user) {
            res.status(401).json({ error: 'Authentication required' });
            return;
        }

        const hotel = await Hotel.findById(id);

        if (!hotel) {
            res.status(404).json({ error: 'Hotel not found' });
            return;
        }

        if (hotel.owner_id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            res.status(403).json({ error: 'You do not have permission to delete this hotel' });
            return;
        }

        await Hotel.findByIdAndDelete(id);

        res.json({ message: 'Hotel deleted successfully' });
    } catch (error) {
        console.error('Delete hotel error:', error);
        res.status(500).json({ error: 'Failed to delete hotel' });
    }
};

/**
 * Get hotels by owner (hotelier dashboard)
 */
export const getMyHotels = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Authentication required' });
            return;
        }

        const hotels = await Hotel.find({ owner_id: req.user._id }).sort({ created_at: -1 });

        res.json({ hotels });
    } catch (error) {
        console.error('Get my hotels error:', error);
        res.status(500).json({ error: 'Failed to get hotels' });
    }
};

/**
 * Verify hotel (admin only)
 */
export const verifyHotel = async (req, res) => {
    try {
        const { id } = req.params;

        if (!req.user || req.user.role !== 'admin') {
            res.status(403).json({ error: 'Admin access required' });
            return;
        }

        const hotel = await Hotel.findByIdAndUpdate(
            id,
            { is_verified: true },
            { new: true }
        );

        if (!hotel) {
            res.status(404).json({ error: 'Hotel not found' });
            return;
        }

        res.json({
            message: 'Hotel verified successfully',
            hotel,
        });
    } catch (error) {
        console.error('Verify hotel error:', error);
        res.status(500).json({ error: 'Failed to verify hotel' });
    }
};

export const getAllHotels = async (req, res) => {
    try {
        const hotels = await Hotel.find().sort({ created_at: -1 });
        res.json({ hotels });
    } catch (error) {
        console.error('Get all hotels error:', error);
        res.status(500).json({ error: 'Failed to get hotels' });
    }
};
