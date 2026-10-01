import rateLimit from 'express-rate-limit';
import { env } from '../config/env';

const isDev = env.NODE_ENV === 'development';

/**
 * authLimiter — brute-force protection on login/signup
 * Dev:  200 requests / 15 min  (won't interfere with testing)
 * Prod: 10  requests / 15 min  (strict)
 */
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: isDev ? 200 : 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Too many requests from this IP. Please try again after 15 minutes.',
    },
    skipSuccessfulRequests: true, // Only failed attempts count against the limit
});

/**
 * apiLimiter — general API throttle
 * Dev:  1000 requests / 15 min
 * Prod: 100  requests / 15 min
 */
export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: isDev ? 1000 : 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Too many requests. Please slow down.',
    },
});
