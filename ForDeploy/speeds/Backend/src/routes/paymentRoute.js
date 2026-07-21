import express from 'express';
const router = express.Router();
import { createOrder, verifyPayment, getPaymentHistory, getPaymentHistoryall } from '../controllers/paymentController.js';
import { requireAuth, isAdmin } from "../middleware/authMiddleware.js";

// Create Razorpay order (user or admin)
router.post('/', requireAuth, isAdmin(["USER", "ADMIN"]), createOrder);

// Verify payment signature (user or admin)
router.post('/verify', requireAuth, isAdmin(["USER", "ADMIN"]), verifyPayment);

router.get('/history', requireAuth, isAdmin(["USER"]), getPaymentHistory);

router.get('/historyall', requireAuth, isAdmin(["ADMIN"]), getPaymentHistoryall);

export default router;