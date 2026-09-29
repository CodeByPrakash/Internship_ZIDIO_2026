import { Request, Response, NextFunction } from 'express';
import prisma from '../config/prisma';

export const getMessages = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { page = 1, limit = 50 } = req.query;
        const skip = (Number(page) - 1) * Number(limit);
        const meetingId = req.params.meetingId;

        // Try to find meeting by ID or roomId
        const meeting = await prisma.meeting.findFirst({
            where: {
                OR: [{ id: meetingId }, { roomId: meetingId }],
            },
        });

        if (!meeting) {
            res.status(200).json({ success: true, total: 0, messages: [] });
            return;
        }

        const [messages, total] = await Promise.all([
            prisma.message.findMany({
                where: { meetingId: meeting.id },
                include: {
                    sender: { select: { id: true, name: true, avatar: true } },
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: Number(limit),
            }),
            prisma.message.count({ where: { meetingId: meeting.id } }),
        ]);

        res.status(200).json({ success: true, total, messages: messages.reverse() });
    } catch (err) {
        next(err);
    }
};
