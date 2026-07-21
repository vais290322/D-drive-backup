import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
    companyName: {
        type: String,
        required: [true, "Company name is required"],
        trim: true
    },
    companyAddress: {
        type: String,
        required: [true, "Company address is required"]
    },
    panNo: {
        type: String,
        required: [true, "PAN number is required"],
        unique: true
    },
    GST_IN: {
        type: String,
        required: [true, "GST number is required"],
        unique: true
    },
    ph_no: {
        type: String,
        required: [true, "Phone number is required"],
        unique: true,
        match: [/^\d{10}$/, "Phone number must be 10 digits"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, "Invalid email format"]
    }
}, { timestamps: true });

const Company = mongoose.model("Company", companySchema);

export default Company;