const mongoose = require('mongoose');
require('dotenv').config();
const Loan = require('../src/models/Loan');

async function run() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/mitelectroworld');
        console.log('Connected');

        const result = await Loan.updateMany(
            {},
            { $unset: { qr_code_url: "", razorpay_qr_id: "" } }
        );

        console.log('Cleared QRs for loans:', result.modifiedCount);
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
run();
