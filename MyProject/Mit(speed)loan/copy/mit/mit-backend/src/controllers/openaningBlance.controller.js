const OpeningBalance = require('../models/openaningBlance');



const createOpeningBalance = async (req, res) => {
  try {
    const {  balance, date } = req.body;
    if(!balance || !date){
        return res.status(400).json({ message: 'Please provide all required fields date and amount' });
    }
    const existingOpeningBalance = await OpeningBalance.findOne();
    if (existingOpeningBalance) {
      return res.status(400).json({ message: 'Opening balance already exists ' });
    }
    const openingBalance = await OpeningBalance.create({ balance, date });
    res.status(201).json(openingBalance);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getOpeningBalance = async (req, res) => {
  try {
    const openingBalance = await OpeningBalance.find();
    res.json({data:openingBalance});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
module.exports = { createOpeningBalance, getOpeningBalance };
