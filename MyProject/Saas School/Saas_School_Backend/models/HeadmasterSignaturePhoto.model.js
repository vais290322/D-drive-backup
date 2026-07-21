import mongoose , {Schema} from 'mongoose';


const HeadmasterSignaturePhotoSchema = new Schema({
    schoolId: {
        type: String,
        required: true
    },
    photo: {
        fileUrl:{
            type: String,
            required: true
        },
        fileId:{
            type: String,
            required: true
        }
    }
}, {timestamps: true});

export default mongoose.model('HeadmasterSignaturePhoto', HeadmasterSignaturePhotoSchema);
