const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    contact_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Contact' },
    company_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
    deal_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Deal' },
    title: { type: String, required: true },
    description: { type: String },
    due_date: { type: Date },
    priority: { type: String, default: 'medium' },
    status: { type: String, default: 'pending' },
    completed_at: { type: Date },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

TaskSchema.pre('save', function (next) {
    this.updated_at = new Date();
    next();
});

module.exports = mongoose.model('Task', TaskSchema);
