import { Router } from 'express';
import { body } from 'express-validator';
import {
    getProfile,
    updateProfile,
    uploadAvatar,
    deleteAvatar,
} from '../controllers/user.controller';
import { protect } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import upload from '../utils/upload';

const router = Router();

// All user routes require authentication
router.use(protect);

const updateProfileRules = [
    body('name')
        .optional()
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Name must be 2–50 characters'),
    body('bio')
        .optional()
        .trim()
        .isLength({ max: 300 })
        .withMessage('Bio cannot exceed 300 characters'),
];

// GET  /api/users/profile  — get current user's profile
router.get('/profile', getProfile);

// PATCH /api/users/profile — update name and/or bio
router.patch('/profile', updateProfileRules, validate, updateProfile);

// POST  /api/users/avatar  — upload/replace avatar
router.post('/avatar', upload.single('avatar'), uploadAvatar);

// DELETE /api/users/avatar — remove avatar
router.delete('/avatar', deleteAvatar);

export default router;
