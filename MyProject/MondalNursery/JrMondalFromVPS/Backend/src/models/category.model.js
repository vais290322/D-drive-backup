import mongoose, {Schema} from "mongoose";

const category= new Schema({

    name:{
        type:String,
        required:true,
        trim: true,
        unique: true,
    }
    
},{timestamps:true})

export const categoryModel=mongoose.model("category",category)