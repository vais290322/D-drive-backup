import mongoose from "mongoose";


const connectDB= async ()=>{
    console.log("MONGODB_URI", process.env.MONGODB_URI);
    try {
        const connectionInstace= await mongoose.connect(`${process.env.MONGODB_URI}`, );
        console.log(`\n MongoDb connected ! DB HOST: ${connectionInstace.connection.host}`);
    } catch (error) {
        console.log("MONGODB connection error", error);
        process.exit(1);
    }
}


export default connectDB;