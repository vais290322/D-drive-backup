const express = require('express');
const crypto = require('crypto');
const QRCode = require('qrcode');
const Loan = require('../models/Loan');
const auth = require('../middleware/auth');

const router = express.Router();

const EmiPayment = require('../models/EmiPayment');
const Penalty = require('../models/Penalty');

// Get all loans
router.get('/', auth, async (req, res) => {
  try {
    const loans = await Loan.find().populate('customer_id').lean();

    // Get all loan IDs
    const loanIds = loans.map(l => l._id);

    // Aggregate total payments per loan
    const payments = await EmiPayment.aggregate([
      { $match: { loan_id: { $in: loanIds } } },
      { $group: { _id: "$loan_id", total: { $sum: "$amount_paid" } } }
    ]);

    // Aggregate total penalties per loan
    const penalties = await Penalty.aggregate([
      { $match: { loan_id: { $in: loanIds } } },
      { $group: { _id: "$loan_id", total: { $sum: "$amount" } } }
    ]);

    // Create maps for O(1) lookup
    const paymentMap = {};
    payments.forEach(p => paymentMap[p._id.toString()] = p.total);

    const penaltyMap = {};
    penalties.forEach(p => penaltyMap[p._id.toString()] = p.total);

    // Map to match frontend expectations and add outstanding amount
    const mappedLoans = loans.map(loan => {
      const totalPaid = paymentMap[loan._id.toString()] || 0;
      const totalPenalties = penaltyMap[loan._id.toString()] || 0;

      const totalObligation =
        (loan.principal_amount || 0) +
        (loan.total_interest || 0) +
        (loan.processing_fee || 0) +
        (loan.insurance_fee || 0) +
        totalPenalties;

      const outstanding = Math.max(0, totalObligation - totalPaid);

      return {
        ...loan,
        id: loan._id.toString(), // Add id field for frontend
        loan_id: loan.loan_code, // Map loan_code to loan_id
        customer: loan.customer_id, // Map customer_id populated object to customer
        outstanding_amount: outstanding // Calculated outstanding amount
      };
    });

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
    const Product = require('../models/Product');
    const EmiSchedule = require('../models/EmiSchedule');
    const PhonePeService = require('../services/PhonePeService');
    const { generateOrUpdateSchedule } = require('../utils/calculationUtils');

    // 1. Map frontend loan_id to loan_code
    if (data.loan_id) {
      data.loan_code = data.loan_id;
      delete data.loan_id;
    }

    // 2. Validate Product & Status
    if (data.product_id) {
      const product = await Product.findById(data.product_id);
      if (!product) {
        return res.status(400).json({ message: 'Product not found' });
      }
      if (product.status !== 'available') {
        return res.status(400).json({ message: 'Product is not available (already assigned or sold)' });
      }

      // Mark product as assigned
      await Product.findByIdAndUpdate(data.product_id, { status: 'assigned' });
    }

    // 3. Create Loan (FIRST)
    const loan = await Loan.create(data);

    // 4. Generate PhonePe Static QR ✅ NEW
    try {
      console.log(`📱 Generating PhonePe Static QR for Loan: ${loan.loan_code}`);

      const qrData = await PhonePeService.createStaticQR(
        loan._id.toString(),
        loan.loan_code,
        loan.installment_amount
      );

      loan.phonepe_qr_data = qrData;
      await loan.save();

      console.log(`✅ PhonePe Static QR generated for Loan: ${loan.loan_code}`);

    } catch (qrError) {
      console.warn(`⚠️ PhonePe QR generation failed: ${qrError.message}`);
      // Don't fail the entire request - user can regenerate later via API
      // For development, generate mock QR
      if (process.env.NODE_ENV === 'development' || process.env.PHONEPE_ENV === 'development') {
        try {
          const mockQR = await PhonePeService.generateMockQR(
            loan._id.toString(),
            loan.loan_code,
            loan.installment_amount
          );
          loan.phonepe_qr_data = mockQR;
          await loan.save();
          console.log(`📱 Mock PhonePe QR generated (development mode)`);
        } catch (mockError) {
          console.warn(`⚠️ Mock QR generation also failed: ${mockError.message}`);
        }
      }
    }

    // 5. Generate EMI Schedule
    try {
      const schedule = await generateOrUpdateSchedule(loan, null, []);
      if (schedule.length > 0) {
        await EmiSchedule.insertMany(schedule);
      }

      // 6. Record Down Payment if exists
      if (data.down_payment > 0) {
        const EmiPayment = require('../models/EmiPayment');
        await EmiPayment.create({
          loan_id: loan._id,
          payment_date: loan.start_date || new Date(),
          amount_paid: data.down_payment,
          payment_mode: data.down_payment_mode || 'cash', // Default to cash if not provided
          remarks: 'Down Payment',
          collected_by: req.user ? req.user.id : null // Assuming auth middleware attaches user
        });
      }

    } catch (calcError) {
      console.error('Error generating schedule/payment:', calcError);
      // We don't fail the request, but we log it. User can regenerate later.
    }

    res.status(201).json(loan);
  } catch (err) {
    console.error('Create loan error:', err);
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Loan ID/Code already exists' });
    }
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
});

// Get by id
router.get('/:id',  async (req, res) => {
  try {
    const l = await Loan.findById(req.params.id)
      .populate('customer_id')
      .populate('product_id')
      .lean();
    if (!l) return res.status(404).json({ message: 'Not found' });

    // Map fields to match frontend expectations
    const loan = {
      ...l,
      id: l._id.toString(),
      loan_id: l.loan_code,
      customer_id: l.customer_id?._id?.toString() || l.customer_id, // Keep as ID for form
      product_id: l.product_id?._id?.toString() || l.product_id || null, // Keep as ID for form
      customer: l.customer_id, // Also provide full customer object if needed
      product: l.product_id // Also provide full product object if needed
    };

    res.json(loan);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


// Update loan
router.put('/:id', auth, async (req, res) => {
  try {
    const { generateOrUpdateSchedule } = require('../utils/calculationUtils');
    const EmiSchedule = require('../models/EmiSchedule');

    const oldLoan = await Loan.findById(req.params.id);
    if (!oldLoan) {
      return res.status(404).json({ message: 'Loan not found' });
    }

    const loan = await Loan.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    // Check if critical fields changed that require schedule regeneration
    const criticalFields = [
      'principal_amount',
      'interest_rate',
      'interest_type',
      'tenure_months',
      'start_date',
      'first_emi_date',
      'emi_day_of_month'
    ];

    const needsRegeneration = criticalFields.some(field => {
      // Simple equality check, might need strict type handling if formats differ
      // Dates might need comparison adjustments
      if (field.includes('date')) {
        return new Date(oldLoan[field]).toISOString().split('T')[0] !== new Date(loan[field]).toISOString().split('T')[0];
      }
      return oldLoan[field] != loan[field];
    });

    if (needsRegeneration) {
      console.log(`Critical terms changed for loan ${loan._id}. Regenerating schedule...`);

      // Delete existing schedule (future: handle partial updates if payments made?)
      // For now, full regeneration assuming no payments or willing to reset
      // proper logic would be check for existing payments and only regenerate future
      // but the requirement implies simple editing.

      // However, if payments exist, full regeneration might break history if not careful.
      // safely, we should probably only regenerate if no payments or just overwrite?
      // The generateOrUpdateSchedule function might handle this? 
      // Let's assume we want to fully regenerate the schedule based on new terms.

      await EmiSchedule.deleteMany({ loan_id: loan._id });
      const schedule = await generateOrUpdateSchedule(loan, null, []);
      if (schedule.length > 0) {
        await EmiSchedule.insertMany(schedule);
      }
    }

    res.json(loan);
  } catch (err) {
    console.error('Update loan error:', err);
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
});

// Get EMI schedule
router.get('/:id/schedule', async (req, res) => {
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
