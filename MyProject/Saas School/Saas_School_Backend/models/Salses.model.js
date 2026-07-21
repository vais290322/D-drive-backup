import mongoose, { Schema } from "mongoose";

const itemSchema = new Schema({
  name: { type: String, required: true, trim: true },
  description:{type:String},
  code:{type:String, required:true},
  categoryId: { type: Schema.Types.ObjectId, ref:"Categories", required: true },
  subCategoryId: { type: Schema.Types.ObjectId, ref:"SubCategories", },
  category: { type: String, required: true },
  subCategory: { type: String, },
  unit: { type: String, required: true },
  quantity: { type: Number, required: true, min: 0 },
  price: { type: Number, required: true, min: 0 },
  sellPrice:{type:Number, required:true},
  totalPrice: { type: Number, required: true, min: 0 },
});

const SalesSchema = new Schema({
    schoolId:{type:String, required:true},
    invoiceNumber:{type:String, required:true, unique:true},
    date:{type:Date, required:true, default:Date.now},
    studentName:{type:String, required:true},
    admissionNumber:{type:String,},
    studentPhone:{type:String},
    studentAddress:{type:String},
    className:{type:String, },
    section:{type:String, },
    rollNumber:{type:String, },
    items:{
        type:[itemSchema],
        required:true,
        validate:[
            (val)=>val.length>0,
            "At least one item is required"
        ]
    },
    grossAmount:{type:Number, required:true},
    discount:{type:Number, required:true},
    netAmount:{type:Number, required:true},
    roundOff:{type:Number, required:true},
    totalAmount:{type:Number, required:true},
    paymentMethod:{
        type:String,
        // required:true,
        trim:true,
        enum:["Cash", "Card", "Online", "Bank Transfer", "Cheque", "Other"],
        default:"Cash"
    },

    cardDetails:{
        cardNo:{type:String},
        cardHolderName:{type:String},
        authCode:{type:String},
    },

    chequeDetails:{
        chequeNo:{type:String},
        bankName:{type:String},
        branchName:{type:String},
        accountHolderName:{type:String},
    },

    onlineDetails:{
        transactionId:{type:String},
        transactionDate:{type:Date},
    },

    createdBy:{
        name:{type:String},
        email:{type:String},
        role:{type:String}
    },


},{timestamps:true})

const SalesModel = mongoose.model("Sales", SalesSchema);

export default SalesModel;