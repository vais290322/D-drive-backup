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
        }

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
    }

});

const ServicePerforma = mongoose.model("ServicePerforma", serviceSchema);

export default ServicePerforma;