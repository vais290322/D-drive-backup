
import BankAccountDetails from "../Models/bank.model.js";

// Add Bank Details function
const AddBankAccountDetails = async (req, res) => {
    try {
        const { bankName, accountNumber, accountHolderName, ifscCode, branchName } = req.body;

        // Input validation
        if (!accountHolderName || !accountNumber || !accountHolderName || !bankName || !ifscCode || !branchName) {
            return res.status(404).json({ success: false, message: "Fill All Fields" });
        }
        const bank = new BankAccountDetails({
            accountHolderName, 
            accountNumber, 
            branchName, 
            ifscCode, 
            bankName 
        });

        await bank.save();
        return res.status(201).json({ success: true, message: "Bank Details Added Successfully", data: bank });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// Update Bank Details function
const UpdateBankAccountDetails = async (req, res) => {
    try {
        const { bankId } = req.params; // Extract bankId from URL
        const { bankName, accountNumber, accountHolderName, ifscCode, branchName } = req.body;

        // Input validation
        // if (!accountHolderName || !accountNumber || !bankName || !ifscCode || !branchName) {
        //     return res.status(400).json({ success: false, message: "Fill All Fields" });
        // }

        // Update the bank details
        const update = await BankAccountDetails.findByIdAndUpdate(
            bankId,  // Corrected: Use bankId from params
            { accountHolderName, accountNumber, branchName, ifscCode, bankName },
            { new: true, runValidators: true }
        );

        if (!update) {
            return res.status(404).json({ success: false, message: "Bank Details Not Found" });
        }

        return res.status(200).json({ success: true, message: "Bank Details Updated Successfully", data: update });

    } catch (err) {
        console.error("UpdateBankAccountDetails Error:", err);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};


// Get Bank Details function
const getBankAccountDetails = async (req, res) => {
    try {
        const BankAccountDetailsData = await BankAccountDetails.find();
        if (!BankAccountDetailsData || BankAccountDetailsData.length === 0) {
            return res.status(404).json({ success: false, message: "No Bank Details Found" });
        }
        res.status(200).json({ success: true, message: "Bank Details Retrieved Successfully", data: BankAccountDetailsData });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// Exporting the functions using ES6 export syntax
export { AddBankAccountDetails, UpdateBankAccountDetails, getBankAccountDetails };
