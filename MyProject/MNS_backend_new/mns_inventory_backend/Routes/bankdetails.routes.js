
import express from 'express';
const router = express.Router();
import { AddBankAccountDetails,UpdateBankAccountDetails,getBankAccountDetails}  from '../Controllers/bank.controller.js'


router.post('/addBankDetails',AddBankAccountDetails);
router.put('/updateBankDetails/:bankId',UpdateBankAccountDetails);
router.get('/getBankDetails',getBankAccountDetails);

export default router;
