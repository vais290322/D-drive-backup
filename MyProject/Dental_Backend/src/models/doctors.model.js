import mongoose,{Schema} from "mongoose";

const doctorSchema= new Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    phNumber:{
        type:String,
        required:true
    },
    profilePicture:{
        type:String,
        required:true,
        default:""
    },
    specialization:{
        type:String,
        required:true,
        default:""
    },
    category:{
        type:String,
        required:true,
        default:""
        
    },
   
},{timestamps:true})

export const Doctor = mongoose.model('Doctor',doctorSchema)