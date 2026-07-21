import express from 'express';
import { createItem, deleteItem, getAllItems, itemsAllReport, searchItem, updateItem } from '../Controllers/items.controller.js';
const itemRoute = express.Router();

itemRoute
.post("/createitem",createItem)
.get("/allitems", getAllItems)
.get("/itemsreport", itemsAllReport)

itemRoute
.get("/searchitem/:item_id", searchItem)
.put("/updateitem/:item_id", updateItem)
.delete("/deleteitem/:item_id", deleteItem)


export default itemRoute;