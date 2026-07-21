const express = require('express');
const Customer = require('../models/Customer');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all customers
router.get('/', auth, async (req, res) => {
  try {
    const customers = await Customer.find().lean();
    res.json(customers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create customer
router.post('/', auth, async (req, res) => {
  try {
    const data = req.body;
    const customer = await Customer.create(data);
    res.json(customer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get by id
router.get('/:id', auth, async (req, res) => {
  try {
    const c = await Customer.findById(req.params.id).lean();
    if (!c) return res.status(404).json({ message: 'Not found' });
    res.json(c);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
