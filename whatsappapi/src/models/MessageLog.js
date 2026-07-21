const mongoose = require('mongoose');

const MessageLogSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
        to: { type: String, required: true },            // recipient phone
        body: { type: String, required: true },          // final message body after variable fill
        mode: {
            type: String,
            enum: ['custom', 'template', 'bulk', 'api'],
            default: 'custom',
        },
        templateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Template', default: null },
        templateName: { type: String, default: null },
        status: {
            type: String,
            enum: ['sent', 'failed'],
            required: true,
        },
        error: { type: String, default: null },          // error message if failed
        source: {
            type: String,
            enum: ['dashboard', 'api'],
            default: 'dashboard',
        },
    },
    { timestamps: true }
);

// Index for quick user history lookups
MessageLogSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('MessageLog', MessageLogSchema);
