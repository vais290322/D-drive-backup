import express from "express";
import { createPurchaseOrder, deletePurchaseOrder, getAllPurchaseOrders, getPurchaseOrdersByItemId } from "../Controllers/ParchaseOrder.controller.js";

const PurchaseOrderRouter = express.Router();

PurchaseOrderRouter
    .post("/create", createPurchaseOrder)
    .get("/all", getAllPurchaseOrders)
    .get("/item/:item_id",getPurchaseOrdersByItemId)
    .delete("/delete/:id", deletePurchaseOrder);

export default PurchaseOrderRouter;