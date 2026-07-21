import { Router } from 'express';
import {
  authMiddleware,
  authorize,
} from '../../middlewares/auth.middleware.js';
import {
  createStaff,
  deleteStaff,
  fetchSalesmanMonthlyReport,
  fetchStaffById,
  fetchStaffReport,
  getAllStaff,
  updateStaff,
} from './staff.controller.js';

const staffRouter = Router();

staffRouter.use(authMiddleware);

staffRouter.route('/').get(getAllStaff).post(createStaff);

staffRouter
  .route('/:staffId')
  .get(authorize('admin', 'staff'), fetchStaffById)
  .patch(authorize('admin'), updateStaff)
  .delete(authorize('admin'), deleteStaff);

staffRouter.get(
  '/:userId/monthly-report',
  authorize('admin', 'staff'),
  fetchSalesmanMonthlyReport,
);

staffRouter.get(
  '/:userId/report',
  authorize('super_admin', 'admin'),
  fetchStaffReport,
);

export default staffRouter;
