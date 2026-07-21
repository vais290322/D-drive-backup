import mongoose, { Schema } from 'mongoose';

const teacherSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        // required: true
    },
    phone: {
        type: Number,
        // required: true
    },
    employeeId: {
        type: String,
        unique: true
    },
    subjects: {
        type: String,
        default: ''
    },
    rfid: {
        type: String,
        required: true,
        unique: true
    }
}, {
    timestamps: true
});

export const Teacher = mongoose.model('Teacher', teacherSchema);