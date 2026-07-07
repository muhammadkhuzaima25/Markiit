import express from 'express';
import { getAll, getUnreadCount, markAsRead, markAllAsRead } from '../controllers/notifications.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getAll);
router.get('/unread-count', protect, getUnreadCount);
router.put('/:id/read', protect, markAsRead);
router.put('/read-all', protect, markAllAsRead);

export default router;
