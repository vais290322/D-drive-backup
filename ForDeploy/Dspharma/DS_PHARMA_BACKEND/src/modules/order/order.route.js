import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import {
  createOrder,
  fetchMonthlyReport,
  fetchOrderByParty,
  fetchOrderBySalesman,
  fetchOrders,
  resendOTP,
  updateOrderStatus,
} from "./order.controller.js";

const orderRouter = Router();

orderRouter.use(authMiddleware);

orderRouter.post("/:salesManId", createOrder);
orderRouter.get("/", fetchOrders);
orderRouter.get("/monthly-report", fetchMonthlyReport);
orderRouter.get("/:salesManId", fetchOrderBySalesman);

export default orderRouter;

export const userOrder = Router();

userOrder.get("/userOrder", authMiddleware, fetchOrderByParty);
