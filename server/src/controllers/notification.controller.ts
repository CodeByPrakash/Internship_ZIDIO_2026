import { Request, Response, NextFunction } from 'express';
import prisma from '../config/prisma';

export const getNotifications = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (!req.user?.userId) {
            res.status(401).json({ success: false, message: 'Unauthorized' });
            return;
        }

        const { page = 1, limit = 20 } = req.query;
        const skip = (Number(page) - 1) * Number(limit);
        const userId = req.user.userId;

        const [notifications, total, unreadCount] = await Promise.all([
            prisma.notification.findMany({
                where: { userId },
                orderBy: { createdAt: 'desc' },
                skip,
                take: Number(limit),
            }),
            prisma.notification.count({ where: { userId } }),
            prisma.notification.count({ where: { userId, read: false } }),
        ]);

        res.status(200).json({ success: true, total, unreadCount, notifications });
    } catch (err) {
        next(err);
    }
};

export const markAsRead = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        await prisma.notification.update({
            where: { id: req.params.id },
            data: { read: true },
        });
        res.status(200).json({ success: true, message: 'Marked as read' });
    } catch (err) {
        next(err);
    }
};

export const markAllAsRead = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (!req.user?.userId) {
            res.status(401).json({ success: false, message: 'Unauthorized' });
            return;
        }

        await prisma.notification.updateMany({
            where: { userId: req.user.userId, read: false },
            data: { read: true },
        });
        res.status(200).json({ success: true, message: 'All notifications marked as read' });
    } catch (err) {
        next(err);
    }
};
