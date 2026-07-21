import express from 'express';
import { getAllHoldingData } from '../Controllers/holdingItems.controller.js';
import { addAllFromHoldingItems, getAllCurrentItems,addOneCurrentItemFromHoldingItems, sellCurrentItem, getItemById, getItemDetailsAndPurchaseOrders, getItemsByHsnCode, transferItemsByHsnCode } from '../Controllers/currentItems.controller.js';
// import { createInventoryItem, deleteInventoryItem, getAllInventoryItems, getInventoryItemsByDate, getInventoryItemsByDatePeriod, updateInventoryItem } from '../Controllers/inventoryItems.controller.js';

const currentItemRoute = express.Router();

currentItemRoute
// .post("/create-inventory-item",createInventoryItem)
.post("/add-inventory-current-items", addAllFromHoldingItems)
.get("/all-inventory-current-items", getAllCurrentItems)
.get("/item/:item_id", getItemById)
.get("/details-and-orders/:item_id",getItemDetailsAndPurchaseOrders)
.get("/current-items/hsn/:hsnCode",getItemsByHsnCode)
.post("/snig-transfer-by-hsn",transferItemsByHsnCode)


currentItemRoute
.post("/add-one-inventory-current-item/:id", addOneCurrentItemFromHoldingItems)
.delete("/sell-one-inventory-current-item/:item_id/:quantity", sellCurrentItem)
// .put("/update-inventory-item/:item_id", updateInventoryItem)
// .delete("/delete-inventory-item/:item_id", deleteInventoryItem)


export default currentItemRoute;        