

const CODSetting = require("../models/cod.models");
exports.updateCODStatus = async (req, res) => {
    try {
      const { status } = req.body; // true / false
  
      let setting = await CODSetting.findOne();
      if (!setting) {
        setting = new CODSetting();
      }
  
      setting.isCODEnabled = status;
      await setting.save();
  
      res.status(200).json({
        message: "COD status updated successfully",
        data: setting,
      });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  };


  exports.getCODStatus = async (req, res) => {
    try {
      const setting = await CODSetting.findOne();
  
      res.status(200).json({
        message: "fetched successfully",
        data: setting?.isCODEnabled ?? true,
      });
    } catch (err) {
      res.status(500).json({message: err.message });
    }
  };
  