import mongoose, { Schema } from 'mongoose';

const studentLateTimeSchema = new Schema({
    lateTime: {
        type: String,
        default: "00:00:00",
        required: true
        // format: "HH:mm:ss"
    }
}, {
    timestamps: true
})

export const StudentLateTime = mongoose.model("StudentLateTime", studentLateTimeSchema); 