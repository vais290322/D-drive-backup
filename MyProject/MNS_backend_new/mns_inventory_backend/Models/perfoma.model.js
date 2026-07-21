import mongoose from 'mongoose';

const perfomaSchema = new mongoose.Schema({
    
    date:{
        type: String,
        default: new Date,
        // required: true
    },
    taxGroup: {
        type: String,
        // required: true
    },
    invoiceNumber: {
        type: String,
        required: true
    },
    priceGroup: {
        type: String,
    },
    location: {
        type: String,
    },
    paymentType: {
        type: String,
        required: true
    },
    items: [{
       
        itemName: {
            type: String,
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        unit: {
            type: String,
            required: true
        },
        hsnCode: {
            type: String,
            required: true
        },
        cgst: {
            type: Number,
            required: true
        },
        sgst: {
            type: Number,
            required: true
        },
        igst: {
            type: Number,
            required: true
        },
        unitPrice: {
            type: Number,
            required: true
        },
        grossAmount: {
            type: Number,
            required: true
        },
        discountRate: {
            type: Number,
            required: true
        },
        discountAmount: {
            type: Number,
            required: true
        },
        netAmount: {
            type: Number,
            required: true
        },
        taxRate: {
            type: Number,
            required: true
        },
        taxAmount: {
            type: Number,
            required: true
        },
        amount: {
            type: Number,
            required: true
        },
        sellingPrice:{
            type: Number,

        }

    }],
    discount: {
        type: Number,
        required: true
    },
    taxableAmount: {
        type: Number,
        required: true
    },
    taxAmount: {
        type: Number,
        required: true
    },
    grandTotal: {
        type: Number,
        required: true
    },
    receiverDetails: {
        id: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        address: {
            type: String,
            // required: true
        },
        phoneNumber: {
            type: String,
            required: true
        },
        gstin: {
            type: String,
            // required: true
        },
        state: {
            type: String,
            // required: true
        }
    }
});

export default mongoose.model('Perfoma', perfomaSchema);
