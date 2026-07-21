const express = require("express");
const router = express.Router();
const {
  createOrder,
  getAdminAllOrders,
  getUserAllOrders,
  getOrderByIduser,
  updateOrderStatus,
  admincreateOrder,
  trackOrderDelivery,
  getAllOrders,
  cancelOrderAndRefund
  
} = require("../controller/order.controller");
const {authenticate, authorize} = require('../middleware/authorization.js');


router.get("/track/:id", authenticate, authorize(["user","admin","staff"]), trackOrderDelivery);

// Create new order
router.post("/addorder",authenticate,authorize(["user"]), createOrder);


router.post("/adminaddorder",authenticate,authorize(["admin","staff"]), admincreateOrder)

// Get all orders (Admin)
router.get("/getallorder",authenticate,authorize(["admin","staff"]), getAllOrders);


router.get("/getuserallorder",authenticate,authorize(["admin","staff"]), getUserAllOrders);


router.get("/getadminallorder",authenticate,authorize(["admin","staff"]), getAdminAllOrders);

// // Get single order by ID
router.get("/userorder",authenticate,authorize(["user"]), getOrderByIduser);

// // Update order status
router.put("/orderstatusupdate/:id",authenticate,authorize(["admin","staff"]), updateOrderStatus);


router.post("/ordercancel/:id", authenticate, authorize(["user","admin","staff"]), cancelOrderAndRefund);



module.exports = router;
