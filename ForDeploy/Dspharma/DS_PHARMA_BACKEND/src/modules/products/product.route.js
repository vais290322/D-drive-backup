import { Router } from 'express';
import {
  addCategoryToProduct,
  createProductRequest,
  fetchExpiredProducts,
  fetchExpiringProducts,
  fetchFeaturedProducts,
  fetchLowStockProducts,
  fetchProducts,
  fetchProductsByCategory,
  getProductDetails,
  updateProductDetails,
  updateRequestStatus,
  fetchProductRequests,
} from './product.controller.js';
import {
  authMiddleware,
  authorize,
} from '../../middlewares/auth.middleware.js';

const productRoute = Router();

productRoute.get('/', fetchProducts);
productRoute.get('/category/:categoryId', fetchProductsByCategory);
productRoute.get('/details/:rid', getProductDetails);
productRoute.get('/featured', fetchFeaturedProducts);
productRoute.patch('/addCategory/:rid', addCategoryToProduct);
productRoute.put('/update/:rid', updateProductDetails);
productRoute.get('/low-stock', fetchLowStockProducts);
productRoute.get('/expiring', fetchExpiringProducts);
productRoute.get('/expired', fetchExpiredProducts);
productRoute.post(
  '/request',
  createProductRequest,
);
productRoute.get(
  '/request',
  fetchProductRequests,
);
productRoute.patch(
  '/request/:requestId',
  updateRequestStatus,
);

export default productRoute;
