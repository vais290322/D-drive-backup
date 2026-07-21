import User from "../models/User.model.js";
import File from "../models/File.model.js";
import ApiKey from "../models/ApiKey.model.js";
import Folder from "../models/Folder.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/**
 * Get system-wide statistics
 * @route GET /api/v1/admin/stats
 */
export const getSystemStats = asyncHandler(async (req, res) => {
    const [totalUsers, totalFiles, storageData] = await Promise.all([
        User.countDocuments({ role: "user" }),
        File.countDocuments(),
        User.aggregate([
            { $group: { _id: null, totalUsed: { $sum: "$storageUsed" } } }
        ])
    ]);

    const stats = {
        totalUsers,
        totalFiles,
        totalStorageUsed: storageData[0]?.totalUsed || 0,
    };

    res.status(200).json(new ApiResponse(200, stats, "System stats fetched successfully"));
});

/**
 * Get all users with pagination
 * @route GET /api/v1/admin/users
 */
export const getAllUsers = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, search = "" } = req.query;

    const query = {
        role: "user",
        $or: [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
        ],
    };

    const users = await User.find(query)
        .select("-refreshToken")
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();

    const count = await User.countDocuments(query);

    res.status(200).json(new ApiResponse(200, {
        users,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        totalUsers: count
    }, "Users fetched successfully"));
});

/**
 * Update user storage limit
 * @route PATCH /api/v1/admin/users/:userId/limit
 */
export const updateUserStorageLimit = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { limit } = req.body;

    if (!limit || limit <= 0) {
        throw new ApiError(400, "Invalid storage limit");
    }

    const user = await User.findByIdAndUpdate(
        userId,
        { storageLimit: limit },
        { new: true }
    ).select("-refreshToken");

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    res.status(200).json(new ApiResponse(200, user, "Storage limit updated successfully"));
});

/**
 * Toggle user account status (Active/Inactive)
 * @route PATCH /api/v1/admin/users/:userId/status
 */
export const toggleUserStatus = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    user.isActive = !user.isActive;
    await user.save();

    res.status(200).json(new ApiResponse(200, user, `User account ${user.isActive ? 'activated' : 'deactivated'} successfully`));
});

/**
 * Get detailed user information
 * @route GET /api/v1/admin/users/:userId
 */
export const getUserDetails = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    const [user, apiKeys, folders, recentFiles] = await Promise.all([
        User.findById(userId).select("-refreshToken"),
        ApiKey.find({ owner: userId }),
        Folder.find({ owner: userId }).sort({ name: 1 }),
        File.find({ owner: userId }).sort({ createdAt: -1 }).limit(10)
    ]);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    res.status(200).json(new ApiResponse(200, {
        user,
        apiKeys,
        folders,
        recentFiles
    }, "User details fetched successfully"));
});

/**
 * Update message for user (shown on their dashboard)
 * @route PATCH /api/v1/admin/users/:userId/message
 */
export const updateAdminMessage = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { message } = req.body;

    const user = await User.findByIdAndUpdate(
        userId,
        { adminMessage: message },
        { new: true }
    ).select("-refreshToken");

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    res.status(200).json(new ApiResponse(200, user, "Admin message updated successfully"));
});
