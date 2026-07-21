import mongoose from "mongoose";

const moneyTransferSchema = new mongoose.Schema({

    date:{
        type:Date,
        required:true
    },
    transferFromBankId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Bank',
        required:true
    },
    transferToBankId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Bank',
        required:true  
    },
    transferAmount:{
        type:Number,
        required:true
    },
    transferNote:{
        type:String,
        required:true
    },
    transferBy:{
        type:String,
        required:true
    },
    

 
 
}, { timestamps: true });

const MoneyTransfer = mongoose.model('MoneyTransfer', moneyTransferSchema);
export default MoneyTransfer;

