import { Request, Response, NextFunction } from 'express';
import Message from '../models/Message';

export const getMessages = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { page = 1, limit = 50 } = req.query;
        const skip = (Number(page) - 1) * Number(limit);

        const [messages, total] = await Promise.all([
            Message.find({ meeting: req.params.meetingId })
                .populate('sender', 'name avatar')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(Number(limit)),
            Message.countDocuments({ meeting: req.params.meetingId }),
        ]);

        res.status(200).json({ success: true, total, messages: messages.reverse() });
    } catch (err) {
        next(err);
    }
};
