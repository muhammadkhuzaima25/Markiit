import express from 'express';
import { createReport, getContentReports } from '../controllers/reports.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, createReport);
router.get('/content/:contentType/:contentId', getContentReports);

export default router;
