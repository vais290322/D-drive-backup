import moongoose, { Schema } from 'mongoose'

const snigdhaGrnSchema = new Schema({
    grnNumber: {
        type: String,
        required: true,
        unique: true,
    },
    invoiceNumber: {
        type: String,
    },

    date: {
        type: String,
        default: new Date
    },
    vendorName: {
        type: String,
    },
    damageItems: [{
        item_id: {
            type: String,
            required: true,
        },
        itemName: {
            type: String,
            required: true,
        },
        hsnCode: {
            type: String,
        },
        uom: {
            type: String,
        },
        group: {
            type: String,
        },
        unitPrice: {
            type: Number,
            required: true,
        },
        orderQty: {
            type: Number,
        },

        damageQty: {
            type: Number,
        },
        acceptedQty: {
            type: Number,
        },
        totalAmount: {
            type: Number,
        },
        damageAmount: {
            type: Number,

        },
        acceptedAmount: {
            type: Number,
        },
        damageReason: {
            type: String,
        },
        discountRate:Number,
        taxRate:Number,
    }],

    totals: {
        totalInvoiceValue: {
            type: Number,
        },
        totalDamageQty: {
            type: Number,
        },
        totalDamageAmount: {
            type: Number,
        },
        totalAcceptedAmount: {
            type: Number,
        }

    }

}, {
    timestamps: true
});


export default moongoose.model('SnigdhaGrn', snigdhaGrnSchema)
