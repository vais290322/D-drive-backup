import User from "../models/User.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Cookie options
const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
}; 

/**
 * Register a new user
 * @route POST /api/v1/auth/register
 * @access Public
 */
export const register = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body.name;
    console.log(req.body);

    // Validate input
    if (!name || !email || !password) {
        throw new ApiError(400, "All fields are required 12");
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new ApiError(409, "User with this email already exists");
    }

    // Create user
    const user = await User.create({
        name,
        email,
        password,
    });

    // Generate tokens
    const accessToken = user.generateAuthToken();
    const refreshToken = user.generateRefreshToken();

    // Save refresh token to database
    user.refreshToken = refreshToken;
    await user.save();

    // Remove sensitive data
    const userResponse = user.toObject();
    delete userResponse.password;
    delete userResponse.refreshToken;

    // Send response with cookies
    res
        .status(201)
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", refreshToken, {
            ...cookieOptions,
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        })
        .json(
            new ApiResponse(201, {
                user: userResponse,
                accessToken,
                refreshToken,
            }, "User registered successfully")
        );
});

/**
 * Login user
 * @route POST /api/v1/auth/login
 * @access Public
 */
export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    console.log(req.body);

    // Validate input
    if (!email || !password) {
        throw new ApiError(400, "Email and password are required");
    }

    // Find user with password field
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        throw new ApiError(401, "Invalid email or password");
    }

    // Check if account is active
    if (!user.isActive) {
        throw new ApiError(403, "Your account has been deactivated");
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid email or password");
    }

    // Generate tokens
    const accessToken = user.generateAuthToken();
    const refreshToken = user.generateRefreshToken();

    // Save refresh token to database
    user.refreshToken = refreshToken;
    await user.save();

    // Remove sensitive data
    const userResponse = user.toObject();
    delete userResponse.password;
    delete userResponse.refreshToken;

    // Send response with cookies
    res
        .status(200)
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", refreshToken, {
            ...cookieOptions,
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        })
        .json(
            new ApiResponse(200, {
                user: userResponse,
                accessToken,
                refreshToken,
            }, "Login successful")
        );
});

/**
 * Logout user
 * @route POST /api/v1/auth/logout
 * @access Private
 */
export const logout = asyncHandler(async (req, res) => {
    // Clear refresh token from database
    await User.findByIdAndUpdate(req.user._id, {
        $unset: { refreshToken: 1 },
    });

    // Clear cookies
    res
        .status(200)
        .clearCookie("accessToken", cookieOptions)
        .clearCookie("refreshToken", cookieOptions)
        .json(new ApiResponse(200, null, "Logout successful"));
});

/**
 * Refresh access token
 * @route POST /api/v1/auth/refresh
 * @access Public
 */
export const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies?.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Refresh token is required");
    }

    // Verify refresh token using middleware
    const { verifyRefreshToken } = await import("../middlewares/auth.middleware.js");

    // The middleware will attach user to req
    await verifyRefreshToken(req, res, async () => {
        // Generate new access token
        const accessToken = req.user.generateAuthToken();

        // Send response
        res
            .status(200)
            .cookie("accessToken", accessToken, cookieOptions)
            .json(
                new ApiResponse(200, { accessToken }, "Access token refreshed successfully")
            );
    });
});

/**
 * Get current user profile
 * @route GET /api/v1/auth/profile
 * @access Private
 */
export const getProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    res.status(200).json(
        new ApiResponse(200, { user }, "Profile fetched successfully")
    );
});

/**
 * Update user profile
 * @route PATCH /api/v1/auth/profile
 * @access Private
 */
export const updateProfile = asyncHandler(async (req, res) => {
    const { name } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // Update fields
    if (name) user.name = name;

    await user.save();

    res.status(200).json(
        new ApiResponse(200, { user }, "Profile updated successfully")
    );
});

/**
 * Change password
 * @route PATCH /api/v1/auth/change-password
 * @access Private
 */
export const changePassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
        throw new ApiError(400, "Current password and new password are required");
    }

    if (newPassword.length < 6) {
        throw new ApiError(400, "New password must be at least 6 characters");
    }

    const user = await User.findById(req.user._id).select("+password");

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // Verify current password
    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
        throw new ApiError(401, "Current password is incorrect");
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.status(200).json(
        new ApiResponse(200, null, "Password changed successfully")
    );
});


/**
 * Get public system settings
 * @route GET /api/v1/auth/settings
 * @access Public
 */
export const getPublicSettings = asyncHandler(async (req, res) => {
    // Import dynamically to avoid circular dependency if any (though SystemSetting is model)
    const { default: SystemSetting } = await import("../models/SystemSetting.model.js");

    const settings = await SystemSetting.find({ key: "PLAN_BASED_SIGNUP" });
    // Transform to simple object
    const config = {};
    settings.forEach(s => config[s.key] = s.value);

    // Also return public razorpay key
    config.RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;

    res.status(200).json(new ApiResponse(200, config, "Public settings fetched"));
});
