const mongoose = require('mongoose');

const LabelSchema = new mongoose.Schema({
    name: { type: String, required: true },
    color: { type: String, default: '#6c47ff' }, // hex color
}, { _id: false });

const ContactSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        chatId: { type: String, required: true },   // e.g. "919876543210@c.us"
        contactPhone: { type: String, default: null },
        displayName: { type: String, default: null },    // user-editable override
        waName: { type: String, default: null },    // from WhatsApp pushname
        about: { type: String, default: null },    // WhatsApp "About" / status
        profilePicUrl: { type: String, default: null },    // cached profile picture URL
        isGroup: { type: Boolean, default: false },
        labels: { type: [LabelSchema], default: [] },
        notes: { type: String, default: '' },      // free-form notes
        lastFetched: { type: Date, default: null },      // last time WA profile was synced
    },
    { timestamps: true }
);

// Unique per user+chat
ContactSchema.index({ userId: 1, chatId: 1 }, { unique: true });

module.exports = mongoose.model('Contact', ContactSchema);
