const mongoose = require('mongoose');

const InboxMessageSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
        chatId: { type: String, required: true, index: true },
        contactName: { type: String, default: null },
        contactPhone: { type: String, default: null },
        body: { type: String, default: '' },
        direction: { type: String, enum: ['sent', 'received'], required: true },
        waMessageId: { type: String, default: null, index: true },
        timestamp: { type: Date, default: Date.now },
        isGroup: { type: Boolean, default: false },

        // ── Media fields ───────────────────────────────────────────
        hasMedia: { type: Boolean, default: false },
        mediaType: { type: String, default: null },   // 'image' | 'video' | 'audio' | 'document' | 'sticker' | 'ptt'
        mediaUrl: { type: String, default: null },     // public path, e.g. /uploads/media/userId/abc.jpg
        mimeType: { type: String, default: null },
        caption: { type: String, default: null },
        fileName: { type: String, default: null },     // for documents
    },
    { timestamps: true }
);

InboxMessageSchema.index({ userId: 1, chatId: 1, timestamp: 1 });

module.exports = mongoose.model('InboxMessage', InboxMessageSchema);
