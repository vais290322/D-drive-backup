import { Router } from 'express';
import {
  addToCart,
  getCart,
  updateCartItem,
  removeCartItem,
} from './cart.controller.js';
import {
  authMiddleware,
  authorize,
} from '../../middlewares/auth.middleware.js';

const cartRouter = Router();

cartRouter.use(authMiddleware, authorize('party'));

cartRouter.post('/cartadd', addToCart);
cartRouter.get('/cartget', getCart);
cartRouter.put('/cartupdate/:id', updateCartItem);
cartRouter.delete('/cartdelete/:id', removeCartItem);

export default cartRouter;
