const express = require('express');
const router = express.Router();
const ServiceRequest = require('../models/ServiceRequest');

// Get all service requests
router.get('/', async (req, res) => {
    try {
        const requests = await ServiceRequest.find().sort({ created_at: -1 });
        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create a new service request
router.post('/', async (req, res) => {
    const request = new ServiceRequest(req.body);
    try {
        const newRequest = await request.save();
        res.status(201).json(newRequest);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update a service request
router.put('/:id', async (req, res) => {
    try {
        const updatedRequest = await ServiceRequest.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updatedRequest);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a service request
router.delete('/:id', async (req, res) => {
    try {
        await ServiceRequest.findByIdAndDelete(req.params.id);
        res.json({ message: 'Service request deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
