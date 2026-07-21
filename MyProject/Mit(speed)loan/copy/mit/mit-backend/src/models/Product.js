const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    product_code: { type: String, unique: true, required: true },
    category: {
        type: String,
        enum: ['mobile', 'laptop', 'tv', 'vehicle', 'others'],
        required: true
    },
    brand: { type: String },
    model: { type: String },
    serial_number: { type: String },
    imei_1: { type: String },
    imei_2: { type: String },
    color: { type: String },
    ram_rom: { type: String },
    purchase_price: { type: Number },
    invoice_url: { type: String },
    photo_url: { type: String },
    status: {
        type: String,
        enum: ['available', 'assigned', 'sold'],
        default: 'available'
    },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile' },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

// Auto-update updated_at on save
ProductSchema.pre('save', function (next) {
    this.updated_at = new Date();
    next();
});


ProductSchema.set('toJSON', {
    transform: function (doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
    }
});


module.exports = mongoose.model('Product', ProductSchema);
