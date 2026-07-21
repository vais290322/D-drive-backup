import mongoose from 'mongoose';



const connectDb = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error from mongodb : ${error.message}`);
    }
}

export default connectDb;
