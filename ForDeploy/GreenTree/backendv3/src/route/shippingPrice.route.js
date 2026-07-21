const express = require("express");
const router = express.Router();
const {
    createShippingPrice,
    updateShippingPrice,
    getShippingPrice,
    deleteShippingPrice,
    getShippingPricebypin
} = require("../controller/shippingprice.controller");
const { authenticate, authorize } = require("../middleware/authorization");

// Set or update shipping price for a pin code
router.post("/shippingprice",authenticate, authorize(["admin","staff"]), createShippingPrice);

router.put("/shippingprice/:id",authenticate, authorize(["admin","staff"]), updateShippingPrice);

router.get("/usershippingprice",authenticate, authorize(["user"]), getShippingPricebypin);

router.get("/shippingprice",authenticate, authorize(["admin","staff"]), getShippingPrice);

router.delete("/shippingprice/:id",authenticate, authorize(["admin","staff"]), deleteShippingPrice);



module.exports = router;