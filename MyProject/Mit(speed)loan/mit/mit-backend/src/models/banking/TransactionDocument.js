const mongoose = require('mongoose');

const TransactionDocumentSchema = new mongoose.Schema({
    transaction_id: { type: mongoose.Schema.Types.ObjectId, ref: 'BankTransaction', required: true },
    file_name: { type: String, required: true },
    file_url: { type: String, required: true },
    file_type: { type: String },
    file_size: { type: Number },
    uploaded_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('TransactionDocument', TransactionDocumentSchema);
