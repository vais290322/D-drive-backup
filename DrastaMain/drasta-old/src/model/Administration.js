const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AdministrationSchema = new Schema({
    name: { type: String, required: true },
    image: { type: String, required: true },
    position: { type: String, required: true },
    description: { type: String, required: true },
    public_id: { type: String, required: true }
}, {
    timestamps: true
});

module.exports = mongoose.model("Administration", AdministrationSchema);