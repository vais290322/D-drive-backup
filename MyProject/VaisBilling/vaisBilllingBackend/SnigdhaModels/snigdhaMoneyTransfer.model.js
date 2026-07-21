import mongoose from "mongoose";

const snigdhaMoneyTransferSchema = new mongoose.Schema({
    date:{
        type:Date,
        required:true
    },
    transferFromBankId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'SnigdhaBank',
        required:true
    },
    transferToBankId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'SnigdhaBank',
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

const SnigdhaMoneyTransfer = mongoose.model('SnigdhaMoneyTransfer', snigdhaMoneyTransferSchema);
export default SnigdhaMoneyTransfer;