import express from 'express';
import { createItem, deleteItem, getAllItems, itemsAllReport, searchItem, updateItem } from '../SnigdhaControllers/snigdhaItems.controller.js';

const snigdhaitemRoute = express.Router();

snigdhaitemRoute
.post("/createitem",createItem)
.get("/allitems", getAllItems)
.get("/itemsreport", itemsAllReport)

snigdhaitemRoute
.get("/searchitem/:item_id", searchItem)
.put("/updateitem/:item_id", updateItem)
.delete("/deleteitem/:item_id", deleteItem)


export default snigdhaitemRoute;

