import mongoose from "mongoose";

const teacherLateTimeSchema = new mongoose.Schema({
    lateTime: {
        type: String,
        default: "00:00:00",
        required: true
        // format: "HH:mm:ss"
    }
}, {
    timestamps: true
})

export const TeacherLateTime = mongoose.model("TeacherLateTime", teacherLateTimeSchema);