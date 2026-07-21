const mongoose = require('mongoose');

const EmiPaymentSchema = new mongoose.Schema({
    loan_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Loan', required: true },
    payment_date: { type: Date, required: true },
    amount_paid: { type: Number, required: true },
    payment_mode: {
        type: String,
        // enum: ['cash', 'upi', 'bank_transfer'],
        required: true
    },
    transaction_reference: { type: String },
    collected_by: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile' },
    remarks: { type: String },
    merchant_order_id: { type: String },
    created_at: { type: Date, default: Date.now }
}); 

// EmiPaymentSchema.set('toJSON', {
//     transform: function (doc, ret) {
//         ret.id = ret._id.toString();
//         // Handle both ObjectId and populated loan object
//         if (ret.loan_id) {
//             if (typeof ret.loan_id === 'object' && ret.loan_id._id) {
//                 // If populated, extract the _id
//                 ret.loan_id = ret.loan_id._id.toString();
//             } else if (ret.loan_id.toString) {
//                 // If ObjectId, convert to string
//                 ret.loan_id = ret.loan_id.toString();
//             }
//         }
//         delete ret._id;
//         delete ret.__v;
//         return ret;
//     }
// });

EmiPaymentSchema.set('toJSON', {
    transform: function (doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
    }
});


module.exports = mongoose.model('EmiPayment', EmiPaymentSchema);
