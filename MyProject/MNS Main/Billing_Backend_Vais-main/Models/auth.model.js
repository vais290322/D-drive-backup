import { Schema } from "mongoose";
import mongoose from "mongoose";

const authSchema = new Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
    },
    password: {
        type: String,
        required: [true, "Password is required"] 
    },
    email: {
        type: String,
        unique: true,
        required: [true, "Email is required"]
    },
    role: {
        type: String,
        required: [true, "Role is required"],
        enum: ["admin", "user", "crm", "hrm", "billing","operation","mnsBilling","snigdhaBilling","executive"],
        default: "user"
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date
}, { timestamps: true });

export const Auth = mongoose.model("Auth", authSchema);
