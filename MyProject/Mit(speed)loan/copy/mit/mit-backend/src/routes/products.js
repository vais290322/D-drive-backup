const express = require('express');
const Product = require('../models/Product');
const { getNextSequence } = require('../models/Counter');

const router = express.Router();

// Get all products
router.get('/', async (req, res) => {
    try {
        const filter = {};
        if (req.query.status) {
            filter.status = req.query.status;
        }
        const products = await Product.find(filter).populate('created_by', 'full_name email');
        res.json(products);
    } catch (err) {
        console.error('Error fetching products:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get product by ID
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('created_by', 'full_name email');
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (err) {
        console.error('Error fetching product:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create new product
router.post('/', async (req, res) => {
    try {
        const seq = await getNextSequence('product');
        const product_code = `PROD${String(seq).padStart(6, '0')}`;

        const product = await Product.create({
            ...req.body,
            product_code
        });

        res.status(201).json(product);
    } catch (err) {
        console.error('Error creating product:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update product
router.put('/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (err) {
        console.error('Error updating product:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete product
router.delete('/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json({ message: 'Product deleted successfully' });
    } catch (err) {
        console.error('Error deleting product:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Search products
router.get('/search/:query', async (req, res) => {
    try {
        const query = req.params.query;
        const products = await Product.find({
            $or: [
                { product_code: { $regex: query, $options: 'i' } },
                { brand: { $regex: query, $options: 'i' } },
                { model: { $regex: query, $options: 'i' } },
                { serial_number: { $regex: query, $options: 'i' } }
            ]
        });
        res.json(products);
    } catch (err) {
        console.error('Error searching products:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
