import mongoose from "mongoose";

const resultPublishDateSchema = new mongoose.Schema({
    className: {
        type: String,
        required: true
    },
    examType: {
        type: String,
        required: true
    },
    resultPublishDate: {
        type: Date,
        required: true
    },
    schoolId: {
        type: String,
        required: true
    }
}, { timestamps: true });

const ResultPublishDate = mongoose.model('ResultPublishDate', resultPublishDateSchema);

export default ResultPublishDate;