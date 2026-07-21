import File from "../models/File.model.js";
import User from "../models/User.model.js";

/**
 * Middleware to check if the owner of the requested asset is active.
 * Used before serving static files from /uploads.
 * Optimized with compound index query for production performance.
 */
export const checkAssetOwnerStatus = async (req, res, next) => {
    try {
        // Extract path components from the request
        // req.path can be:
        // - '/filename.png' (old flat structure)
        // - '/users/userId/2026/01/filename.png' (new hierarchical structure)
        const fullPath = req.path.substring(1); // Remove leading slash

        if (!fullPath) return next();

        // Extract filename and relative path
        const pathParts = fullPath.split('/');
        const fileName = pathParts.pop(); // Last part is the filename
        const relativePath = pathParts.length > 0 ? pathParts.join('/') : '';

        // Try to find file with relativePath first (new hierarchical structure)
        let file = await File.findOne({
            fileName,
            ...(relativePath && { relativePath })
        }).select('owner').lean();

        // Fallback: If not found with relativePath, try just fileName (old flat structure)
        if (!file && fileName) {
            file = await File.findOne({ fileName }).select('owner').lean();
        }

        if (file) {
            // Check owner status using indexed query
            const owner = await User.findById(file.owner).select('isActive').lean();

            if (owner && !owner.isActive) {
                console.log(`[ASSET BLOCKED] User ${file.owner} is inactive. Blocking: ${fileName}`);
                return res.status(403).json({
                    success: false,
                    message: "Access forbidden - This asset is currently blocked."
                });
            }
        } else {
            // File not found in database - might be a direct file access or old file
            // Allow it to proceed (fail open for non-existent DB records)
            console.log(`[ASSET WARNING] File not found in DB: ${fileName} (path: ${relativePath || 'flat'})`);
        }

        next();
    } catch (error) {
        console.error("Asset security check failed:", error);
        // Fail open to avoid complete blockage on DB errors
        // In production, consider failing closed for security
        next();
    }
};