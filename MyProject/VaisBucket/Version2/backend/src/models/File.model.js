import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs";

const fileSchema = new mongoose.Schema(
    {
        originalName: {
            type: String,
            required: [true, "Original filename is required"],
            trim: true,
        },
        fileName: {
            type: String,
            required: [true, "Filename is required"],
            unique: true,
        },
        publicUrl: {
            type: String,
            required: [true, "Public URL is required"],
        },
        storagePath: {
            type: String,
            required: [true, "Storage path is required"],
        },
        mimeType: {
            type: String,
            required: [true, "MIME type is required"],
        },
        fileType: {
            type: String,
            enum: ["image", "video", "document", "other"],
            required: true,
        },
        size: {
            type: Number,
            required: [true, "File size is required"],
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "File owner is required"],
            index: true,
        },
        folder: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Folder",
            default: null,
            index: true,
        },
        visibility: {
            type: String,
            enum: ["public", "private"],
            default: "public",
        },
        downloads: {
            type: Number,
            default: 0,
        },
        views: {
            type: Number,
            default: 0,
        },
        metadata: {
            width: Number,
            height: Number,
            duration: Number,
            format: String,
        },
        tags: [String],
        description: String,
        relativePath: {
            type: String,
            required: true,
            index: true,
        },
    },
    {
        timestamps: true,
    }
);

// Indexes for better query performance
fileSchema.index({ owner: 1, createdAt: -1 });
fileSchema.index({ fileType: 1 });
fileSchema.index({ visibility: 1 });
// Compound index for efficient asset security checks
fileSchema.index({ fileName: 1, relativePath: 1 });
fileSchema.index({ fileName: 1, owner: 1 });

// Virtual field for formatted file size
fileSchema.virtual("formattedSize").get(function () {
    const bytes = this.size;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    if (bytes === 0) return "0 Bytes";
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i];
});

// Virtual field for file extension
fileSchema.virtual("extension").get(function () {
    return path.extname(this.originalName).toLowerCase();
});

// Pre-delete hook to remove physical file
fileSchema.pre("deleteOne", { document: true, query: false }, async function (next) {
    try {
        if (fs.existsSync(this.storagePath)) {
            fs.unlinkSync(this.storagePath);
            console.log(`Deleted file: ${this.storagePath}`);
        }
        next();
    } catch (error) {
        console.error(`Error deleting file: ${error.message}`);
        next(error);
    }
});

// Static method to get file type from MIME type
fileSchema.statics.getFileType = function (mimeType) {
    if (mimeType.startsWith("image/")) return "image";
    if (mimeType.startsWith("video/")) return "video";
    if (
        mimeType.includes("pdf") ||
        mimeType.includes("document") ||
        mimeType.includes("word") ||
        mimeType.includes("excel") ||
        mimeType.includes("spreadsheet") ||
        mimeType.includes("msword") ||
        mimeType.includes("ms-excel") ||
        mimeType.includes("csv")
    ) {
        return "document";
    }
    return "other";
};

// Ensure virtuals are included in JSON
fileSchema.set("toJSON", { virtuals: true });
fileSchema.set("toObject", { virtuals: true });

const File = mongoose.model("File", fileSchema);

export default File;
