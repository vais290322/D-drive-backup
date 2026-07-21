import express from 'express';
import { createItem, deleteItem, getAllItems, searchItem, updateItem } from '../SnigdhaControllers/snigdhaItems.controller.js';
const snigdhaitemRoute = express.Router();

snigdhaitemRoute
.post("/createitem",createItem)
.get("/allitems", getAllItems)

snigdhaitemRoute
.get("/searchitem/:item_id", searchItem)
.put("/updateitem/:item_id", updateItem)
.delete("/deleteitem/:item_id", deleteItem)


export default snigdhaitemRoute;

