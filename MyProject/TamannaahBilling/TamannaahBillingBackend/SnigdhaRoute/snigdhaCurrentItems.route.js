import express from 'express';
import { addAllFromHoldingItems, getAllCurrentItems,addOneCurrentItemFromHoldingItems, sellCurrentItem, getItemById, getItemDetailsAndPurchaseOrders, getItemsByHsnCode, transferItemsByHsnCode } from '../SnigdhaControllers/snigdhaCurrentitems.controller.js';


const snigdhacurrentItemRoute = express.Router();

snigdhacurrentItemRoute
// .post("/create-inventory-item",createInventoryItem)
.post("/add-inventory-current-items", addAllFromHoldingItems)
.get("/all-inventory-current-items", getAllCurrentItems)
.get("/item/:item_id", getItemById)
.get("/details-and-orders/:item_id",getItemDetailsAndPurchaseOrders)
.get("/current-items/hsn/:hsnCode",getItemsByHsnCode)
.post("/snig-transfer-by-hsn",transferItemsByHsnCode)


snigdhacurrentItemRoute
.post("/add-one-inventory-current-item/:id", addOneCurrentItemFromHoldingItems)
.delete("/sell-one-inventory-current-item/:item_id/:quantity", sellCurrentItem)
// .put("/update-inventory-item/:item_id", updateInventoryItem)
// .delete("/delete-inventory-item/:item_id", deleteInventoryItem)


export default snigdhacurrentItemRoute;        