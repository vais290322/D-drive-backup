import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { getMailAccounts, addMailAccount, deleteMailAccount } from '../controllers/mailAccountController.js';

const router = express.Router();

router.get('/', authMiddleware, getMailAccounts);
router.post('/', authMiddleware, addMailAccount);
router.delete('/:id', authMiddleware, deleteMailAccount);

export default router;
