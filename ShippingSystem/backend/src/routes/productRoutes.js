const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Get all products
router.get('/', productController.getAllProducts);

// Create a new product
router.post('/', productController.createProduct);

// Create dummy products
router.post('/create-dummy', productController.createDummyProducts);

// Get a single product
router.get('/:id', productController.getProductById);

// Update a product
router.put('/:id', productController.updateProduct);

// Delete a product
router.delete('/:id', productController.deleteProduct);

module.exports = router;