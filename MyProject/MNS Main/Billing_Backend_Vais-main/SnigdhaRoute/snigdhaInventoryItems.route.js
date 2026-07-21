import express from 'express';
import { createInventoryItem, deleteInventoryItem, getAllInventoryItems, getInventoryItemsByDate, getInventoryItemsByDatePeriod, updateInventoryItem } from '../SnigdhaControllers/snigdhaInventoryItems.controller.js';

const snigdhainventoryItemRoute = express.Router();

snigdhainventoryItemRoute
.post("/create-inventory-item",createInventoryItem)
.get("/all-inventory-items", getAllInventoryItems)

snigdhainventoryItemRoute
.get("/search-inventory-item-by-date/:date", getInventoryItemsByDate)
.get("/search-inventory-item-by-time-period/:start_date/:end_date", getInventoryItemsByDatePeriod)
.put("/update-inventory-item/:item_id", updateInventoryItem)
.delete("/delete-inventory-item/:item_id", deleteInventoryItem)


export default snigdhainventoryItemRoute;                  