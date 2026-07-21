import mongoose from "mongoose";
const groupSchema = new mongoose.Schema({
    groupName: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        
    },
    
}, { timestamps: true });

const GroupName = mongoose.model('GroupName', groupSchema);
export default GroupName;

