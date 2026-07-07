import express from 'express';
import { createReview, getProductReviews, getServiceReviews, getUserReviews } from '../controllers/reviews.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, createReview);
router.get('/product/:productId', getProductReviews);
router.get('/service/:serviceId', getServiceReviews);
router.get('/user/:userId', getUserReviews);

export default router;
