import express from 'express';
import { createBooking, getMyBookings, getReceivedBookings, updateBookingStatus, getBooking } from '../controllers/bookings.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, createBooking);
router.get('/my', protect, getMyBookings);
router.get('/received', protect, getReceivedBookings);
router.get('/:id', protect, getBooking);
router.put('/:id/status', protect, updateBookingStatus);

export default router;
