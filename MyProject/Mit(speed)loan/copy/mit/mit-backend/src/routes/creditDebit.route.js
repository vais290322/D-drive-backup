const express = require('express');
const router = express.Router();

const { getCreditDebit, createCreditDebit, updateCreditDebit, deleteCreditDebit } = require('../controllers/creditDebit.controller');



router.get('/get', getCreditDebit);
router.post('/create', createCreditDebit);
router.put('/update/:id', updateCreditDebit);
router.delete('/delete/:id', deleteCreditDebit);

module.exports = router;
