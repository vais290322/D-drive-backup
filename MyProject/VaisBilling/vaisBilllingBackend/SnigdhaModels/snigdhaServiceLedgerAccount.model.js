import { Schema } from "mongoose";
import mongoose from "mongoose";

const snigdhaServiceLadgerSchema = new Schema({
   invoiceId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"SnigdhaServiceInvoice",
    required:true
   },
   invoiceNumber:{
    type:String,
    required:true
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

   }],

}, { timestamps: true });

export const SngidhaServiceLedger = mongoose.model("SngidhaServiceLedger", snigdhaServiceLadgerSchema);




