const express = require("express");
const {
    upsertMissionHistory,
    getMissionHistory,
    deleteMissionHistory
} = require("../controller/missionHistoryController");

const router = express.Router();

router.get("/", getMissionHistory);
router.post("/", upsertMissionHistory);   // Create or update
router.put("/", upsertMissionHistory);    // Update (same as create for singleton)
router.delete("/", deleteMissionHistory);

module.exports = router;