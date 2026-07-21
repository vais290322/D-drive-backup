import mongoose,{Schema} from "mongoose";

const SubCategoriesSchema = new Schema({
    name:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true
    },
    categoryId:{
        type:Schema.Types.ObjectId,
        ref:"Categories",
        required:true
    },
    schoolId:{
        type:String,
        required:true
    }
},{timestamps:true})

const SubCategoriesModel = mongoose.model("SubCategories", SubCategoriesSchema);

export default SubCategoriesModel;
