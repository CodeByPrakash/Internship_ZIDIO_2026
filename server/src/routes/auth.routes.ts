import { Router } from 'express';
import { body } from 'express-validator';
import { signup, login, refresh, logout, getMe } from '../controllers/auth.controller';
import { protect } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { authLimiter } from '../middleware/rateLimit.middleware';

const router = Router();

const signupRules = [
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 2, max: 50 }).withMessage('Name must be 2–50 characters'),
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format'),
    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Password must contain uppercase, lowercase, and a number'),
];

const loginRules = [
    body('email').trim().notEmpty().isEmail().withMessage('Valid email required'),
    body('password').notEmpty().withMessage('Password is required'),
];

// Rate-limited auth routes (10 req / 15 min per IP)
router.post('/signup', authLimiter, signupRules, validate, signup);
router.post('/login', authLimiter, loginRules, validate, login);
router.post('/refresh', refresh);
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);

export default router;
