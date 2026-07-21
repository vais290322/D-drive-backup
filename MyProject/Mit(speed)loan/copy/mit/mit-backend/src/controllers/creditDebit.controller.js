const CreditDebit = require('../models/creditDebit');

const getCreditDebit = async (req, res) => {
  try {
    const creditDebit = await CreditDebit.find().sort({ date: 1 });
    res.status(200).json({
        data:creditDebit,
        message: 'Credit Debit records fetched successfully',
        success: true
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message,data:null });
  }
};

const createCreditDebit = async (req, res) => {
  try {
    const { date, particular, type, amount, amountType, paymentMode, transactionId } = req.body;
    if (!date || !particular || !type || !amount || !amountType || !paymentMode || !transactionId) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields', data:null });
    }
    const creditDebit = await CreditDebit.create({ date, particular, type, amount, amountType, paymentMode, transactionId });
    res.status(201).json({
        data:creditDebit,
        message: 'Credit Debit record created successfully',
        success: true   
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message,data:null });
  }
};

const updateCreditDebit = async (req, res) => {
  try {
    const { date, particular, type, amount, amountType, paymentMode, transactionId } = req.body;
    if (!date || !particular || !type || !amount || !amountType || !paymentMode || !transactionId) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields', data:null });
    }
    if (!req.params.id) {
      return res.status(400).json({ success: false, message: 'Please provide a valid id', data:null });
    }
    const creditDebit = await CreditDebit.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({
        data:creditDebit,
        message: 'Credit Debit record updated successfully',
        success: true   
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message,data:null });
  }
};

const deleteCreditDebit = async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ success: false, message: 'Please provide a valid id', data:null });
    }
    const creditDebit = await CreditDebit.findByIdAndDelete(req.params.id);
    res.status(200).json({
        data:creditDebit,
        message: 'Credit Debit record deleted successfully',
        success: true   
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message,data:null });
  }
};








module.exports = { getCreditDebit, createCreditDebit, updateCreditDebit, deleteCreditDebit };
