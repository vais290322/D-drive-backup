import express from "express";
import { createPurchaseOrder, deletePurchaseOrder, getAllPurchaseOrders, getPurchaseOrdersByItemId } from "../SnigdhaControllers/snigdhaParchaseOrder.controller.js";

const snigdhaPurchaseOrderRouter = express.Router();

snigdhaPurchaseOrderRouter
    .post("/create", createPurchaseOrder)
    .get("/all", getAllPurchaseOrders)
    .get("/item/:item_id",getPurchaseOrdersByItemId)
    .delete("/delete/:id", deletePurchaseOrder);

export default snigdhaPurchaseOrderRouter;