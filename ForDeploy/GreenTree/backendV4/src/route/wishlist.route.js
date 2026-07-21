const express = require("express");
const router = express.Router();
const {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
  getadminWishlist
} = require("../controller/wishlist.controller");
const {authenticate, authorize} = require('../middleware/authorization.js');

// Add product to wishlist
router.post("/addwishlist",authenticate,authorize(["user"]), addToWishlist);

// Get wishlist by user
router.get("/getwishlist",authenticate,authorize(["user"]), getWishlist);

router.get("/getadminwishlist",authenticate,authorize(["admin","staff"]), getadminWishlist);

// Remove specific product from wishlist
router.delete("/deletewishlist/:id",authenticate,authorize(["user"]), removeFromWishlist);


module.exports = router;
