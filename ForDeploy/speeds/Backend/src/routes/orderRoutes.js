// const express = require("express");
import express from "express";
const router = express.Router();
import{
  createOrder,
  // getAdminAllOrders,
  // getUserAllOrders,
  getOrderByIduser,
  updateOrderStatus,
  // admincreateOrder,
  // trackOrderDelivery,
  getAllOrders,
  // cancelOrderAndRefund,
  // getBestSellingProducts,
  // userbyorder
  
} from "../controllers/orderController.js";
import { requireAuth, isAdmin } from "../middleware/authMiddleware.js";


// router.get("/track/:id",
//    authenticate, authorize(["user","admin","staff"]), 
//    trackOrderDelivery);

// Create new order
router.post("/:id", requireAuth, isAdmin(["USER", "ADMIN", "STAFF"]), createOrder);


// router.post("/adminaddorder", requireAuth, isAdmin, admincreateOrder)

// Get all orders (Admin)
router.get("/getallorder", requireAuth, isAdmin(["ADMIN" , "STAFF"]), getAllOrders);

// router.get("/order/:id", requireAuth, isAdmin(["USER"]), getUserAllOrders);


// router.get("/getadminallorder", requireAuth, isAdmin, getAdminAllOrders);

// // Get single order by ID
router.get("/:id", requireAuth, isAdmin(["USER"]), getOrderByIduser);
  
// // Update order status
router.put("/statusupdate/:id",requireAuth, isAdmin(["ADMIN", "STAFF", "DELIVERY"]), updateOrderStatus);

// router.get("/userbyorder/:id", requireAuth, isAdmin, userbyorder);

// router.post("/ordercancel/:id", requireAuth, isAdmin, cancelOrderAndRefund);

// router.get("/bestsellingproduct", getBestSellingProducts);

export default router;

