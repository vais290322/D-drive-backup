import express from "express";
import {
    uploadFile,
    uploadBase64,
    getMyFiles,
    getFileById,
    deleteFile,
    downloadFile,
    generateSignedUrlForFile,
    accessFileWithSignedUrl,
    getFileStats,
    updateFile,
} from "../controllers/file.controller.js";
import { verifyAuth } from "../middlewares/apiKeyAuth.middleware.js";
import { checkPermission } from "../middlewares/apiKeyAuth.middleware.js";
import upload from "../middlewares/multer.middleware.js";
import {
    uploadLimiter,
    apiLimiter,
    downloadLimiter,
} from "../middlewares/rateLimiter.middleware.js";

const router = express.Router();

// Upload routes
router.post(
    "/upload",
    verifyAuth,
    checkPermission("upload"),
    uploadLimiter,
    upload.single("file"),
    uploadFile
);

router.post(
    "/upload-base64",
    verifyAuth,
    checkPermission("upload"),
    uploadLimiter,
    uploadBase64
);

// File management routes
router.get("/stats", verifyAuth, apiLimiter, getFileStats);
router.get("/", verifyAuth, checkPermission("read"), apiLimiter, getMyFiles);
router.get("/:id", verifyAuth, checkPermission("read"), apiLimiter, getFileById);
router.patch("/:id", verifyAuth, apiLimiter, updateFile);
router.delete(
    "/:id",
    verifyAuth,
    checkPermission("delete"),
    apiLimiter,
    deleteFile
);

// Download and access routes
router.get(
    "/:id/download",
    verifyAuth,
    checkPermission("read"),
    downloadLimiter,
    downloadFile
);

// Signed URL routes
router.post("/:id/signed-url", verifyAuth, apiLimiter, generateSignedUrlForFile);
router.get("/:id/access", accessFileWithSignedUrl); // Public with token

export default router;
