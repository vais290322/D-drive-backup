const express = require('express');
const { Category, Item } = require('../mongodb');
const { authenticateToken } = require('./auth');

const router = express.Router();

// Get all categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find().sort({ order: 1, name: 1 });
    
    // Format response to match the expected structure
    const formattedCategories = categories.map(category => ({
      id: category._id,
      name: category.name,
      order: category.order,
      created_at: category.created_at
    }));
    
    res.status(200).json(formattedCategories);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching categories', error: err.message });
  }
});

// Get a specific category by ID
router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    // Format response to match the expected structure
    const formattedCategory = {
      id: category._id,
      name: category.name,
      created_at: category.created_at
    };
    
    res.status(200).json(formattedCategory);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching category', error: err.message });
  }
});

// Create a new category (requires authentication)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name } = req.body;
    
    if (!name || typeof name !== 'string') {
      return res.status(400).json({ message: 'Category name is required and must be a string' });
    }
    
    // Sanitize and validate input
    const sanitizedName = name.trim();
    if (sanitizedName.length === 0) {
      return res.status(400).json({ message: 'Category name cannot be empty' });
    }
    if (sanitizedName.length > 100) {
      return res.status(400).json({ message: 'Category name cannot exceed 100 characters' });
    }
    
    // Check if category already exists
    const existingCategory = await Category.findOne({ name: sanitizedName });
    if (existingCategory) {
      return res.status(400).json({ message: 'Category already exists' });
    }
    
    // Get the highest order number and add 1
    const lastCategory = await Category.findOne().sort({ order: -1 });
    const newOrder = lastCategory ? lastCategory.order + 1 : 1;
    
    // Create new category
    const newCategory = new Category({ name: sanitizedName, order: newOrder });
    await newCategory.save();
    
    res.status(201).json({
      message: 'Category created successfully',
      category: {
        id: newCategory._id,
        name: newCategory.name,
        order: newCategory.order
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Error creating category', error: err.message });
  }
});

// Reorder categories (requires authentication)
router.put('/reorder', authenticateToken, async (req, res) => {
  try {
    const { categories } = req.body;
    
    if (!categories || !Array.isArray(categories)) {
      return res.status(400).json({ message: 'Categories array is required' });
    }
    
    // Update each category's order
    const updatePromises = categories.map(cat => 
      Category.findByIdAndUpdate(cat.id, { order: cat.order })
    );
    
    await Promise.all(updatePromises);
    
    res.status(200).json({ message: 'Categories reordered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error reordering categories', error: err.message });
  }
});

// Update a category (requires authentication)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const categoryId = req.params.id;
    const { name } = req.body;
    
    if (!name || typeof name !== 'string') {
      return res.status(400).json({ message: 'Category name is required and must be a string' });
    }
    
    // Sanitize and validate input
    const sanitizedName = name.trim();
    if (sanitizedName.length === 0) {
      return res.status(400).json({ message: 'Category name cannot be empty' });
    }
    if (sanitizedName.length > 100) {
      return res.status(400).json({ message: 'Category name cannot exceed 100 characters' });
    }
    
    // Check if category with the same name already exists (excluding current category)
    const existingCategory = await Category.findOne({ name: sanitizedName, _id: { $ne: categoryId } });
    if (existingCategory) {
      return res.status(400).json({ message: 'Category name already exists' });
    }
    
    // Update the category
    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      { name: sanitizedName },
      { new: true }
    );
    
    if (!updatedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    res.status(200).json({
      message: 'Category updated successfully',
      category: {
        id: updatedCategory._id,
        name: updatedCategory.name
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Error updating category', error: err.message });
  }
});

// Delete a category (requires authentication)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const categoryId = req.params.id;
    
    // Check if the category exists
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    // Delete all items in this category
    await Item.deleteMany({ category: categoryId });
    
    // Delete the category
    await Category.findByIdAndDelete(categoryId);
    
    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting category', error: err.message });
  }
});

// Get all items in a category
router.get('/:id/items', async (req, res) => {
  try {
    const categoryId = req.params.id;
    
    // Check if the category exists
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    const items = await Item.find({ category: categoryId }).sort({ name: 1 });
    
    // Format response to match the expected structure
    const formattedItems = items.map(item => ({
      id: item._id,
      name: item.name,
      price: item.price,
      category_id: item.category,
      available: item.available ? 1 : 0,
      image_path: item.image_path,
      created_at: item.created_at
    }));
    
    res.status(200).json(formattedItems);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching items', error: err.message });
  }
});

module.exports = router;