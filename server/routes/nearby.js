import express from 'express';
import { getNearbyListings } from '../controllers/nearby.js';

const router = express.Router();

router.get('/', getNearbyListings);

export default router;
