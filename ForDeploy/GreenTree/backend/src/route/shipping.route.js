const express = require("express");
const router = express.Router();
const {
  createShipping,
  // getAllShipping,
  getShippingById,
  updateShipping,
  deleteShipping,
} = require("../controller/shipping.controller");
const { authenticate, authorize } = require("../middleware/authorization");

// Create shipping record
router.post("/shipping", authenticate, authorize(["admin","staff"]), createShipping);

// Get all shipping records
// router.get("/shippingbyid/:id", authenticate, authorize(["user"]), getAllShipping);

// Get shipping by ID
router.get("/shipping/:id", authenticate, authorize(["admin", "user" , "staff"]), getShippingById);

// Update shipping record
router.put("/shipping/:id", authenticate, authorize(["admin","staff"]), updateShipping);

// Delete shipping record
router.delete("/shipping/:id", authenticate, authorize(["admin","staff"]), deleteShipping);

module.exports = router;