import { Router } from "express";
import { createOrder } from "./order.controller.js";

const orderRouter = Router();

orderRouter.post("/:salesManId", createOrder);

export default orderRouter;
