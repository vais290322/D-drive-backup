import path from "path";
import fs from "fs";
import sharp from "sharp";

/**
 * Get file type category from MIME type
 */
export const getFileType = (mimeType) => {
    if (mimeType.startsWith("image/")) return "image";
    if (mimeType.startsWith("video/")) return "video";
    if (
        mimeType.includes("pdf") ||
        mimeType.includes("document") ||
        mimeType.includes("word") ||
        mimeType.includes("excel") ||
        mimeType.includes("spreadsheet") ||
        mimeType.includes("msword") ||
        mimeType.includes("ms-excel")
    ) {
        return "document";
    }
    return "other";
};

/**
 * Format file size to human-readable format
 */
export const formatFileSize = (bytes) => {
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    if (bytes === 0) return "0 Bytes";
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i];
};

/**
 * Generate hierarchical user file path
 * Creates: users/{userId}/{year}/{month}/
 */
export const generateUserFilePath = (userId) => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");

    return path.join("users", userId.toString(), year.toString(), month);
};

/**
 * Ensure directory exists, create if not
 */
export const ensureDirectoryExists = (dirPath) => {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
};

/**
 * Generate public URL for uploaded file
 * Supports both old flat structure and new hierarchical structure
 */
export const generatePublicUrl = (filename, req, relativePath = null) => {
    const protocol = req.protocol;
    const host = req.get("host");

    // If relativePath is provided, use it (new hierarchical structure)
    if (relativePath) {
        // Remove leading 'uploads/' if present to avoid duplication
        const cleanPath = relativePath.replace(/^uploads[\/\\]/, '');
        return `${protocol}://${host}/uploads/${cleanPath}/${filename}`;
    }

    // Fallback to old flat structure for backward compatibility
    return `${protocol}://${host}/uploads/${filename}`;
};

/**
 * Delete file from disk
 */
export const deleteFileFromDisk = (filePath) => {
    try {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            return true;
        }
        return false;
    } catch (error) {
        console.error("Error deleting file:", error);
        return false;
    }
};

/**
 * Get image metadata (dimensions)
 */
export const getImageMetadata = async (filePath) => {
    try {
        const metadata = await sharp(filePath).metadata();
        return {
            width: metadata.width,
            height: metadata.height,
            format: metadata.format,
        };
    } catch (error) {
        console.error("Error getting image metadata:", error);
        return null;
    }
};

/**
 * Optimize image (resize and compress)
 */
export const optimizeImage = async (inputPath, outputPath, options = {}) => {
    try {
        const {
            maxWidth = 1920,
            maxHeight = 1080,
            quality = 80,
            format = "jpeg",
        } = options;

        await sharp(inputPath)
            .resize(maxWidth, maxHeight, {
                fit: "inside",
                withoutEnlargement: true,
            })
        [format]({ quality })
            .toFile(outputPath);

        return true;
    } catch (error) {
        console.error("Error optimizing image:", error);
        return false;
    }
};

/**
 * Check if file exists
 */
export const fileExists = (filePath) => {
    return fs.existsSync(filePath);
};

/**
 * Get file extension
 */
export const getFileExtension = (filename) => {
    return path.extname(filename).toLowerCase();
};

/**
 * Sanitize filename
 */
export const sanitizeFilename = (filename) => {
    const ext = path.extname(filename);
    const nameWithoutExt = path.basename(filename, ext);
    const sanitized = nameWithoutExt.replace(/[^a-zA-Z0-9]/g, "_");
    return `${sanitized}${ext}`;
};

/**
 * Check storage quota
 */
export const checkStorageQuota = (user, fileSize) => {
    const availableStorage = user.storageLimit - user.storageUsed;
    return fileSize <= availableStorage;
};

/**
 * Update user storage
 */
export const updateUserStorage = async (user, fileSize, operation = "add") => {
    try {
        if (operation === "add") {
            user.storageUsed += fileSize;
        } else if (operation === "subtract") {
            user.storageUsed = Math.max(0, user.storageUsed - fileSize);
        }
        await user.save();
        return true;
    } catch (error) {
        console.error("Error updating user storage:", error);
        return false;
    }
};
