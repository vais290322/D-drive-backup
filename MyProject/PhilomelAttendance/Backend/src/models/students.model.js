import mongoose,{Schema} from "mongoose";

const studentsSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    parent:{
        type:String,
        // required:true
    },
    studentId:{
        type:String,
        // required:true
    },
    phone:{
        type:Number,
        // required:true
    },
    email:{
        type:String,
        // required:true
    },
    rfid:{
        type:String,
        required:true,
        unique:true
    },
    className:{
        type:String,
        // required:true
    },
    section:{
        type:String,
        // required:true
    }

},{timestamps:true});

export const Student = mongoose.model('Student',studentsSchema)