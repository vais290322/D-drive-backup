import express from "express";
import {
    register,
    login,
    logout,
    refreshAccessToken,
    getProfile,
    updateProfile,
    changePassword,
} from "../controllers/auth.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authLimiter } from "../middlewares/rateLimiter.middleware.js";

const router = express.Router();

// Public routes
router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);
router.post("/refresh", refreshAccessToken);

// Protected routes
router.post("/logout", verifyJWT, logout);
router.get("/profile", verifyJWT, getProfile);
router.patch("/profile", verifyJWT, updateProfile);
router.patch("/change-password", verifyJWT, changePassword);

export default router;
