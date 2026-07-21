import express from 'express';
import { getAllHoldingData } from '../Controllers/holdingItems.controller.js';
// import { createInventoryItem, deleteInventoryItem, getAllInventoryItems, getInventoryItemsByDate, getInventoryItemsByDatePeriod, updateInventoryItem } from '../Controllers/inventoryItems.controller.js';

const holdingItemRoute = express.Router();

holdingItemRoute
// .post("/create-inventory-item",createInventoryItem)
.get("/all-inventory-holding-items", getAllHoldingData)

// holdingItemRoute
// .get("/search-inventory-item-by-date/:date", getInventoryItemsByDate)
// .get("/search-inventory-item-by-time-period/:start_date/:end_date", getInventoryItemsByDatePeriod)
// .put("/update-inventory-item/:item_id", updateInventoryItem)
// .delete("/delete-inventory-item/:item_id", deleteInventoryItem)


export default holdingItemRoute;        