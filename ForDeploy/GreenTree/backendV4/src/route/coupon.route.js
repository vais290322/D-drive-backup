const express = require("express");
const router = express.Router();
const {
  createCoupon,
  getCoupons,
  applyCoupon,
  updateCoupon,
  deleteCoupon,
} = require("../controller/coupon.controller");
const {authenticate, authorize} = require('../middleware/authorization.js');
// Create coupon (Admin)
router.post("/addcoupon",authenticate,authorize(["admin","staff"]), createCoupon);
router.get("/getcoupon",authenticate,authorize(["admin","staff"]), getCoupons);
router.put("/updatecoupon/:id",authenticate,authorize(["admin","staff"]), updateCoupon);
router.delete("/deletecoupon/:id",authenticate,authorize(["admin","staff"]), deleteCoupon);



// Apply coupon (User)
router.post("/apply",authenticate,authorize(["user"]) ,applyCoupon);



module.exports = router;
