const express = require('express');
const Loan = require('../models/Loan');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all loans
router.get('/', auth, async (req, res) => {
  try {
    const loans = await Loan.find().lean();
    res.json(loans);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create loan
router.post('/', auth, async (req, res) => {
  try {
    const data = req.body;
    const loan = await Loan.create(data);
    res.json(loan);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get by id
router.get('/:id', auth, async (req, res) => {
  try {
    const l = await Loan.findById(req.params.id).lean();
    if (!l) return res.status(404).json({ message: 'Not found' });
    res.json(l);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
