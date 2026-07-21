import express from 'express';
import { getAllHoldingData } from '../SnigdhaControllers/snigdhaHoldingItems.controller.js';


const snigdhaholdingItemRoute = express.Router();

snigdhaholdingItemRoute

.get("/all-inventory-holding-items", getAllHoldingData)



export default snigdhaholdingItemRoute;        