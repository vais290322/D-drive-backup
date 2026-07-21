import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import {TeacherLateTime} from "../models/teacherLateTime.model.js"



// Get all teacherLateTimes
const getAllTeacherLateTimes = asyncHandler(async (req, res) => {
    const teacherLateTimes = await TeacherLateTime.find().sort({ createdAt: -1 });
    // console.log("teacherLateTimes : ", teacherLateTimes)
    return res.status(200).json(
        new ApiResponse(200, teacherLateTimes, "teacherLateTimes retrieved successfully")
    );
});

const createTeacherLateTime = asyncHandler(async (req, res) => {
    const { lateTime } = req.body;

    if (!lateTime) {
        throw new ApiError(400, "lateTime is required");
    }

    // Check if lateTime already exists
    const existingLateTime = await TeacherLateTime.find();
    if (existingLateTime.length > 0) {
        throw new ApiError(400, "lateTime already exists you can update it");
    }
    
    const teacherLateTime = await TeacherLateTime.create({
        lateTime
    });
    
    return res.status(201).json(
        new ApiResponse(201, teacherLateTime, "teacherLateTime created successfully")
    );  
});

const updateTeacherLateTime = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { lateTime } = req.body;
    
    const teacherLateTime = await TeacherLateTime.findById(id);
    
    if (!teacherLateTime) {
        throw new ApiError(404, "teacherLateTime not found");
    }
    
    if (!lateTime) {
        throw new ApiError(400, "lateTime is required");
    }
    
    teacherLateTime.lateTime = lateTime;
    
    await teacherLateTime.save();
    
    return res.status(200).json(
        new ApiResponse(200, teacherLateTime, "teacherLateTime updated successfully")
    );
});

const deleteTeacherLateTime = asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    const teacherLateTime = await TeacherLateTime.findByIdAndDelete(id);
    
    if (!teacherLateTime) {
        throw new ApiError(404, "teacherLateTime not found");
    }
    
    return res.status(200).json(
        new ApiResponse(200, {}, "teacherLateTime deleted successfully")
    );
});

export {
    getAllTeacherLateTimes,
    createTeacherLateTime,
    updateTeacherLateTime,
    deleteTeacherLateTime
};