import { Router } from 'express';
import {
  authMiddleware,
  authorize,
} from '../../middlewares/auth.middleware.js';
import {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
} from './wishlist.controller.js';

const wishlistRouter = Router();

wishlistRouter.use(authMiddleware, authorize('party'));

wishlistRouter.post('/addwishlist', addToWishlist);
wishlistRouter.get('/getwishlist', getWishlist);
wishlistRouter.delete(
  '/deletewishlist/:id',

  removeFromWishlist,
);

export default wishlistRouter;
