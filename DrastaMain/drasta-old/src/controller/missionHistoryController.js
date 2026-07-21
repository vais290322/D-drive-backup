const MissionHistory = require("../model/MissionHistory");

// Create or update the singleton document
const upsertMissionHistory = async (req, res) => {
    try {
        const { mission, research, history, trainingAwareness } = req.body;
        let doc = await MissionHistory.findOne();
        if (doc) {
            doc.mission = mission;
            doc.research = research;
            doc.history = history;
            doc.trainingAwareness = trainingAwareness;
            await doc.save();
            return res.status(200).json({ success: true, missionHistory: doc, message: "Updated successfully" });
        } else {
            doc = await MissionHistory.create({ mission, research, history, trainingAwareness });
            return res.status(201).json({ success: true, missionHistory: doc, message: "Created successfully" });
        }
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Get the singleton document
const getMissionHistory = async (req, res) => {
    try {
        const doc = await MissionHistory.findOne();
        if (!doc) {
            return res.status(404).json({ success: false, message: "No MissionHistory found" });
        }
        res.status(200).json({ success: true, missionHistory: doc });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete the singleton document
const deleteMissionHistory = async (req, res) => {
    try {
        const doc = await MissionHistory.findOneAndDelete();
        if (!doc) {
            return res.status(404).json({ success: false, message: "No MissionHistory found" });
        }
        res.status(200).json({ success: true, message: "MissionHistory deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    upsertMissionHistory,
    getMissionHistory,
    deleteMissionHistory
};