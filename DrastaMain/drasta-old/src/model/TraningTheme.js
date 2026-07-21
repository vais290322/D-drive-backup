const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TraningThemeSchema = new Schema({
    content: { type: String, required: true },
    image: { type: String, required: true },    
    public_id: { type: String, required: true },
}, {
    timestamps: true
});

module.exports = mongoose.model("TraningTheme", TraningThemeSchema);
