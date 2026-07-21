import { Router } from "express";
import { createOrder, verifyPayment, getPlans, getMyTransactions, downloadInvoice } from "../controllers/subscription.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT); // All subscription routes require login

router.route("/order").post(createOrder);
router.route("/verify").post(verifyPayment);
router.route("/plans").get(getPlans);
router.route("/my-transactions").get(getMyTransactions);
router.route("/invoice/:id").get(downloadInvoice);

export default router;
