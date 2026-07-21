const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const InternSchema = new Schema({
    name: { type: String, required: true },
    details: { type: String, required: true },
    image: { type: String, required: true },
    public_id: { type: String, required: true }
});

const YearSchema = new Schema({
    year: { type: String, required: true },
    interns: [InternSchema]
}, { _id: false });

const VisitorAndInternSchema = new Schema({
    years: [YearSchema]
}, {
    timestamps: true
});

module.exports = mongoose.model("VisitorAndIntern", VisitorAndInternSchema);