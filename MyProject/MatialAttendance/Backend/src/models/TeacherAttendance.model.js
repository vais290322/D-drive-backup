import mongoose, { Schema } from "mongoose";

const teacherAttendanceSchema = new Schema({
    teacher: {
        type: Schema.Types.ObjectId,
        ref: "Teacher",
        required: true
    },
    name: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now,
        required: true
    },
    checkIn: {
        type: Date,
        default: null
    },
    checkOut: {
        type: Date,
        default: null
    },
    totalHours: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ["present", "absent", "partial"],
        default: "absent"
    },
    isLate:{
        type:Boolean,
        default:false
    }
    
}, { timestamps: true });

// Create a compound index for teacher and date to ensure uniqueness
teacherAttendanceSchema.index({ teacher: 1, date: 1 }, { unique: true });

// Remove the pre-save middleware and add a static method
teacherAttendanceSchema.statics.processAutoCheckout = async function() {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find all records from yesterday that have check-in but no check-out
    const incompleteRecords = await this.find({
        date: {
            $gte: yesterday,
            $lt: today
        },
        checkIn: { $ne: null },
        checkOut: null
    });

    // Process each incomplete record
    for (const record of incompleteRecords) {
        const midnightCheckout = new Date(record.date);
        midnightCheckout.setHours(23, 59, 59, 999);

        record.checkOut = midnightCheckout;
        record.totalHours = calculateTotalHours(record.checkIn, record.checkOut);
        record.status = "present";
        await record.save();
    }
};

// Helper function to calculate total hours
const calculateTotalHours = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return 0;
    const diffMs = checkOut - checkIn;
    const diffHrs = diffMs / (1000 * 60 * 60);
    return parseFloat(diffHrs.toFixed(2));
};

export const TeacherAttendance = mongoose.model('TeacherAttendance', teacherAttendanceSchema);
