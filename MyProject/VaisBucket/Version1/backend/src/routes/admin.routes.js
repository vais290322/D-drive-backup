import { Router } from "express";
import {
    getSystemStats,
    getAllUsers,
    updateUserStorageLimit,
    toggleUserStatus,
    getUserDetails,
    updateAdminMessage
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

export default router;
