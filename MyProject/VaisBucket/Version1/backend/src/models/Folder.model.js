import mongoose from "mongoose";

const folderSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Folder name is required"],
            trim: true,
            maxlength: [100, "Folder name cannot exceed 100 characters"],
        },
        parentFolder: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Folder",
            default: null, // null means it's in the root
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Folder owner is required"],
            index: true,
        },
        // For efficient hierarchy querying or breadcrumbs
        path: [
            {
                _id: { type: mongoose.Schema.Types.ObjectId, ref: "Folder" },
                name: String,
            }
        ],
    },
    {
        timestamps: true,
    }
);

// Indexes for faster lookups
folderSchema.index({ owner: 1, parentFolder: 1 });
folderSchema.index({ owner: 1, name: 1, parentFolder: 1 }, { unique: true });

const Folder = mongoose.model("Folder", folderSchema);

export default Folder;
