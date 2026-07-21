const express = require('express');
const Customer = require('../models/Customer');
const Loan = require('../models/Loan');
const EmiPayment = require('../models/EmiPayment');
const Penalty = require('../models/Penalty');
const auth = require('../middleware/auth');

const router = express.Router();

// Get customer ledger
router.get('/:id/ledger', auth, async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });

    const loans = await Loan.find({ customer_id: customer._id }).populate('product_id').lean();

    let totalDisbursed = 0;
    let totalPaid = 0;
    let totalOutstanding = 0;

    const loansWithDetails = await Promise.all(loans.map(async (loan) => {
      const payments = await EmiPayment.find({ loan_id: loan._id }).sort({ payment_date: -1 }).lean();
      const penalties = await Penalty.find({ loan_id: loan._id }).sort({ penalty_date: -1 }).lean();

      // Robust total payable calculation
      const totalPayable = loan.total_payable || loan.total_payable_amount || (loan.principal_amount + (loan.total_interest || 0));

      const loanPaid = payments.reduce((sum, p) => sum + p.amount_paid, 0);
      const loanPenalties = penalties.reduce((sum, p) => sum + p.amount, 0);

      // Outstanding = (Total Payable + Penalties) - Paid
      const loanOutstanding = Math.max(0, (totalPayable + loanPenalties) - loanPaid);

      totalDisbursed += loan.principal_amount || 0;
      totalPaid += loanPaid;
      totalOutstanding += loanOutstanding;

      // Update the loan object returned to ensure frontend works if it expects specific fields
      // Using .toObject() or manual spread since we used .lean()
      const loanWithFixedPayable = {
        ...loan,
        total_payable_amount: totalPayable,
        total_payable: totalPayable
      };

      return {
        loan: loanWithFixedPayable,
        product: loan.product_id,
        payments,
        penalties,
        summary: {
          totalPaid: loanPaid,
          totalOutstanding: loanOutstanding
        }
      };
    }));

    // Add Manual Loan if exists
    if (customer.manual_loan_details && customer.manual_loan_details.loan_amount) {
      const mLoan = customer.manual_loan_details;
      const amount = mLoan.loan_amount || 0;
      const emiAmount = mLoan.emi_amount || 0;
      const interestRate = mLoan.interest_rate || 0;

      // Calculate distinct total payable for manual loan
      let manualTotalPayable = amount;
      if (emiAmount && mLoan.emi_start_date && mLoan.emi_end_date) {
        const start = new Date(mLoan.emi_start_date);
        const end = new Date(mLoan.emi_end_date);
        const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
        manualTotalPayable = emiAmount * months;
      }

      // Estimate manual paid/outstanding
      // Since we don't track payments for manual loans, utilize estimation
      // or just say 0 paid unless we want to assume up-to-date?
      // Usually ledger shows REAL transactions. 
      // If no transactions, Paid = 0, Outstanding = Payable.
      // CHECK reports.js logic: I estimated Outstanding based on time.
      // Here, for ledger, maybe show 0 paid? 
      // Or if the user wants "active" status, they imply some payment happened?
      // Let's Estimated Paid based on time 
      let manualPaid = 0;
      let manualOutstanding = manualTotalPayable;

      if (mLoan.emi_start_date) {
        const start = new Date(mLoan.emi_start_date);
        const now = new Date();
        let monthsPassed = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth());
        if (now.getDate() < start.getDate()) monthsPassed--;
        if (monthsPassed < 0) monthsPassed = 0;

        // Cap at max tenure
        if (mLoan.emi_end_date) {
          const end = new Date(mLoan.emi_end_date);
          const totalMonths = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
          if (monthsPassed > totalMonths) monthsPassed = totalMonths;
        }

        // If we assume they pay regularly:
        manualPaid = emiAmount * monthsPassed;
        if (manualPaid > manualTotalPayable) manualPaid = manualTotalPayable;
        manualOutstanding = manualTotalPayable - manualPaid;
      }

      // Check if manual loan is closed (by date)
      let status = 'active';
      if (mLoan.emi_end_date && new Date() > new Date(mLoan.emi_end_date)) {
        status = 'completed';
        // If completed, assume fully paid? Or keep outstanding?
        // Usually "completed" means fully paid.
        manualPaid = manualTotalPayable;
        manualOutstanding = 0;
      }

      totalDisbursed += amount;
      totalPaid += manualPaid;
      totalOutstanding += manualOutstanding;

      loansWithDetails.push({
        loan: {
          _id: 'manual',
          loan_id: mLoan.loan_id || 'MANUAL',
          loan_type: 'MANUAL',
          start_date: mLoan.emi_start_date || new Date(),
          tenure_months: 12, // placeholder
          principal_amount: amount,
          total_interest: 0, // already in payable
          total_payable_amount: manualTotalPayable,
          installment_amount: emiAmount,
          status: status,
          processing_fee: 0,
          insurance_fee: 0
        },
        product: {
          brand: mLoan.item_name || 'Manual',
          model: mLoan.item_description || 'Item'
        },
        payments: [], // No actual payment records
        penalties: [],
        summary: {
          totalPaid: manualPaid,
          totalOutstanding: manualOutstanding
        }
      });
    }

    res.json({
      customer,
      loans: loansWithDetails,
      totalDisbursed,
      totalPaid,
      totalOutstanding
    });
  } catch (err) {
    console.error("Ledger Error:", err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all customers
router.get('/', auth, async (req, res) => {
  try {
    const customers = await Customer.find();
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
    const c = await Customer.findById(req.params.id);
    if (!c) return res.status(404).json({ message: 'Not found' });
    res.json(c);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update customer
router.put('/:id', auth, async (req, res) => {
  try {
    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!customer) return res.status(404).json({ message: 'Not found' });
    res.json(customer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete customer
router.delete('/:id', auth, async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Customer deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
