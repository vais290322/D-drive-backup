const mongoose = require('mongoose');

const profitAndLossSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    product_type: {
        type: String,
        enum: ['Mobile', 'Laptop', 'TV', 'Vehicle', 'Others'],
        default: 'Others'
    },
    brand: {
        type: String,
        trim: true
    },
    product_details: {
        type: String,
        trim: true
    },
    lead_given_by: {
        type: String,
        trim: true
    },
    on_bill_amount: {
        type: Number,
        default: 0
    },
    booster_amount: {
        type: Number,
        default: 0
    },
    cn_amount: {
        type: Number,
        default: 0
    },
    other_amount: {
        type: Number,
        default: 0
    },
    gift_amount: {
        type: Number,
        default: 0
    },
    ref_bonus: {
        type: Number,
        default: 0
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for Total Income
profitAndLossSchema.virtual('total_income').get(function () {
    return (this.on_bill_amount || 0) +
        (this.booster_amount || 0) +
        (this.cn_amount || 0) +
        (this.other_amount || 0);
});

// Virtual for Net Profit
profitAndLossSchema.virtual('net_profit').get(function () {
    const totalIncome = (this.on_bill_amount || 0) +
        (this.booster_amount || 0) +
        (this.cn_amount || 0) +
        (this.other_amount || 0);
    return totalIncome - (this.gift_amount || 0) - (this.ref_bonus || 0);
});

module.exports = mongoose.model('ProfitAndLoss', profitAndLossSchema);
