const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ResearchThemeSchema = new Schema({
    contentHeader: { type: String, required: true },
    image: { type: String, required: true },
    contentFooter: { type: String, required: true },
    public_id: { type: String, required: true },
    
}, {
    timestamps: true
});

module.exports = mongoose.model("ResearchTheme", ResearchThemeSchema);