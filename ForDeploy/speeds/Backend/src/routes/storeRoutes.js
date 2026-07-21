import { Router } from 'express';
import { addStore, getAllStores, getStoreById, checkDelivery } from '../controllers/storeController.js';
const router = Router();

import { requireAuth, isAdmin } from "../middleware/authMiddleware.js";




router.post('/add', requireAuth, isAdmin(["ADMIN","STAFF"]), addStore);
router.get('/all', getAllStores);
router.get('/:storeId', requireAuth, isAdmin(["ADMIN","STAFF"]), getStoreById);
router.get('/check-delivery/:storeId', checkDelivery);
// router.put("/:storeId", requireAuth, isAdmin(["ADMIN"]), updateStore);
export default router;