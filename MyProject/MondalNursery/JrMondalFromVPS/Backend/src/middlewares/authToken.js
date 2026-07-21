import jwt from "jsonwebtoken"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/apiError.js"
import { ApiResponse } from "../utils/apiResponse.js"
import express from "express"
 const authToken=asyncHandler(async(req,res,next)=>{
     try {
        const token=req.cookies?.token || req.headers?.authorization?.split(" ")[1] || req.body?.token || req.query?.token
        console.log(token + " token");
        if(!token){
            throw new ApiError(401,"Please Login First ")
        }

        jwt.verify(token,process.env.TOKEN_SECRET_KEY,(err,decoded)=>{
            
            if(err){
                console.log("invalid token",err);
            }
            req.userId=decoded?._id
            next();
        })
     } catch (error) {
       res.status(400).json({
           success:false,
           message:error.message || error,
           data:[],
           error:true       
       }) 
     }
 })

 
export {authToken};