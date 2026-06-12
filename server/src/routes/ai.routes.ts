import { Router } from 'express';
import { protect } from '../middleware/auth.middleware';
import { transcribeMeeting, summarizeMeeting, getAiSummary } from '../controllers/ai.controller';

const router = Router();

router.post('/meetings/:meetingId/transcribe', protect, transcribeMeeting);
router.post('/meetings/:meetingId/summarize', protect, summarizeMeeting);
router.get('/meetings/:meetingId/summary', protect, getAiSummary);

export default router;
