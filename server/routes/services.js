import express from 'express';
import { getServices, getService, createService, updateService, deleteService, getMyServices } from '../controllers/services.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.get('/my', protect, getMyServices);
router.get('/', getServices);
router.get('/:id', getService);
router.post('/', protect, upload.fields([{ name: 'images', maxCount: 5 }, { name: 'portfolioImages', maxCount: 5 }]), createService);
router.put('/:id', protect, upload.fields([{ name: 'images', maxCount: 5 }, { name: 'portfolioImages', maxCount: 5 }]), updateService);
router.delete('/:id', protect, deleteService);

export default router;
