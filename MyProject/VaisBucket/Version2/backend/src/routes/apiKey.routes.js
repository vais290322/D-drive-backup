import express from "express";
import {
    createApiKey,
    getMyApiKeys,
    getApiKeyById,
    revokeApiKey,
    deleteApiKey,
    getApiKeyStats,
    updateApiKey,
} from "../controllers/apiKey.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { apiLimiter } from "../middlewares/rateLimiter.middleware.js";

const router = express.Router();

// All API key routes require JWT authentication (not API key auth)
router.use(verifyJWT);

// API key management routes
router.post("/", apiLimiter, createApiKey);
router.get("/", apiLimiter, getMyApiKeys);
router.get("/:id", apiLimiter, getApiKeyById);
router.patch("/:id", apiLimiter, updateApiKey);
router.delete("/:id", apiLimiter, revokeApiKey);
router.delete("/:id/permanent", apiLimiter, deleteApiKey);
router.get("/:id/stats", apiLimiter, getApiKeyStats);

export default router;
