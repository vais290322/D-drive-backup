import express from "express";
import {
    createFolder,
    getDirectoryContents,
    renameFolder,
    deleteFolder,
} from "../controllers/folder.controller.js";
import { verifyAuth } from "../middlewares/apiKeyAuth.middleware.js";
import { apiLimiter } from "../middlewares/rateLimiter.middleware.js";

const router = express.Router();

router.use(verifyAuth); // All folder routes require authentication

router.post("/", apiLimiter, createFolder);
router.get("/", apiLimiter, getDirectoryContents);
router.patch("/:id", apiLimiter, renameFolder);
router.delete("/:id", apiLimiter, deleteFolder);

export default router;
