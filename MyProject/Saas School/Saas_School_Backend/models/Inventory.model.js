import mongoose, { Schema } from "mongoose";

const InventorySchema = new Schema({
    name:{type:String, required:true},
    code:{type:String, required:true, unique:true},
    schoolId:{type:String, required:true},
    categoryId:{type:Schema.Types.ObjectId, ref:"Categories"},
    category:{type:String, required:true},
    subCategoryId:{type:Schema.Types.ObjectId, ref:"SubCategories"},
    subCategory:{type:String, },
    unit:{type:String, required:true},
    stock:{type:Number, required:true, default:0},
    price:{type:Number, required:true, default:0},
    sellPrice:{type:Number, default:0},
    totalPrice:{type:Number, default:0},
    totalPurchaseStock:{type:Number, default:0},
    totalSellStock:{type:Number, default:0},
},{timestamps:true})

const InventoryModel = mongoose.model("Inventory", InventorySchema);

export default InventoryModel;


