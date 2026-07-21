import mongoose, { Schema } from "mongoose";

const CategoriesSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    description: {
        type: String,

    },
    schoolId: {
        type: String,
        required: true
    },


}, { timestamps: true })

export default mongoose.model("Categories", CategoriesSchema);
