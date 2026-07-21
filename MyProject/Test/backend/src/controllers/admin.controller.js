import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import User from "../models/User.model.js";
import Transaction from "../models/Transaction.model.js";
import File from "../models/File.model.js";
import Folder from "../models/Folder.model.js";
import ApiKey from "../models/ApiKey.model.js";
import SystemSetting from "../models/SystemSetting.model.js";

// --- Existing Functions (Restored) ---

export const getSystemStats = asyncHandler(async (req, res) => {
    const totalUsers = await User.countDocuments();
    const totalFiles = await File.countDocuments();

    // Aggregation for total storage used
    const storageStats = await User.aggregate([
        {
            $group: {
                _id: null,
                totalStorage: { $sum: "$storageUsed" }
            }
        }
    ]);

    const totalStorageUsed = storageStats.length > 0 ? storageStats[0].totalStorage : 0;

    res.status(200).json(
        new ApiResponse(200, {
            totalUsers,
            totalFiles,
            totalStorageUsed
        }, "System stats fetched successfully")
    );
});

export const getAllUsers = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, search = "" } = req.query;

    const query = {};
    if (search) {
        query.$or = [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } }
        ];
    }

    const users = await User.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit));

    const totalUsers = await User.countDocuments(query);
    const totalPages = Math.ceil(totalUsers / limit);

    res.status(200).json(
        new ApiResponse(200, {
            users,
            totalPages,
            currentPage: parseInt(page)
        }, "Users fetched successfully")
    );
});

export const updateUserStorageLimit = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { limit } = req.body;

    if (!limit) {
        throw new ApiError(400, "Storage limit is required");
    }

    const user = await User.findByIdAndUpdate(
        userId,
        { storageLimit: limit },
        { new: true }
    );

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    res.status(200).json(
        new ApiResponse(200, user, "Storage limit updated successfully")
    );
});

export const toggleUserStatus = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    user.isActive = !user.isActive;
    await user.save();

    res.status(200).json(
        new ApiResponse(200, user, `User ${user.isActive ? 'activated' : 'suspended'} successfully`)
    );
});

export const getUserDetails = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const folders = await Folder.find({ owner: userId }).sort({ createdAt: -1 });
    const apiKeys = await ApiKey.find({ owner: userId }).sort({ createdAt: -1 });
    const recentFiles = await File.find({ owner: userId }).sort({ createdAt: -1 }).limit(5);

    res.status(200).json(
        new ApiResponse(200, {
            user,
            folders,
            apiKeys,
            recentFiles
        }, "User details fetched successfully")
    );
});

export const updateAdminMessage = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { message } = req.body;

    const user = await User.findByIdAndUpdate(
        userId,
        { adminMessage: message },
        { new: true }
    );

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    res.status(200).json(
        new ApiResponse(200, user, "Admin message updated successfully")
    );
});

// --- New Settings Functions ---

export const toggleSignupMode = asyncHandler(async (req, res) => {
    const { enabled } = req.body; // true or false

    let setting = await SystemSetting.findOne({ key: "PLAN_BASED_SIGNUP" });

    if (!setting) {
        setting = await SystemSetting.create({
            key: "PLAN_BASED_SIGNUP",
            value: enabled,
            description: "If enabled, users must select a paid plan during signup.",
        });
    } else {
        setting.value = enabled;
        await setting.save();
    }

    return res.status(200).json(new ApiResponse(200, setting, "Signup mode updated successfully"));
});

export const getSystemSettings = asyncHandler(async (req, res) => {
    const settings = await SystemSetting.find({});
    return res.status(200).json(new ApiResponse(200, settings, "System settings fetched successfully"));
});

// --- Subscription & Revenue Management ---

export const getTransactionHistory = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, search = "" } = req.query;

    const query = {};
    if (search) {
        query.$or = [
            { razorpayOrderId: { $regex: search, $options: "i" } },
            { razorpayPaymentId: { $regex: search, $options: "i" } },
            // We'll populate User so we can't search by name directly here in a simple query without aggregate
            // For simplicity, search by transaction IDs first.
        ];
    }

    const transactions = await Transaction.find(query)
        .populate("userId", "name email") // Fetch user details
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit));

    const totalTransactions = await Transaction.countDocuments(query);
    const totalPages = Math.ceil(totalTransactions / limit);

    res.status(200).json(
        new ApiResponse(200, {
            transactions,
            totalPages,
            currentPage: parseInt(page)
        }, "Transaction history fetched successfully")
    );
});

export const getRevenueStats = asyncHandler(async (req, res) => {
    // 1. Total Income
    const totalRevenueResult = await Transaction.aggregate([
        { $match: { status: "paid" } },
        { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    const totalRevenue = totalRevenueResult.length > 0 ? totalRevenueResult[0].total : 0;

    // 2. Monthly Income (Last 6 months)
    const monthlyRevenue = await Transaction.aggregate([
        {
            $match: {
                status: "paid",
                createdAt: { $gte: new Date(new Date().setMonth(new Date().getMonth() - 6)) }
            }
        },
        {
            $group: {
                _id: { $month: "$createdAt" },
                total: { $sum: "$amount" }
            }
        },
        { $sort: { "_id": 1 } }
    ]);

    // 3. Plan Distribution
    const planDistribution = await User.aggregate([
        { $group: { _id: "$plan", count: { $sum: 1 } } }
    ]);

    res.status(200).json(
        new ApiResponse(200, {
            totalRevenue,
            monthlyRevenue,
            planDistribution
        }, "Revenue stats fetched successfully")
    );
});

export const getUserTransactions = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const transactions = await Transaction.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json(
        new ApiResponse(200, transactions, "User transaction history fetched")
    );
});
