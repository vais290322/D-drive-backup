const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SuperAdvisorSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    image: {
        type: String,
        required: true,
    },
    qualification: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model("SuperAdvisor", SuperAdvisorSchema);
