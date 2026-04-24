import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, JwtPayload } from '../utils/jwt';
import User from '../models/User';

// Extend Express Request with user property
declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: string;
                role: string;
            };
        }
    }
}

/**
 * protect — verifies Bearer access token and attaches user to req
 */
export const protect = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ success: false, message: 'No token provided' });
            return;
        }

        const token = authHeader.split(' ')[1];
        const decoded = verifyAccessToken(token) as JwtPayload;

        // Confirm user still exists and is active
        const user = await User.findById(decoded.userId).select('isActive role');
        if (!user || !user.isActive) {
            res.status(401).json({ success: false, message: 'User not found or deactivated' });
            return;
        }

        req.user = { userId: decoded.userId, role: decoded.role };
        next();
    } catch (err: unknown) {
        const message =
            err instanceof Error && err.name === 'TokenExpiredError'
                ? 'Access token expired'
                : 'Invalid token';
        res.status(401).json({ success: false, message });
    }
};

/**
 * authorize — RBAC guard, call after protect()
 * Usage: router.get('/admin', protect, authorize('admin'), handler)
 */
export const authorize = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        if (!req.user || !roles.includes(req.user.role)) {
            res.status(403).json({
                success: false,
                message: `Role '${req.user?.role}' is not authorized to access this resource`,
            });
            return;
        }
        next();
    };
};
