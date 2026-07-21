import File from "../models/File.model.js";
import User from "../models/User.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
    getFileType,
    generatePublicUrl,
    deleteFileFromDisk,
    getImageMetadata,
    checkStorageQuota,
    updateUserStorage,
} from "../utils/fileHelper.js";
import { generateCompleteSignedUrl } from "../utils/signedUrl.js";
import { validateFileMagicBytes } from "../middlewares/multer.middleware.js";
import path from "path";
import fs from "fs";

/**
 * Upload file (multipart/form-data)
 * @route POST /api/v1/files/upload
 * @access Private (JWT or API Key)
 */
export const uploadFile = asyncHandler(async (req, res) => {
    // Check if file was uploaded
    if (!req.file) {
        throw new ApiError(400, "No file uploaded");
    }

    const { visibility = "public", description, tags, folderId = null } = req.body;

    // ENTERPRISE-GRADE SECURITY: Validate file using magic bytes
    // This prevents spoofed extensions (e.g., shell.php.jpg)
    const validation = await validateFileMagicBytes(req.file.path);
    if (!validation.valid) {
        // Delete the malicious/invalid file
        deleteFileFromDisk(req.file.path);
        throw new ApiError(400, validation.error || "Invalid file type detected");
    }

    // Check storage quota
    const hasQuota = checkStorageQuota(req.user, req.file.size);
    if (!hasQuota) {
        // Delete uploaded file
        deleteFileFromDisk(req.file.path);
        throw new ApiError(
            403,
            "Storage quota exceeded. Please upgrade your plan or delete some files."
        );
    }

    // Determine file type
    const fileType = getFileType(req.file.mimetype);

    // Generate public URL with hierarchical path
    const publicUrl = generatePublicUrl(req.file.filename, req, req.userUploadPath);

    // Get image metadata if it's an image
    let metadata = {};
    if (fileType === "image") {
        const imgMetadata = await getImageMetadata(req.file.path);
        if (imgMetadata) {
            metadata = imgMetadata;
        }
    }

    // Parse tags if provided
    let parsedTags = [];
    if (tags) {
        parsedTags = typeof tags === "string" ? tags.split(",").map(t => t.trim()) : tags;
    }

    // Create file record in database
    const file = await File.create({
        originalName: req.file.originalname,
        fileName: req.file.filename,
        publicUrl,
        storagePath: req.file.path,
        mimeType: req.file.mimetype,
        fileType,
        size: req.file.size,
        owner: req.user._id,
        folder: folderId === "null" ? null : folderId,
        visibility,
        description,
        tags: parsedTags,
        metadata,
        relativePath: req.userUploadPath,
    });

    // Update user storage
    await updateUserStorage(req.user, req.file.size, "add");

    // Prepare response
    const response = {
        fileId: file._id,
        fileName: file.originalName,
        fileUrl: file.publicUrl,
        fileType: file.fileType,
        mimeType: file.mimeType,
        size: file.size,
        formattedSize: file.formattedSize,
        visibility: file.visibility,
        uploadedAt: file.createdAt,
        metadata: file.metadata,
    };

    res.status(201).json(
        new ApiResponse(201, response, "File uploaded successfully")
    );
});

/**
 * Upload file from base64
 * @route POST /api/v1/files/upload-base64
 * @access Private (JWT or API Key)
 */
export const uploadBase64 = asyncHandler(async (req, res) => {
    const { base64Data, fileName, mimeType, visibility = "public", description, tags, folderId = null } = req.body;

    // Validate input
    if (!base64Data || !fileName || !mimeType) {
        throw new ApiError(400, "base64Data, fileName, and mimeType are required");
    }

    // Decode base64
    const base64String = base64Data.replace(/^data:.*?;base64,/, "");
    const buffer = Buffer.from(base64String, "base64");
    const fileSize = buffer.length;

    // Check storage quota
    const hasQuota = checkStorageQuota(req.user, fileSize);
    if (!hasQuota) {
        throw new ApiError(
            403,
            "Storage quota exceeded. Please upgrade your plan or delete some files."
        );
    }

    // Generate unique filename
    const { v4: uuidv4 } = await import("uuid");
    const ext = path.extname(fileName);
    const nameWithoutExt = path.basename(fileName, ext);
    const sanitizedName = nameWithoutExt.replace(/[^a-zA-Z0-9]/g, "_");
    const uniqueFilename = `${Date.now()}-${uuidv4()}-${sanitizedName}${ext}`;

    // Generate hierarchical path structure
    const { generateUserFilePath, ensureDirectoryExists } = await import("../utils/fileHelper.js");
    const relativePath = generateUserFilePath(req.user._id);
    const baseUploadDir = process.env.UPLOAD_DIR || "./uploads";
    const fullDir = path.join(baseUploadDir, relativePath);

    // Ensure directory exists
    ensureDirectoryExists(fullDir);

    // Save file to hierarchical path
    const filePath = path.join(fullDir, uniqueFilename);
    fs.writeFileSync(filePath, buffer);

    // ENTERPRISE-GRADE SECURITY: Validate file using magic bytes
    // This prevents spoofed extensions and MIME types in base64 uploads
    const validation = await validateFileMagicBytes(filePath);
    if (!validation.valid) {
        // Delete the malicious/invalid file
        deleteFileFromDisk(filePath);
        throw new ApiError(400, validation.error || "Invalid file type detected");
    }

    // Determine file type
    const fileType = getFileType(mimeType);

    // Generate public URL with hierarchical path
    const publicUrl = generatePublicUrl(uniqueFilename, req, relativePath);

    // Get image metadata if it's an image
    let metadata = {};
    if (fileType === "image") {
        const imgMetadata = await getImageMetadata(filePath);
        if (imgMetadata) {
            metadata = imgMetadata;
        }
    }

    // Parse tags if provided
    let parsedTags = [];
    if (tags) {
        parsedTags = typeof tags === "string" ? tags.split(",").map(t => t.trim()) : tags;
    }

    // Create file record in database
    const file = await File.create({
        originalName: fileName,
        fileName: uniqueFilename,
        publicUrl,
        storagePath: filePath,
        mimeType,
        fileType,
        size: fileSize,
        owner: req.user._id,
        folder: folderId === "null" ? null : folderId,
        visibility,
        description,
        tags: parsedTags,
        metadata,
        relativePath,
    });

    // Update user storage
    await updateUserStorage(req.user, fileSize, "add");

    // Prepare response
    const response = {
        fileId: file._id,
        fileName: file.originalName,
        fileUrl: file.publicUrl,
        fileType: file.fileType,
        mimeType: file.mimeType,
        size: file.size,
        formattedSize: file.formattedSize,
        visibility: file.visibility,
        uploadedAt: file.createdAt,
        metadata: file.metadata,
    };

    res.status(201).json(
        new ApiResponse(201, response, "File uploaded successfully from base64")
    );
});

/**
 * Get all files for authenticated user
 * @route GET /api/v1/files
 * @access Private
 */
export const getMyFiles = asyncHandler(async (req, res) => {
    const {
        page = 1,
        limit = 20,
        fileType,
        visibility,
        sortBy = "createdAt",
        order = "desc",
        search,
        folderId,
    } = req.query;

    // Build query
    const query = { owner: req.user._id };

    if (folderId !== undefined) {
        query.folder = folderId === "null" ? null : folderId;
    }

    if (fileType) {
        query.fileType = fileType;
    }

    if (visibility) {
        query.visibility = visibility;
    }

    if (search) {
        query.$or = [
            { originalName: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
            { tags: { $in: [new RegExp(search, "i")] } },
        ];
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOrder = order === "desc" ? -1 : 1;

    // Get files
    const files = await File.find(query)
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(parseInt(limit));

    // Get total count
    const total = await File.countDocuments(query);

    // Prepare response
    const response = {
        files,
        pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / parseInt(limit)),
            totalFiles: total,
            filesPerPage: parseInt(limit),
        },
    };

    res.status(200).json(
        new ApiResponse(200, response, "Files fetched successfully")
    );
});

/**
 * Get file by ID
 * @route GET /api/v1/files/:id
 * @access Private
 */
export const getFileById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const file = await File.findById(id).populate("owner", "name email");

    if (!file) {
        throw new ApiError(404, "File not found");
    }

    // Check if user has access to this file
    if (file.visibility === "private" && file.owner._id.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You don't have access to this file");
    }

    // Increment view count
    file.views += 1;
    await file.save();

    res.status(200).json(
        new ApiResponse(200, { file }, "File fetched successfully")
    );
});

/**
 * Delete file
 * @route DELETE /api/v1/files/:id
 * @access Private
 */
export const deleteFile = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const file = await File.findById(id);

    if (!file) {
        throw new ApiError(404, "File not found");
    }

    // Check if user owns this file
    if (file.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You don't have permission to delete this file");
    }

    // Delete physical file
    deleteFileFromDisk(file.storagePath);

    // Update user storage
    await updateUserStorage(req.user, file.size, "subtract");

    // Delete from database
    await file.deleteOne();

    res.status(200).json(
        new ApiResponse(200, null, "File deleted successfully")
    );
});

/**
 * Download file
 * @route GET /api/v1/files/:id/download
 * @access Private
 */
export const downloadFile = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const file = await File.findById(id);

    if (!file) {
        throw new ApiError(404, "File not found");
    }

    // Check if user has access to this file
    if (file.visibility === "private" && file.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You don't have access to this file");
    }

    // Check if file exists on disk
    if (!fs.existsSync(file.storagePath)) {
        throw new ApiError(404, "File not found on server");
    }

    // Increment download count
    file.downloads += 1;
    await file.save();

    // Send file
    res.download(file.storagePath, file.originalName);
});

/**
 * Generate signed URL for private file
 * @route POST /api/v1/files/:id/signed-url
 * @access Private
 */
export const generateSignedUrlForFile = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { expiresIn = 3600 } = req.body; // Default 1 hour

    const file = await File.findById(id);

    if (!file) {
        throw new ApiError(404, "File not found");
    }

    // Check if user owns this file
    if (file.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You don't have permission to generate signed URL for this file");
    }

    // Generate signed URL
    const signedUrl = generateCompleteSignedUrl(id, req, parseInt(expiresIn));

    res.status(200).json(
        new ApiResponse(200, {
            signedUrl,
            expiresIn: parseInt(expiresIn),
            expiresAt: new Date(Date.now() + parseInt(expiresIn) * 1000),
        }, "Signed URL generated successfully")
    );
});

/**
 * Access file with signed URL
 * @route GET /api/v1/files/:id/access
 * @access Public (with valid token)
 */
export const accessFileWithSignedUrl = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { token } = req.query;

    if (!token) {
        throw new ApiError(400, "Token is required");
    }

    // Verify token
    const { verifySignedUrl } = await import("../utils/signedUrl.js");
    const decoded = verifySignedUrl(token);

    if (!decoded || decoded.fileId !== id) {
        throw new ApiError(401, "Invalid or expired token");
    }

    // Get file
    const file = await File.findById(id);

    if (!file) {
        throw new ApiError(404, "File not found");
    }

    // Check if file exists on disk
    if (!fs.existsSync(file.storagePath)) {
        throw new ApiError(404, "File not found on server");
    }

    // Increment view count
    file.views += 1;
    await file.save();

    // Send file
    res.sendFile(path.resolve(file.storagePath));
});

/**
 * Get file statistics
 * @route GET /api/v1/files/stats
 * @access Private
 */
export const getFileStats = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    // Get total files
    const totalFiles = await File.countDocuments({ owner: userId });

    // Get files by type
    const filesByType = await File.aggregate([
        { $match: { owner: userId } },
        { $group: { _id: "$fileType", count: { $sum: 1 }, totalSize: { $sum: "$size" } } },
    ]);

    // Get total downloads and views
    const stats = await File.aggregate([
        { $match: { owner: userId } },
        {
            $group: {
                _id: null,
                totalDownloads: { $sum: "$downloads" },
                totalViews: { $sum: "$views" },
                totalSize: { $sum: "$size" },
            },
        },
    ]);

    // Get recent files
    const recentFiles = await File.find({ owner: userId })
        .sort({ createdAt: -1 })
        .limit(5)
        .select("originalName fileType size createdAt publicUrl");

    // Get user storage info
    const user = await User.findById(userId);

    const response = {
        totalFiles,
        filesByType,
        totalDownloads: stats[0]?.totalDownloads || 0,
        totalViews: stats[0]?.totalViews || 0,
        storageUsed: user.storageUsed,
        storageLimit: user.storageLimit,
        storagePercentage: user.storagePercentage,
        availableStorage: user.availableStorage,
        recentFiles,
    };

    res.status(200).json(
        new ApiResponse(200, response, "Statistics fetched successfully")
    );
});

/**
 * Update file metadata
 * @route PATCH /api/v1/files/:id
 * @access Private
 */
export const updateFile = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { visibility, description, tags } = req.body;

    const file = await File.findById(id);

    if (!file) {
        throw new ApiError(404, "File not found");
    }

    // Check if user owns this file
    if (file.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You don't have permission to update this file");
    }

    // Update fields
    if (visibility) file.visibility = visibility;
    if (description !== undefined) file.description = description;
    if (tags) {
        file.tags = typeof tags === "string" ? tags.split(",").map(t => t.trim()) : tags;
    }

    await file.save();

    res.status(200).json(
        new ApiResponse(200, { file }, "File updated successfully")
    );
});
