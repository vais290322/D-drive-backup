import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
import {ApiError} from "../utils/apiError.js";
import {asyncHandler} from "../utils/asyncHandler.js";

// Verify JWT token
export const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        // Get token from header or cookies
        const token =
            req.cookies?.accessToken ||
            req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            throw new ApiError(401, "Unauthorized - No token provided");
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find user
        const user = await User.findById(decoded._id).select("-password -refreshToken");

        if (!user) {
            throw new ApiError(401, "Unauthorized - Invalid token");
        }

        if (!user.isActive) {
            throw new ApiError(403, "Account is deactivated");
        }

        // Attach user to request
        req.user = user;
        next();
    } catch (error) {
        if (error.name === "JsonWebTokenError") {
            throw new ApiError(401, "Unauthorized - Invalid token");
        }
        if (error.name === "TokenExpiredError") {
            throw new ApiError(401, "Unauthorized - Token expired");
        }
        throw error;
    }
});

// Optional JWT verification (doesn't throw error if no token)
export const optionalJWT = asyncHandler(async (req, res, next) => {
    try {
        const token =
            req.cookies?.accessToken ||
            req.header("Authorization")?.replace("Bearer ", "");

        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded._id).select("-password -refreshToken");

            if (user && user.isActive) {
                req.user = user;
            }
        }

        next();
    } catch (error) {
        // Continue without user if token is invalid
        next();
    }
});

// Check if user is admin
export const isAdmin = asyncHandler(async (req, res, next) => {
    if (!req.user) {
        throw new ApiError(401, "Unauthorized - Authentication required");
    }

    if (req.user.role !== "admin") {
        throw new ApiError(403, "Forbidden - Admin access required");
    }

    next();
});

// Verify refresh token
export const verifyRefreshToken = asyncHandler(async (req, res, next) => {
    try {
        const refreshToken = req.cookies?.refreshToken || req.body.refreshToken;

        if (!refreshToken) {
            throw new ApiError(401, "Unauthorized - No refresh token provided");
        }

        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

        const user = await User.findById(decoded._id).select("+refreshToken");

        if (!user) {
            throw new ApiError(401, "Unauthorized - Invalid refresh token");
        }

        if (user.refreshToken !== refreshToken) {
            throw new ApiError(401, "Unauthorized - Refresh token mismatch");
        }

        req.user = user;
        next();
    } catch (error) {
        if (error.name === "JsonWebTokenError") {
            throw new ApiError(401, "Unauthorized - Invalid refresh token");
        }
        if (error.name === "TokenExpiredError") {
            throw new ApiError(401, "Unauthorized - Refresh token expired");
        }
        throw error;
    }
});
