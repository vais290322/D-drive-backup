import mongoose from "mongoose";

const studentMarkSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  roll: {
    type: String,
    required: true
  },
  mark: {
    type: Number,
    required: true,
    min: 0
  },
  projectMark: {
    type: Number,
    default: 0,
    min: 0
  }
}, { _id: false });

const marksSchema = new mongoose.Schema({
  schoolId: {
    type: String,
    required: true
  },
  className: {
    type: String,
    required: true
  },
  section: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  examType: {
    type: String,
    required: true
  },

  fullMarks: {
    type: Number,
    required: true
  },
  subjectFullMark: {
    type: Number,
    required: true
  },
  projectFullMark: {
    type: Number,
    default: 0,
  },

  teacherName: {
    type: String,
  },
  userRole: {
    type: String,
  },

  marks: {
    type: [studentMarkSchema],
    validate: [arr => arr.length > 0, "At least one student required"]
  }

}, { timestamps: true });

export default mongoose.model("Marks", marksSchema);