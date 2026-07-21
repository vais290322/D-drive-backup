import mongoose from "mongoose";
import crypto from "crypto";
import bcrypt from "bcryptjs";

const apiKeySchema = new mongoose.Schema(
    {
        key: {
            type: String,
            required: true,
            unique: true,
            select: false, // Don't include in queries by default
        },
        name: {
            type: String,
            required: [true, "API key name is required"],
            trim: true,
            maxlength: [100, "Name cannot exceed 100 characters"],
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "API key owner is required"],
            index: true,
        },
        permissions: {
            type: [String],
            enum: ["upload", "read", "delete", "all"],
            default: ["upload", "read", "delete"],
        },
        usageCount: {
            type: Number,
            default: 0,
        },
        usageLimit: {
            type: Number,
            default: 10000, // 10k requests per key
        },
        rateLimit: {
            type: Number,
            default: 100, // requests per 15 minutes
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        expiresAt: {
            type: Date,
            default: null, // null means no expiration
        },
        lastUsedAt: {
            type: Date,
        },
        prefix: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

// Index for faster lookups
apiKeySchema.index({ owner: 1, isActive: 1 });
apiKeySchema.index({ prefix: 1 });

// Static method to generate a new API key
apiKeySchema.statics.generateKey = function () {
    // Generate a random 32-byte key and convert to hex
    const key = crypto.randomBytes(32).toString("hex");
    const prefix = "fup_" + crypto.randomBytes(4).toString("hex"); // fup = File Upload
    return { key: `${prefix}_${key}`, prefix };
};

// Method to hash the API key
apiKeySchema.methods.hashKey = async function (key) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(key, salt);
};

// Static method to validate API key
apiKeySchema.statics.validateKey = async function (providedKey) {
    try {
        // Extract prefix from provided key
        const prefix = providedKey.split("_").slice(0, 2).join("_");

        // Find API key by prefix
        const apiKey = await this.findOne({ prefix, isActive: true }).select("+key");

        if (!apiKey) {
            return null;
        }

        // Check expiration
        if (apiKey.expiresAt && apiKey.expiresAt < new Date()) {
            return null;
        }

        // Check usage limit
        if (apiKey.usageCount >= apiKey.usageLimit) {
            return null;
        }

        // Compare keys
        const isValid = await bcrypt.compare(providedKey, apiKey.key);

        if (!isValid) {
            return null;
        }

        return apiKey;
    } catch (error) {
        console.error("API key validation error:", error);
        return null;
    }
};

// Method to increment usage count
apiKeySchema.methods.incrementUsage = async function () {
    this.usageCount += 1;
    this.lastUsedAt = new Date();
    await this.save();
};

// Virtual field for usage percentage
apiKeySchema.virtual("usagePercentage").get(function () {
    return ((this.usageCount / this.usageLimit) * 100).toFixed(2);
});

// Virtual field for remaining requests
apiKeySchema.virtual("remainingRequests").get(function () {
    return Math.max(0, this.usageLimit - this.usageCount);
});

// Virtual field for masked key (show only prefix)
apiKeySchema.virtual("maskedKey").get(function () {
    return `${this.prefix}_${"*".repeat(64)}`;
});

// Ensure virtuals are included in JSON
apiKeySchema.set("toJSON", { virtuals: true });
apiKeySchema.set("toObject", { virtuals: true });

const ApiKey = mongoose.model("ApiKey", apiKeySchema);

export default ApiKey;
