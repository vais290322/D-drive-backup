import {ApiError} from "../utils/apiError.js";
import {ApiResponse} from "../utils/apiResponse.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import {Doctor} from "../models/doctors.model.js";
import { User } from "../models/user.model.js";
import getDataUri from "../utils/datauri.js";


const createDoctor = asyncHandler(async(req,res)=>{
    try {
        const {name,email,phNumber,specialization,category} = req.body;
        const profilePicture = req.file;

        // console.log(profilePicture)
        // console.log("name ",name)

        if(!name || !email || !phNumber || !specialization || !category){
            throw new ApiError(400, "Please provide all fields");
        }

        if(!profilePicture){
            throw new ApiError(400, "Please provide image");
        }

        // const authorId = req.id;
        // const user = await User.findById(authorId);
        // if(!user){
        //     throw new ApiError(404, "user not found");
        // }
        const userExist = await Doctor.findOne({email});
        if(userExist){
            throw new ApiError(409, "Doctor already exists");
        }
        let cloudinary ;
        if(profilePicture){
            const fileUri= getDataUri(profilePicture)
            // console.log(fileUri)
            cloudinary = await uploadOnCloudinary(fileUri);
            // console.log("cloudinary",cloudinary)
        }
       

        const doctor = await Doctor.create({
            name,
            email,
            phNumber,
            specialization,
            category,
            profilePicture:cloudinary.secure_url,
            
        });

        return res.json(new ApiResponse(200, doctor, "Doctor added successfully"));

    } catch (error) {
        // console.log("errror : ",error)
        res.json(
            new ApiError(
              error?.statusCode || 500,
              error?.message || "internal server error in create doctor"
            )
        )
    }
})

const updateDoctor = asyncHandler(async (req, res) => {
    try {
        const { name, email, phNumber, specialization, category } = req.body;
        const profilePicture = req.file;

        // const authorId = req.id;
        // const user = await User.findById(authorId);
        // if (!user) {
        //     throw new ApiError(404, "User not found");
        // }

        const doctor = await Doctor.findById(req.params.id);
        if (!doctor) {
            throw new ApiError(404, "Doctor not found");
        }

        let cloudinary;
        if (profilePicture) {
            const fileUri = getDataUri(profilePicture);
            cloudinary = await uploadOnCloudinary(fileUri);
        }

        // **Update only the provided fields**
        if (name) doctor.name = name;
        if (email) doctor.email = email;
        if (phNumber) doctor.phNumber = phNumber;
        if (specialization) doctor.specialization = specialization;
        if (category) doctor.category = category;
        if (cloudinary?.secure_url) doctor.profilePicture = cloudinary.secure_url;

        await doctor.save();

        return res.json(new ApiResponse(200, doctor, "Doctor updated successfully"));

    } catch (error) {
        return res.json(
            new ApiError(
                error?.statusCode || 500,
                error?.message || "Internal server error in updating doctor"
            )
        );
    }
});


const deleteDoctor = asyncHandler(async(req,res)=>{
   try {
     const {id} = req.params;
     const doctor = await Doctor.findByIdAndDelete(id);
     if(!doctor){
         throw new ApiError(404, "doctor not found");
     }
     return res.json(new ApiResponse(200, null, "doctor deleted successfully"));
   } catch (error) {
    res.json(
        new ApiError(
          error?.statusCode || 500,
          error?.message || "internal server error in delete doctor"
        )
    )
   }

})

const getdoctor = asyncHandler(async(req,res)=>{
    try {
        const doctor = await Doctor.findById(req.params.id);
        if(!doctor){
            throw new ApiError(404, "doctor not found");
        }
        return res.json(new ApiResponse(200, doctor, "doctor found successfully"));
    } catch (error) {
        res.json(
            new ApiError(
              error?.statusCode || 500,
              error?.message || "internal server error in get doctor"
            )
        )
    }
})

const getAllDoctors = asyncHandler(async(req,res)=>{
    try {
        const doctors = await Doctor.find();
        if(!doctors){
            throw new ApiError(404, "doctors not found");
        }
        return res.json(new ApiResponse(200, doctors, "doctors found successfully"));
    } catch (error) {
        res.json(
            new ApiError(
              error?.statusCode || 500,
              error?.message || "internal server error in get all doctors"
            )
        )
    }
})

export {createDoctor,updateDoctor,deleteDoctor,getdoctor,getAllDoctors}