import { Router } from 'express';
import { protect } from '../middleware/auth.middleware';
import { getMessages } from '../controllers/chat.controller';

const router = Router();

router.get('/meetings/:meetingId/messages', protect, getMessages);

export default router;
