import ApiKey from "../models/ApiKey.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/**
 * Create new API key
 * @route POST /api/v1/api-keys
 * @access Private (JWT only)
 */
export const createApiKey = asyncHandler(async (req, res) => {
    const { name, permissions = ["upload", "read", "delete"], usageLimit, expiresIn } = req.body;

    // Validate input
    if (!name) {
        throw new ApiError(400, "API key name is required");
    }

    // Check if user already has 10 active API keys (limit)
    const activeKeysCount = await ApiKey.countDocuments({
        owner: req.user._id,
        isActive: true,
    });

    if (activeKeysCount >= 10) {
        throw new ApiError(
            400,
            "Maximum API key limit reached (10). Please revoke some keys before creating new ones."
        );
    }

    // Generate API key
    const { key, prefix } = ApiKey.generateKey();

    // Create API key instance
    const apiKey = new ApiKey({
        name,
        owner: req.user._id,
        permissions,
        prefix,
        usageLimit: usageLimit || 10000,
    });

    // Hash the key
    apiKey.key = await apiKey.hashKey(key);

    // Set expiration if provided
    if (expiresIn) {
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + parseInt(expiresIn));
        apiKey.expiresAt = expirationDate;
    }

    // Save to database
    await apiKey.save();

    // Prepare response (include the plain key only once)
    const response = {
        apiKey: key, // Plain key - show only once
        keyId: apiKey._id,
        name: apiKey.name,
        prefix: apiKey.prefix,
        permissions: apiKey.permissions,
        usageLimit: apiKey.usageLimit,
        expiresAt: apiKey.expiresAt,
        createdAt: apiKey.createdAt,
        warning: "Please save this API key securely. You won't be able to see it again!",
    };

    res.status(201).json(
        new ApiResponse(201, response, "API key created successfully")
    );
});

/**
 * Get all API keys for authenticated user
 * @route GET /api/v1/api-keys
 * @access Private (JWT only)
 */
export const getMyApiKeys = asyncHandler(async (req, res) => {
    const apiKeys = await ApiKey.find({ owner: req.user._id }).select("-key");

    // Add masked key to each
    const keysWithMasked = apiKeys.map((key) => ({
        ...key.toObject(),
        maskedKey: key.maskedKey,
    }));

    res.status(200).json(
        new ApiResponse(200, { apiKeys: keysWithMasked }, "API keys fetched successfully")
    );
});

/**
 * Get API key by ID
 * @route GET /api/v1/api-keys/:id
 * @access Private (JWT only)
 */
export const getApiKeyById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const apiKey = await ApiKey.findById(id).select("-key");

    if (!apiKey) {
        throw new ApiError(404, "API key not found");
    }

    // Check if user owns this API key
    if (apiKey.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You don't have permission to access this API key");
    }

    res.status(200).json(
        new ApiResponse(200, { apiKey }, "API key fetched successfully")
    );
});

/**
 * Revoke (deactivate) API key
 * @route DELETE /api/v1/api-keys/:id
 * @access Private (JWT only)
 */
export const revokeApiKey = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const apiKey = await ApiKey.findById(id);

    if (!apiKey) {
        throw new ApiError(404, "API key not found");
    }

    // Check if user owns this API key
    if (apiKey.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You don't have permission to revoke this API key");
    }

    // Deactivate the key
    apiKey.isActive = false;
    await apiKey.save();

    res.status(200).json(
        new ApiResponse(200, null, "API key revoked successfully")
    );
});

/**
 * Delete API key permanently
 * @route DELETE /api/v1/api-keys/:id/permanent
 * @access Private (JWT only)
 */
export const deleteApiKey = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const apiKey = await ApiKey.findById(id);

    if (!apiKey) {
        throw new ApiError(404, "API key not found");
    }

    // Check if user owns this API key
    if (apiKey.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You don't have permission to delete this API key");
    }

    // Delete permanently
    await apiKey.deleteOne();

    res.status(200).json(
        new ApiResponse(200, null, "API key deleted permanently")
    );
});

/**
 * Get API key usage statistics
 * @route GET /api/v1/api-keys/:id/stats
 * @access Private (JWT only)
 */
export const getApiKeyStats = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const apiKey = await ApiKey.findById(id).select("-key");

    if (!apiKey) {
        throw new ApiError(404, "API key not found");
    }

    // Check if user owns this API key
    if (apiKey.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You don't have permission to access this API key");
    }

    const stats = {
        name: apiKey.name,
        usageCount: apiKey.usageCount,
        usageLimit: apiKey.usageLimit,
        usagePercentage: apiKey.usagePercentage,
        remainingRequests: apiKey.remainingRequests,
        lastUsedAt: apiKey.lastUsedAt,
        isActive: apiKey.isActive,
        expiresAt: apiKey.expiresAt,
        createdAt: apiKey.createdAt,
    };

    res.status(200).json(
        new ApiResponse(200, stats, "API key statistics fetched successfully")
    );
});

/**
 * Update API key
 * @route PATCH /api/v1/api-keys/:id
 * @access Private (JWT only)
 */
export const updateApiKey = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, permissions, usageLimit } = req.body;

    const apiKey = await ApiKey.findById(id);

    if (!apiKey) {
        throw new ApiError(404, "API key not found");
    }

    // Check if user owns this API key
    if (apiKey.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You don't have permission to update this API key");
    }

    // Update fields
    if (name) apiKey.name = name;
    if (permissions) apiKey.permissions = permissions;
    if (usageLimit) apiKey.usageLimit = usageLimit;

    await apiKey.save();

    res.status(200).json(
        new ApiResponse(200, { apiKey }, "API key updated successfully")
    );
});
