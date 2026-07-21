const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { Item, Category } = require('../mongodb');
const { authenticateToken } = require('./auth');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, path.join(__dirname, '../public/uploads'));
  },
  filename: function(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const fileFilter = (req, file, cb) => {
  // Accept only specific image types
  const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
  
  const fileExtension = path.extname(file.originalname).toLowerCase();
  
  if (allowedMimeTypes.includes(file.mimetype) && allowedExtensions.includes(fileExtension)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG, PNG, GIF, and WebP image files are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Get all items
router.get('/', async (req, res) => {
  try {
    const showAll = req.query.showAll === 'true';
    let query = {};
    
    // If showAll is false, only show available items
    if (!showAll) {
      query.available = true;
    }
    
    const items = await Item.find(query)
      .populate('category', 'name order');
    
    // Custom sorting function
    const sortItems = (items) => {
      return items.sort((a, b) => {
        // First sort by category order
        const categoryOrderA = a.category ? a.category.order || 0 : 0;
        const categoryOrderB = b.category ? b.category.order || 0 : 0;
        
        if (categoryOrderA !== categoryOrderB) {
          return categoryOrderA - categoryOrderB;
        }
        
        // Within same category, sort by food type priority
        const foodTypePriority = { 'veg': 1, 'egg': 2, 'non-veg': 3 };
        const priorityA = foodTypePriority[a.food_type] || 4;
        const priorityB = foodTypePriority[b.food_type] || 4;
        
        if (priorityA !== priorityB) {
          return priorityA - priorityB;
        }
        
        // Within same food type, sort by price (low to high)
        const priceA = a.price_full || 0;
        const priceB = b.price_full || 0;
        
        if (priceA !== priceB) {
          return priceA - priceB;
        }
        
        // Finally sort by name if everything else is equal
        return a.name.localeCompare(b.name);
      });
    };
    
    const sortedItems = sortItems(items);
    
    // Format response to match the expected structure
    const formattedItems = sortedItems.map(item => ({
      id: item._id,
      name: item.name,
      description: item.description,
      price_half: item.price_half,
      price_full: item.price_full,
      food_type: item.food_type,
      category_id: item.category._id,
      category_name: item.category ? item.category.name : 'Uncategorized',
      available: item.available ? 1 : 0,
      image_path: item.image_path,
      order: item.order || 0,
      created_at: item.created_at
    }));
    
    res.status(200).json(formattedItems);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching items', error: err.message });
  }
});

// Get a specific item by ID
router.get('/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    // Format response to match the expected structure
    const formattedItem = {
      id: item._id,
      name: item.name,
      description: item.description,
      price_half: item.price_half,
      price_full: item.price_full,
      food_type: item.food_type,
      category_id: item.category,
      available: item.available ? 1 : 0,
      image_path: item.image_path,
      created_at: item.created_at
    };
    
    res.status(200).json(formattedItem);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching item', error: err.message });
  }
});

// Create a new item (requires authentication)
router.post('/', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    const { name, description, price_half, price_full, category_id, food_type } = req.body;
    
    // Validate required fields
    if (!name || typeof name !== 'string' || !price_full || !category_id) {
      // If file was uploaded, delete it since we're not creating the item
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({ message: 'Name, full plate price, and category are required' });
    }
    
    // Sanitize and validate input
    const sanitizedName = name.trim();
    const sanitizedDescription = description ? description.trim() : '';
    
    if (sanitizedName.length === 0) {
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({ message: 'Item name cannot be empty' });
    }
    if (sanitizedName.length > 100) {
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({ message: 'Item name cannot exceed 100 characters' });
    }
    if (sanitizedDescription.length > 500) {
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({ message: 'Description cannot exceed 500 characters' });
    }
    
    // Validate prices
    const parsedPriceFull = parseFloat(price_full);
    const parsedPriceHalf = price_half ? parseFloat(price_half) : null;
    
    if (isNaN(parsedPriceFull) || parsedPriceFull < 0) {
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({ message: 'Full price must be a valid positive number' });
    }
    if (parsedPriceHalf !== null && (isNaN(parsedPriceHalf) || parsedPriceHalf < 0)) {
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({ message: 'Half price must be a valid positive number' });
    }
    
    // Validate food type
    const validFoodTypes = ['veg', 'non-veg', 'egg'];
    const sanitizedFoodType = food_type && validFoodTypes.includes(food_type) ? food_type : 'veg';
    
    // Check if category exists
    const category = await Category.findById(category_id);
    if (!category) {
      // If file was uploaded, delete it since we're not creating the item
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({ message: 'Category not found' });
    }
    
    // Get the highest order value for items in this category
    const highestOrderItem = await Item.findOne({ category: category_id }).sort({ order: -1 });
    const nextOrder = highestOrderItem ? highestOrderItem.order + 1 : 0;
    
    // Create new item
    const newItem = new Item({
      name: sanitizedName,
      description: sanitizedDescription,
      price_half: parsedPriceHalf,
      price_full: parsedPriceFull,
      food_type: sanitizedFoodType,
      category: category_id,
      available: true,
      image_path: req.file ? `/uploads/${req.file.filename}` : null,
      order: nextOrder
    });
    
    await newItem.save();
    
    res.status(201).json({
      message: 'Item created successfully',
      item: {
        id: newItem._id,
        name: newItem.name,
        description: newItem.description,
        price_half: newItem.price_half,
        price_full: newItem.price_full,
        food_type: newItem.food_type,
        category_id: newItem.category,
        available: newItem.available ? 1 : 0,
        image_path: newItem.image_path
      }
    });
  } catch (err) {
    // If file was uploaded, delete it since we're not creating the item
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ message: 'Error creating item', error: err.message });
  }
});

// Update an item (requires authentication)
router.put('/:id', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    const itemId = req.params.id;
    const { name, description, price_half, price_full, category_id, food_type, available } = req.body;
    
    // Validate required fields
    if (!name || typeof name !== 'string' || !price_full || !category_id) {
      // If file was uploaded, delete it since we're not updating the item
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({ message: 'Name, full plate price, and category are required' });
    }
    
    // Sanitize and validate input
    const sanitizedName = name.trim();
    const sanitizedDescription = description ? description.trim() : '';
    
    if (sanitizedName.length === 0) {
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({ message: 'Item name cannot be empty' });
    }
    if (sanitizedName.length > 100) {
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({ message: 'Item name cannot exceed 100 characters' });
    }
    if (sanitizedDescription.length > 500) {
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({ message: 'Description cannot exceed 500 characters' });
    }
    
    // Validate prices
    const parsedPriceFull = parseFloat(price_full);
    const parsedPriceHalf = price_half ? parseFloat(price_half) : null;
    
    if (isNaN(parsedPriceFull) || parsedPriceFull < 0) {
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({ message: 'Full price must be a valid positive number' });
    }
    if (parsedPriceHalf !== null && (isNaN(parsedPriceHalf) || parsedPriceHalf < 0)) {
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({ message: 'Half price must be a valid positive number' });
    }
    
    // Validate food type
    const validFoodTypes = ['veg', 'non-veg', 'egg'];
    const sanitizedFoodType = food_type && validFoodTypes.includes(food_type) ? food_type : 'veg';
    
    // Validate availability
    const isAvailable = available === 'true' || available === true || available === 1;
    
    // Check if item exists
    const item = await Item.findById(itemId);
    if (!item) {
      // If file was uploaded, delete it since we're not updating the item
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(404).json({ message: 'Item not found' });
    }
    
    // Check if category exists
    const category = await Category.findById(category_id);
    if (!category) {
      // If file was uploaded, delete it since we're not updating the item
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({ message: 'Category not found' });
    }
    
    // Handle image update
    let imagePath = item.image_path;
    
    if (req.file) {
      // If there's a new image, delete the old one if it exists
      if (item.image_path) {
        const oldImagePath = path.join(__dirname, '../public', item.image_path);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      imagePath = `/uploads/${req.file.filename}`;
    }
    
    // Update the item
    const updatedItem = await Item.findByIdAndUpdate(
      itemId,
      {
        name: sanitizedName,
        description: sanitizedDescription,
        price_half: parsedPriceHalf,
        price_full: parsedPriceFull,
        food_type: sanitizedFoodType,
        category: category_id,
        available: isAvailable,
        image_path: imagePath
      },
      { new: true }
    );
    
    res.status(200).json({
      message: 'Item updated successfully',
      item: {
        id: updatedItem._id,
        name: updatedItem.name,
        description: updatedItem.description,
        price_half: updatedItem.price_half,
        price_full: updatedItem.price_full,
        food_type: updatedItem.food_type,
        category_id: updatedItem.category,
        available: updatedItem.available ? 1 : 0,
        image_path: updatedItem.image_path
      }
    });
  } catch (err) {
    // If file was uploaded, delete it since we're not updating the item
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ message: 'Error updating item', error: err.message });
  }
});

// Toggle item availability (requires authentication)
router.patch('/:id/toggle-availability', authenticateToken, async (req, res) => {
  try {
    const itemId = req.params.id;
    
    // Check if item exists
    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    // Toggle availability
    item.available = !item.available;
    await item.save();
    
    res.status(200).json({
      message: `Item is now ${item.available ? 'available' : 'unavailable'}`,
      available: item.available ? 1 : 0
    });
  } catch (err) {
    res.status(500).json({ message: 'Error toggling item availability', error: err.message });
  }
});

// Delete an item (requires authentication)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const itemId = req.params.id;
    
    // Check if item exists
    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    // Delete the image file if it exists
    if (item.image_path) {
      const imagePath = path.join(__dirname, '../public', item.image_path);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    // Delete the item
    await Item.findByIdAndDelete(itemId);
    
    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting item', error: err.message });
  }
});

// Reorder items within a category
router.put('/reorder', authenticateToken, async (req, res) => {
  try {
    const { items } = req.body;
    
    if (!items || !Array.isArray(items)) {
      return res.status(400).json({ message: 'Items array is required' });
    }
    
    // Update the order for each item
    const updatePromises = items.map(item => 
      Item.findByIdAndUpdate(
        item.id,
        { order: item.order },
        { new: true }
      )
    );
    
    await Promise.all(updatePromises);
    
    res.status(200).json({ message: 'Items reordered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error reordering items', error: err.message });
  }
});

module.exports = router;