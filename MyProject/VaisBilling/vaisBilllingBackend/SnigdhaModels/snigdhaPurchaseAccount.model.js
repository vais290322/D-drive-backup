import { Schema } from "mongoose";
import mongoose from "mongoose";

const snigdhaPurchaseAccountSchema = new Schema({
   invoiceId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"SnigdhaPurchaseOrderNew",
    required:true
   },
   invoiceNumber:{
    type:String,
    required:true
   },

   vendorName: {
    type: String,
    required: true,
   },

   totalAmount:{
    type:Number,
    required:true
   },

   dueAmount:{ 
    type:Number,
    
   },

   totalPaidAmount:{
    type:Number,
    default:0,
   },

   isPaid:{
    type:Boolean,
    default:false,
   },
   
   paymentDetails:[{
    paymentDate:{
        type:String,
        required:true
    }, 
    paymentAmount:{
        type:Number,
        required:true
    },
    paymentMode:{
        type:String,
        required:true 
    },
    transactionId:{
        type:String,
        required:true
    },
    bankId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"SnigdhaBank",
        required:true 
    }

   }],

}, { timestamps: true });

const SnigdhaPurchaseAccount = mongoose.model("SnigdhaPurchaseAccount", snigdhaPurchaseAccountSchema);

export default SnigdhaPurchaseAccount;