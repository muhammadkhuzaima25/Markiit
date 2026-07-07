import express from 'express';
import { getDashboardStats, getRecentActivity, getUsers, getUser, suspendUser, getProducts, updateProductStatus, getServices, updateServiceStatus, getReports, resolveReport } from '../controllers/admin.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.get('/dashboard/stats', getDashboardStats);
router.get('/dashboard/activity', getRecentActivity);
router.get('/users', getUsers);
router.get('/users/:id', getUser);
router.put('/users/:id/suspend', suspendUser);
router.get('/products', getProducts);
router.put('/products/:id/status', updateProductStatus);
router.get('/services', getServices);
router.put('/services/:id/status', updateServiceStatus);
router.get('/reports', getReports);
router.put('/reports/:id/resolve', resolveReport);

export default router;
