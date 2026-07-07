import express from 'express';
import { getUser, updateProfile, getPublicProfile, getNearbyUsers } from '../controllers/users.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.get('/nearby', protect, getNearbyUsers);
router.get('/:id', getUser);
router.put('/profile', protect, upload.single('avatar'), updateProfile);
router.get('/:id/public', getPublicProfile);

export default router;
