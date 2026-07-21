import mongoose from "mongoose";


const connectDB= async ()=>{
    try {
        const connectionInstace= await mongoose.connect(`${process.env.MONGODB_URI}/philomelattendance`);
        console.log(`\n MongoDb connected ! DB HOST: ${connectionInstace.connection.host}`);
    } catch (error) {
        console.log("MONGODB connection error", error);
        process.exit(1);
    }
}


export default connectDB;