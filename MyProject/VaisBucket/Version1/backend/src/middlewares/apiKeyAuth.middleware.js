import ApiKey from "../models/ApiKey.model.js";
import User from "../models/User.model.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Verify API Key
export const verifyApiKey = asyncHandler(async (req, res, next) => {
    try {
        // Get API key from header
        const apiKey = req.header("X-API-Key");

        if (!apiKey) {
            throw new ApiError(401, "Unauthorized - No API key provided");
        }

        // Validate API key
        const validatedKey = await ApiKey.validateKey(apiKey);

        if (!validatedKey) {
            throw new ApiError(401, "Unauthorized - Invalid or expired API key");
        }

        // Get user associated with API key
        const user = await User.findById(validatedKey.owner);

        if (!user) {
            throw new ApiError(401, "Unauthorized - User not found");
        }

        if (!user.isActive) {
            throw new ApiError(403, "Account is deactivated");
        }

        // Increment usage count
        await validatedKey.incrementUsage();

        // Attach user and API key to request
        req.user = user;
        req.apiKey = validatedKey;
        req.authMethod = "apiKey";

        next();
    } catch (error) {
        throw error;
    }
});

// Check API key permissions
export const checkPermission = (requiredPermission) => {
    return asyncHandler(async (req, res, next) => {
        if (!req.apiKey) {
            // If not using API key (using JWT), allow all operations
            return next();
        }

        const permissions = req.apiKey.permissions || [];

        console.log("--- API KEY PERMISSION CHECK ---");
        console.log("Key Prefix:", req.apiKey.prefix);
        console.log("Required:", requiredPermission);
        console.log("Available:", JSON.stringify(permissions));

        // Check if API key has "all" permission or the specific required permission
        if (permissions.includes("all") || permissions.includes(requiredPermission)) {
            console.log("Permission Granted");
            return next();
        }

        console.log("Permission Denied");
        throw new ApiError(
            403,
            `Forbidden - API key does not have '${requiredPermission}' permission`
        );
    });
};

// Middleware to accept either JWT or API Key
export const verifyAuth = asyncHandler(async (req, res, next) => {
    // Check for API key first
    const apiKey = req.header("X-API-Key");
    const token =
        req.cookies?.accessToken ||
        req.header("Authorization")?.replace("Bearer ", "");

    if (apiKey) {
        // Use API key authentication
        return verifyApiKey(req, res, next); 
    } else if (token) {
        // Use JWT authentication
        const { verifyJWT } = await import("./auth.middleware.js");
        return verifyJWT(req, res, next);
    } else {
        throw new ApiError(401, "Unauthorized - No authentication credentials provided");
    }
});
