import { Router } from 'express';
import {
  addAddress,
  getAddresses,
  updateAddress,
  deleteAddress,
  setaddress,
  getAddressesbyuser,
} from './address.controller.js';
import {
  authMiddleware,
  authorize,
} from '../../middlewares/auth.middleware.js';

const addressRouter = Router();

addressRouter.use(authMiddleware, authorize('party'));

addressRouter.post('/address', addAddress);
addressRouter.get('/address', getAddresses);
addressRouter.put('/address/:id', updateAddress);
addressRouter.delete('/address/:id', deleteAddress);
addressRouter.put('/address/set/:id', setaddress);
addressRouter.get('/addressbyuser', getAddressesbyuser);

export default addressRouter;
