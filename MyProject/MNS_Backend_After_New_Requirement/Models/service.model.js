import mongoose from "mongoose";

const serviceSchema = mongoose.Schema({

    invoiceNumber: {
        type: String,
        required: true,
        unique: true
    },
    date: {
        type: Date,
        default: new Date
    },
    taxGroup: {
        type: String,
    },

    paymentType: {
        type: String,
    },
    customerName: {
        type: String,
    },
   

    receiverDetails: {
        name: {
            type: String,
        },
        monthYear: {
            type: String,
        },
        year:{
        type:String,
        },
        
        address: {
            type: String,
        },
        phoneNumber: {
            type: String,
        },
        gstin: {
            type: String,
        },
        state: {
            type: String,
        },
        id: {
            type: String,
        },
        vendorCode:{
            type:String,
        },

    },

    priceGroup: {
        type: String,
    },
    location: {
        type: String,
    },

    items: [{
        id: { type: String, },

        description: {
            type: String,
        },
        sacCode: { type: String, },

        noOfPerson: {
            type: Number,

        },
        noOfDuites: { type:Number, },

        rate: {
            type: Number,
        },
        month: {
            type: Number,
        },
        amount: {
            type: Number,

        },
    },
    ],


    total:{
        sgst: {
            type: String
        },
        cgst: {
            type: String
        },
        igst: {
            type: String
        },
        grossAmount: { type: Number, },
        grandTotal: {
            type: Number,
            required: true
        }
    },
    paidOne:{
        type:Boolean,
        default:false,
    }

});

const Service = mongoose.model("Service", serviceSchema);

export default Service;