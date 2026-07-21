const express = require('express');
const Loan = require('../models/Loan');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all loans
router.get('/', auth, async (req, res) => {
  try {
    const loans = await Loan.find().populate('customer_id').lean();

    // Map to match frontend expectations
    const mappedLoans = loans.map(loan => ({
      ...loan,
      loan_id: loan.loan_code, // Map loan_code to loan_id
      customer: loan.customer_id // Map customer_id populated object to customer
    }));

    res.json(mappedLoans);
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
    const l = await Loan.findById(req.params.id).populate('customer_id').lean();
    if (!l) return res.status(404).json({ message: 'Not found' });

    // Map fields
    const loan = {
      ...l,
      loan_id: l.loan_code,
      customer: l.customer_id
    };

    res.json(loan);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get EMI schedule
router.get('/:id/schedule', auth, async (req, res) => {
  try {
    const EmiSchedule = require('../models/EmiSchedule');
    const schedule = await EmiSchedule.find({ loan_id: req.params.id }).sort({ emi_number: 1 });
    res.json(schedule);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Regenerate EMI schedule
// Regenerate EMI schedule
router.post('/:id/schedule/regenerate', auth, async (req, res) => {
  try {
    const EmiSchedule = require('../models/EmiSchedule');
    const { generateOrUpdateSchedule } = require('../utils/calculationUtils');

    console.log(`Regenerating schedule for loan: ${req.params.id}`);
    const loan = await Loan.findById(req.params.id);
    if (!loan) {
      return res.status(404).json({ message: 'Loan not found' });
    }

    // Delete existing schedule
    await EmiSchedule.deleteMany({ loan_id: req.params.id });

    // Generate fresh schedule
    const schedule = await generateOrUpdateSchedule(loan, null, []);

    console.log('Inserting schedule with ' + schedule.length + ' entries');
    if (schedule.length > 0) {
      await EmiSchedule.insertMany(schedule);
    }

    // Return sorted
    const newSchedule = await EmiSchedule.find({ loan_id: req.params.id }).sort({ emi_number: 1 });
    res.json(newSchedule);
  } catch (err) {
    console.error('Error in regenerate:', err);
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
});

module.exports = router;
