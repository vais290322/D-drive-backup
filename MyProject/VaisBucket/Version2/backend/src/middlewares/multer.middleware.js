import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import { fileTypeFromBuffer } from "file-type";
import {
    generateUserFilePath,
    ensureDirectoryExists,
} from "../utils/fileHelper.js";

// Base upload directory (should be absolute in production, e.g. /mnt/storage)
const baseUploadDir = process.env.UPLOAD_DIR || "./uploads";

// Ensure base directory exists
if (!fs.existsSync(baseUploadDir)) {
    fs.mkdirSync(baseUploadDir, { recursive: true });
}

// Configure disk storage with hierarchical structure
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        try {
            // User must be authenticated
            const userId = req.user?._id;

            if (!userId) {
                return cb(new Error("User authentication required for file upload"));
            }

            // users/{userId}/{year}/{month}
            const userPath = generateUserFilePath(userId);
            const fullPath = path.join(baseUploadDir, userPath);

            // Ensure directory exists
            ensureDirectoryExists(fullPath);

            // Store relative path for controller (used in URL + DB)
            req.userUploadPath = userPath;

            cb(null, fullPath);
        } catch (err) {
            cb(err);
        }
    },

    filename: function (req, file, cb) {
        const uniqueSuffix = `${Date.now()}-${uuidv4()}`;
        const ext = path.extname(file.originalname);
        const nameWithoutExt = path.basename(file.originalname, ext);

        // Sanitize filename
        const sanitizedName = nameWithoutExt.replace(/[^a-zA-Z0-9]/g, "_");

        cb(null, `${uniqueSuffix}-${sanitizedName}${ext}`);
    },
});

// Basic file filter (extension + mimetype - first line of defense)
// Note: This is NOT sufficient for security, magic bytes validation happens after upload
const fileFilter = (req, file, cb) => {
    const allowedTypes = process.env.ALLOWED_FILE_TYPES
        ? process.env.ALLOWED_FILE_TYPES.split(",")
        : ["jpg", "jpeg", "png", "gif", "webp", "mp4", "avi", "mov", "pdf", "docx", "xlsx", "csv"];

    const ext = path.extname(file.originalname).toLowerCase().replace(".", "");

    const allowedMimeTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/webp",
        "video/mp4",
        "video/avi",
        "video/quicktime",
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/msword",
        "application/vnd.ms-excel",
        "text/csv",
        "application/csv",
    ];

    if (allowedTypes.includes(ext) && allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(
            new Error(`Invalid file type. Allowed types: ${allowedTypes.join(", ")}`),
            false
        );
    }
};

// Multer instance
const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: parseInt(process.env.MAX_FILE_SIZE) || 100 * 1024 * 1024, // 100MB default
    },
});

/**
 * ENTERPRISE-GRADE FILE VALIDATION
 * Validates file using magic bytes (actual file content)
 * This prevents spoofed extensions and MIME types
 * 
 * Call this AFTER file upload in the controller
 */
export const validateFileMagicBytes = async (filePath) => {
    try {
        // Read file buffer
        const buffer = fs.readFileSync(filePath);

        // Detect actual file type from magic bytes
        const fileType = await fileTypeFromBuffer(buffer);

        // Allowed MIME types based on actual file content
        const allowedMimeTypes = [
            "image/jpeg",
            "image/png",
            "image/gif",
            "image/webp",
            "video/mp4",
            "video/quicktime",
            "application/pdf",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        ];

        // If file-type can't detect it, check if it's a text-based format
        if (!fileType) {
            // CSV and text files might not have magic bytes
            const ext = path.extname(filePath).toLowerCase();
            if (ext === ".csv" || ext === ".txt") {
                return { valid: true, detectedType: "text/csv" };
            }
            return {
                valid: false,
                error: "Unable to detect file type from content. File may be corrupted or unsupported."
            };
        }

        // Validate detected MIME type against allowed types
        if (!allowedMimeTypes.includes(fileType.mime)) {
            return {
                valid: false,
                error: `File type ${fileType.mime} not allowed (detected from file content, not headers)`
            };
        }

        return { valid: true, detectedType: fileType.mime };
    } catch (error) {
        return {
            valid: false,
            error: `File validation failed: ${error.message}`
        };
    }
};

export default upload;
