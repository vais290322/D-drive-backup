import Folder from "../models/Folder.model.js";
import File from "../models/File.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/**
 * Create a new folder
 * @route POST /api/v1/folders
 */
export const createFolder = asyncHandler(async (req, res) => {
    const { name, parentFolder = null } = req.body;

    if (!name) {
        throw new ApiError(400, "Folder name is required");
    }

    // Check if folder with same name exists in the same parent
    const existingFolder = await Folder.findOne({
        name,
        parentFolder,
        owner: req.user._id,
    });

    if (existingFolder) {
        throw new ApiError(400, "Folder with this name already exists in this directory");
    }

    let path = [];
    if (parentFolder) {
        const parent = await Folder.findById(parentFolder);
        if (!parent) {
            throw new ApiError(404, "Parent folder not found");
        }
        path = [...parent.path, { _id: parent._id, name: parent.name }];
    }

    const folder = await Folder.create({
        name,
        parentFolder,
        owner: req.user._id,
        path,
    });

    res.status(201).json(new ApiResponse(201, folder, "Folder created successfully"));
});

/**
 * Get folders and files in a directory
 * @route GET /api/v1/folders
 */
export const getDirectoryContents = asyncHandler(async (req, res) => {
    const { parentFolder = null, all = false } = req.query;

    if (all === "true" || all === true) {
        const folders = await Folder.find({ owner: req.user._id }).sort({ name: 1 });
        return res.status(200).json(
            new ApiResponse(200, { folders }, "All folders fetched successfully")
        );
    }

    const folders = await Folder.find({
        owner: req.user._id,
        parentFolder: parentFolder === "null" ? null : parentFolder,
    }).sort({ name: 1 });

    const files = await File.find({
        owner: req.user._id,
        folder: parentFolder === "null" ? null : parentFolder,
    }).sort({ createdAt: -1 });

    let currentFolder = null;
    if (parentFolder && parentFolder !== "null") {
        currentFolder = await Folder.findById(parentFolder);
    }

    res.status(200).json(
        new ApiResponse(200, { folders, files, currentFolder }, "Directory contents fetched successfully")
    );
});

/**
 * Rename folder
 * @route PATCH /api/v1/folders/:id
 */
export const renameFolder = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
        throw new ApiError(400, "Folder name is required");
    }

    const folder = await Folder.findOne({ _id: id, owner: req.user._id });
    if (!folder) {
        throw new ApiError(404, "Folder not found");
    }

    // Check if name already exists in current parent
    const existing = await Folder.findOne({
        name,
        parentFolder: folder.parentFolder,
        owner: req.user._id,
        _id: { $ne: id },
    });

    if (existing) {
        throw new ApiError(400, "Another folder with this name already exists");
    }

    folder.name = name;
    await folder.save();

    res.status(200).json(new ApiResponse(200, folder, "Folder renamed successfully"));
});

/**
 * Delete folder (and optionally its contents)
 * @route DELETE /api/v1/folders/:id
 */
export const deleteFolder = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const folder = await Folder.findOne({ _id: id, owner: req.user._id });
    if (!folder) {
        throw new ApiError(404, "Folder not found");
    }

    // For now, only allow deleting empty folders or implement recursive delete logic
    const hasSubfolders = await Folder.exists({ parentFolder: id });
    const hasFiles = await File.exists({ folder: id });

    if (hasSubfolders || hasFiles) {
        throw new ApiError(400, "Folder is not empty. Please delete all contents first.");
    }

    await folder.deleteOne();

    res.status(200).json(new ApiResponse(200, null, "Folder deleted successfully"));
});
