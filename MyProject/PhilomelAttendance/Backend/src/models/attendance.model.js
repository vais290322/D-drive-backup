import mongoose, { Schema } from "mongoose";

const attendanceSchema = new Schema({
    student: {
        type: Schema.Types.ObjectId,
        ref: "Student",
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

// Create a compound index for student and date to ensure uniqueness
attendanceSchema.index({ student: 1, date: 1 }, { unique: true });

// Remove the pre-save middleware and add a static method
attendanceSchema.statics.processAutoCheckout = async function() {
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
        midnightCheckout.setHours(17, 0, 0, 0);

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

export const Attendance = mongoose.model('Attendance', attendanceSchema);