import { Request, Response, NextFunction } from 'express';
import Notification from '../models/Notification';

export const getNotifications = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { page = 1, limit = 20 } = req.query;
        const skip = (Number(page) - 1) * Number(limit);

        const [notifications, total, unreadCount] = await Promise.all([
            Notification.find({ recipient: req.user!.userId })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(Number(limit)),
            Notification.countDocuments({ recipient: req.user!.userId }),
            Notification.countDocuments({ recipient: req.user!.userId, isRead: false }),
        ]);

        res.status(200).json({ success: true, total, unreadCount, notifications });
    } catch (err) {
        next(err);
    }
};

export const markAsRead = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
        res.status(200).json({ success: true, message: 'Marked as read' });
    } catch (err) {
        next(err);
    }
};

export const markAllAsRead = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        await Notification.updateMany(
            { recipient: req.user!.userId, isRead: false },
            { isRead: true }
        );
        res.status(200).json({ success: true, message: 'All notifications marked as read' });
    } catch (err) {
        next(err);
    }
};
