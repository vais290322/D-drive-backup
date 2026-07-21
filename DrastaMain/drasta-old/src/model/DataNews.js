const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DataNewsSchema = new Schema({
    title: {
        type: String,
        
    },
    content: {
        type: String,
        required: true
    },
    image: {
        type: String,
        
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('DataNews', DataNewsSchema, 'dataNews');