import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, JwtPayload } from '../utils/jwt';
import prisma from '../config/prisma';
import { auth } from '../config/auth';
import { fromNodeHeaders } from 'better-auth/node';

// Extend Express Request with user property
declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: string;
                role: string;
                email?: string;
                name?: string;
            };
        }
    }
}

/**
 * protect — verifies Better Auth session or Bearer access token and attaches user to req
 */
export const protect = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        // 1. Try Better Auth Session first
        try {
            const session = await auth.api.getSession({
                headers: fromNodeHeaders(req.headers),
            });

            if (session && session.user) {
                req.user = {
                    userId: session.user.id,
                    role: (session.user as any).role || 'member',
                    email: session.user.email,
                    name: session.user.name,
                };
                return next();
            }
        } catch {
            // Fallback to Bearer token
        }

        // 2. Try Authorization Bearer Token
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];
            const decoded = verifyAccessToken(token) as JwtPayload;

            const user = await prisma.user.findUnique({
                where: { id: decoded.userId },
                select: { id: true, role: true, email: true, name: true },
            });

            if (user) {
                req.user = {
                    userId: user.id,
                    role: user.role,
                    email: user.email,
                    name: user.name,
                };
                return next();
            }
        }

        res.status(401).json({ success: false, message: 'Unauthorized - No valid session or token provided' });
    } catch (err: unknown) {
        const message =
            err instanceof Error && err.name === 'TokenExpiredError'
                ? 'Access token expired'
                : 'Invalid session or token';
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
