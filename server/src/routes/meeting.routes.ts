import { Router } from 'express';
import { body } from 'express-validator';
import {
    createMeeting,
    getMeetings,
    getMeetingById,
    updateMeeting,
    deleteMeeting,
    joinMeeting,
    leaveMeeting,
    endMeeting,
} from '../controllers/meeting.controller';
import { protect } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';

const router = Router();

// All meeting routes require authentication
router.use(protect);

const createMeetingRules = [
    body('title')
        .trim()
        .notEmpty().withMessage('Meeting title is required')
        .isLength({ min: 3, max: 100 }).withMessage('Title must be 3–100 characters'),
    body('description').optional().trim().isLength({ max: 500 }),
    body('startTime').optional().isISO8601().withMessage('Invalid date format'),
    body('agenda').optional().trim().isLength({ max: 2000 }),
];

const updateMeetingRules = [
    body('title').optional().trim().isLength({ min: 3, max: 100 }),
    body('description').optional().trim().isLength({ max: 500 }),
    body('startTime').optional().isISO8601(),
    body('agenda').optional().trim().isLength({ max: 2000 }),
];

router.post('/', createMeetingRules, validate, createMeeting);
router.get('/', getMeetings);
router.get('/:id', getMeetingById);
router.patch('/:id', updateMeetingRules, validate, updateMeeting);
router.delete('/:id', deleteMeeting);
router.post('/:id/join', joinMeeting);
router.post('/:id/leave', leaveMeeting);
router.post('/:id/end', endMeeting);

export default router;
