/**
 * User Model (MongoDB/Mongoose)
 */

import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        index: true,
    },
    full_name: {
        type: String,
        trim: true,
    },
    phone: {
        type: String,
        trim: true,
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'hotelier'],
        default: 'user',
        index: true,
    },
    avatar_url: {
        type: String,
    },
    email_verified: {
        type: Boolean,
        default: false,
    },
    phone_verified: {
        type: Boolean,
        default: false,
    },
    last_login: {
        type: Date,
    },
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    },
});

// Hash password before saving
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Compare password method
UserSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
UserSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.password;
    return obj;
};

export const User = mongoose.model('User', UserSchema);
