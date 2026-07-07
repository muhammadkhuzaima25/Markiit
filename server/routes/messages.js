import express from 'express';
import { createMessage, getMessages, getConversations } from '../controllers/messages.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.get('/', protect, getMessages);
router.get('/conversations', protect, getConversations);
router.post('/', protect, upload.array('images', 5), createMessage);

export default router;
