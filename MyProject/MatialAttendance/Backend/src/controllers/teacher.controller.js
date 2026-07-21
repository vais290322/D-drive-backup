import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Teacher } from "../models/teacher.model.js";
import { Student } from "../models/students.model.js";


// Get all teachers
const getAllTeachers = asyncHandler(async (req, res) => {
    const teachers = await Teacher.find().sort({ createdAt: -1 });
    
    return res.status(200).json(
        new ApiResponse(200, teachers, "Teachers retrieved successfully")
    );
});

// Get a single teacher by ID
const getTeacherById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    const teacher = await Teacher.findById(id);
    
    if (!teacher) {
        throw new ApiError(404, "Teacher not found");
    }
    
    return res.status(200).json(
        new ApiResponse(200, teacher, "Teacher retrieved successfully")
    );
});

// Create a new teacher
const createTeacher = asyncHandler(async (req, res) => {
    const { name, email, phone, employeeId, subjects, rfid } = req.body;
    
    // Validate required fields
    if (!name || !rfid) {
        throw new ApiError(400, "Name and RFID are required");
    }
    
    // Check if RFID already exists
    const existingRfid = await Teacher.findOne({ rfid });
    if (existingRfid) {
        throw new ApiError(400, "RFID already registered to another teacher");
    }

    const existingStudent = await Student.findOne({ rfid });
    if (existingStudent) {
        throw new ApiError(400, "RFID already registered to another student");
    }
    
    // Create new teacher
    const teacher = await Teacher.create({
        name,
        email,
        phone,
        employeeId,
        subjects,
        rfid
    });
    
    return res.status(201).json(
        new ApiResponse(201, teacher, "Teacher registered successfully")
    );
});

// Update a teacher
const updateTeacher = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, email, phone, employeeId, subjects, rfid } = req.body;
    
    const teacher = await Teacher.findById(id);
    
    if (!teacher) {
        throw new ApiError(404, "Teacher not found");
    }
    
    // Check if updating RFID and it already exists for another teacher
    if (rfid && rfid !== teacher.rfid) {
        const existingRfid = await Teacher.findOne({ rfid, _id: { $ne: id } });
        if (existingRfid) {
            throw new ApiError(400, "RFID already registered to another teacher");
        }
    }

    const existingStudent = await Student.findOne({ rfid });
    if (existingStudent) {
        throw new ApiError(400, "RFID already registered to another student");
    }
    
    // Update teacher fields
    teacher.name = name || teacher.name;
    teacher.email = email || teacher.email;
    teacher.phone = phone || teacher.phone;
    teacher.employeeId = employeeId || teacher.employeeId;
    teacher.subjects = subjects || teacher.subjects;
    teacher.rfid = rfid || teacher.rfid;
    
    await teacher.save();
    
    return res.status(200).json(
        new ApiResponse(200, teacher, "Teacher updated successfully")
    );
});

// Delete a teacher
const deleteTeacher = asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    const teacher = await Teacher.findByIdAndDelete(id);
    
    if (!teacher) {
        throw new ApiError(404, "Teacher not found");
    }
    
    return res.status(200).json(
        new ApiResponse(200, {}, "Teacher deleted successfully")
    );
});

export {
    getAllTeachers,
    getTeacherById,
    createTeacher,
    updateTeacher,
    deleteTeacher
};