const Product = require('../models/Product');

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single product
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new product
exports.createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a product
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create dummy products
exports.createDummyProducts = async (req, res) => {
  try {
    const dummyProducts = [
      {
        name: 'Organic Potting Soil',
        sku: 'SOIL-001',
        description: 'Premium organic potting soil for indoor plants',
        price: 299,
        weight: 5,
        dimensions: { length: 30, width: 20, height: 10 },
        category: 'Soil & Fertilizers',
        stock: 100,
        images: ['soil1.jpg', 'soil2.jpg']
      },
      {
        name: 'Ceramic Plant Pot - Medium',
        sku: 'POT-002',
        description: 'Elegant ceramic pot for medium-sized plants',
        price: 499,
        weight: 2,
        dimensions: { length: 15, width: 15, height: 20 },
        category: 'Pots & Planters',
        stock: 50,
        images: ['pot1.jpg', 'pot2.jpg']
      },
      {
        name: 'Garden Tool Set',
        sku: 'TOOL-003',
        description: 'Complete set of essential gardening tools',
        price: 899,
        weight: 3,
        dimensions: { length: 40, width: 20, height: 10 },
        category: 'Tools',
        stock: 30,
        images: ['tools1.jpg', 'tools2.jpg']
      },
      {
        name: 'Indoor Fern Plant',
        sku: 'PLANT-004',
        description: 'Beautiful fern plant for indoor decoration',
        price: 399,
        weight: 1.5,
        dimensions: { length: 20, width: 20, height: 30 },
        category: 'Indoor Plants',
        stock: 25,
        images: ['fern1.jpg', 'fern2.jpg']
      },
      {
        name: 'Organic Plant Food',
        sku: 'FERT-005',
        description: 'Nutrient-rich organic fertilizer for all plants',
        price: 249,
        weight: 1,
        dimensions: { length: 10, width: 10, height: 15 },
        category: 'Soil & Fertilizers',
        stock: 80,
        images: ['fertilizer1.jpg', 'fertilizer2.jpg']
      },
      {
        name: 'Hanging Planter',
        sku: 'HANG-006',
        description: 'Stylish hanging planter for indoor or outdoor use',
        price: 599,
        weight: 1.2,
        dimensions: { length: 25, width: 25, height: 15 },
        category: 'Pots & Planters',
        stock: 40,
        images: ['hanging1.jpg', 'hanging2.jpg']
      },
      {
        name: 'Succulent Collection',
        sku: 'SUCC-007',
        description: 'Set of 5 different succulent plants',
        price: 799,
        weight: 2.5,
        dimensions: { length: 30, width: 30, height: 10 },
        category: 'Indoor Plants',
        stock: 20,
        images: ['succulent1.jpg', 'succulent2.jpg']
      },
      {
        name: 'Pruning Shears',
        sku: 'TOOL-008',
        description: 'Professional-grade pruning shears for precise cuts',
        price: 349,
        weight: 0.3,
        dimensions: { length: 20, width: 5, height: 2 },
        category: 'Tools',
        stock: 60,
        images: ['shears1.jpg', 'shears2.jpg']
      },
      {
        name: 'Bonsai Tree Kit',
        sku: 'BONS-009',
        description: 'Complete kit to grow and maintain your own bonsai tree',
        price: 1299,
        weight: 3.5,
        dimensions: { length: 40, width: 30, height: 20 },
        category: 'Indoor Plants',
        stock: 15,
        images: ['bonsai1.jpg', 'bonsai2.jpg']
      },
      {
        name: 'Watering Can',
        sku: 'TOOL-010',
        description: 'Elegant metal watering can with long spout',
        price: 449,
        weight: 0.8,
        dimensions: { length: 35, width: 15, height: 25 },
        category: 'Tools',
        stock: 45,
        images: ['can1.jpg', 'can2.jpg']
      }
    ];

    await Product.deleteMany({}); // Clear existing products
    const savedProducts = await Product.insertMany(dummyProducts);
    
    res.status(201).json({
      message: 'Dummy products created successfully',
      count: savedProducts.length,
      products: savedProducts
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};