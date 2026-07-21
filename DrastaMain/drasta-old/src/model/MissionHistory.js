const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MissionHistorySchema = new Schema({
    mission: { type: String, required: true },
    research: { type: String, required: true },
    history: { type: String, required: true },
    trainingAwareness: { type: String, required: true }
}, {
    timestamps: true
});

module.exports = mongoose.model("MissionHistory", MissionHistorySchema);
