import { Router } from 'express';
import {
  getAllAddresses, addAddress, updateAddress, deleteAddress, setDefaultAddress
} from '../controllers/shippingaddressController.js';
const router = Router();
router.get('/:userId', getAllAddresses);
router.post('/add/:userId', addAddress); // optional query ?storeId=...
router.put('/update/:userId', updateAddress);
router.delete('/delete/:addressId/:userId', deleteAddress);
router.put('/default/:addressId/:userId', setDefaultAddress);
export default router;
