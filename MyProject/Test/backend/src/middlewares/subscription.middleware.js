import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/apiError.js";

export const checkSubscription = asyncHandler(async (req, res, next) => {
    const user = req.user;

    if (!user) {
        throw new ApiError(401, "Unauthorized");
    }

    // Free plan or Active Pro/Enterprise plan -> Allow
    if (user.plan === "Free") {
        return next();
    }

    if (user.planExpiry && new Date() > new Date(user.planExpiry)) {
        // Plan expired
        // Block only write operations (POST, PUT, DELETE, PATCH)
        // Allow GET (Read-only)
        if (req.method !== "GET") {
            throw new ApiError(403, "Your subscription has expired. Please renew to perform this action. You can still view and download your files.");
        }
    }

    next();
});

export const checkPlanLimits = asyncHandler(async (req, res, next) => {
    // This middleware can be used to check specific limits like storage, uploads etc.
    // For now, simple expiry check is primary. 
    // Storage limit is usually checked at upload time.
    next();
});
