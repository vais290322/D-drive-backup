import mongoose from "mongoose";
const bankAccountSchema = new mongoose.Schema({
    bankName: {
        type: String,
        required: true
    },
    accountNumber: {
        type: String,
        required: true
    },
    accountHolderName: {
        type: String,
        required: true
    },
    ifscCode: {
        type: String,
        required: true
    },
    branchName: {
        type: String,
        required: true
    }
}, { timestamps: true });

const BankAccountDetails = mongoose.model('BankAccountDetails', bankAccountSchema);
export default BankAccountDetails;

