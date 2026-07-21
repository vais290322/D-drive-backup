import { Router } from "express";
import {
    getSystemStats,
    getAllUsers,
    updateUserStorageLimit,
    toggleUserStatus,
    getUserDetails,
    updateAdminMessage,
    getSystemSettings,
    toggleSignupMode,
    getTransactionHistory,
    getRevenueStats,
    getUserTransactions
} from "../controllers/admin.controller.js";
import { verifyJWT, isAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

// Protect all admin routes
router.use(verifyJWT, isAdmin);

router.get("/stats", getSystemStats);
router.get("/users", getAllUsers);
router.patch("/users/:userId/limit", updateUserStorageLimit);
router.patch("/users/:userId/status", toggleUserStatus);
router.get("/users/:userId", getUserDetails);
router.patch("/users/:userId/message", updateAdminMessage);

// System Settings
router.get("/settings", getSystemSettings);
router.patch("/settings/signup-mode", toggleSignupMode);

// Revenue & Transactions
router.get("/transactions", getTransactionHistory);
router.get("/revenue", getRevenueStats);
router.get("/users/:userId/transactions", getUserTransactions);

export default router;
