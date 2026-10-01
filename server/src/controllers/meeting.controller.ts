import { Request, Response, NextFunction } from 'express';
import prisma from '../config/prisma';
import { cacheGet, cacheSet, cacheDel } from '../utils/cache';
import logger from '../utils/logger';

const CACHE_TTL = 300; // 5 minutes
const cacheKey = (id: string) => `meeting:${id}`;

// ─── CREATE MEETING ────────────────────────────────────────────────────────────

export const createMeeting = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        if (!req.user?.userId) {
            res.status(401).json({ success: false, message: 'Unauthorized' });
            return;
        }

        const { title, description, startTime, agenda, roomId } = req.body;
        const meetingRoomId = roomId || crypto.randomUUID();

        const meeting = await prisma.meeting.create({
            data: {
                title,
                description,
                roomId: meetingRoomId,
                agenda: agenda ? (Array.isArray(agenda) ? agenda : [agenda]) : undefined,
                startTime: startTime ? new Date(startTime) : undefined,
                hostId: req.user.userId,
                participants: {
                    create: {
                        userId: req.user.userId,
                        role: 'host',
                    },
                },
            },
            include: {
                host: { select: { id: true, name: true, email: true, avatar: true } },
                participants: {
                    include: {
                        user: { select: { id: true, name: true, avatar: true } },
                    },
                },
            },
        });

        logger.info(`Meeting created: ${meeting.roomId} by user ${req.user.userId}`);
        res.status(201).json({ success: true, meeting });
    } catch (err) {
        next(err);
    }
};

// ─── GET ALL MEETINGS (for current user) ─────────────────────────────────────

export const getMeetings = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        if (!req.user?.userId) {
            res.status(401).json({ success: false, message: 'Unauthorized' });
            return;
        }

        const userId = req.user.userId;
        const { status, page = 1, limit = 10 } = req.query;

        const whereClause: any = {
            OR: [
                { hostId: userId },
                { participants: { some: { userId } } },
            ],
        };

        if (status) {
            whereClause.status = String(status);
        }

        const skip = (Number(page) - 1) * Number(limit);
        const take = Number(limit);

        const [meetings, total] = await Promise.all([
            prisma.meeting.findMany({
                where: whereClause,
                include: {
                    host: { select: { id: true, name: true, email: true, avatar: true } },
                    participants: {
                        include: {
                            user: { select: { id: true, name: true, avatar: true } },
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take,
            }),
            prisma.meeting.count({ where: whereClause }),
        ]);

        res.status(200).json({
            success: true,
            total,
            page: Number(page),
            pages: Math.ceil(total / Number(limit)),
            meetings,
        });
    } catch (err) {
        next(err);
    }
};

// ─── GET MEETING BY ID (with Redis cache) ─────────────────────────────────────

export const getMeetingById = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        if (!req.user?.userId) {
            res.status(401).json({ success: false, message: 'Unauthorized' });
            return;
        }

        const key = cacheKey(req.params.id);

        // Try cache first
        const cached = await cacheGet<Record<string, unknown>>(key);
        if (cached) {
            logger.debug(`Cache HIT: ${key}`);
            res.status(200).json({ success: true, meeting: cached, fromCache: true });
            return;
        }

        logger.debug(`Cache MISS: ${key}`);

        // Find by id or roomId
        const meeting = await prisma.meeting.findFirst({
            where: {
                OR: [{ id: req.params.id }, { roomId: req.params.id }],
            },
            include: {
                host: { select: { id: true, name: true, email: true, avatar: true } },
                participants: {
                    include: {
                        user: { select: { id: true, name: true, avatar: true } },
                    },
                },
                actionItems: true,
            },
        });

        if (!meeting) {
            res.status(404).json({ success: false, message: 'Meeting not found' });
            return;
        }

        // Store in cache
        await cacheSet(key, meeting, CACHE_TTL);

        res.status(200).json({ success: true, meeting });
    } catch (err) {
        next(err);
    }
};

// ─── UPDATE MEETING ───────────────────────────────────────────────────────────

export const updateMeeting = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        if (!req.user?.userId) {
            res.status(401).json({ success: false, message: 'Unauthorized' });
            return;
        }

        const meeting = await prisma.meeting.findFirst({
            where: {
                OR: [{ id: req.params.id }, { roomId: req.params.id }],
            },
        });

        if (!meeting) {
            res.status(404).json({ success: false, message: 'Meeting not found' });
            return;
        }

        if (meeting.hostId !== req.user.userId) {
            res.status(403).json({ success: false, message: 'Only the host can update this meeting' });
            return;
        }

        if (meeting.status === 'ended') {
            res.status(400).json({ success: false, message: 'Cannot update an ended meeting' });
            return;
        }

        const { title, description, startTime, agenda, aiSummary, keyDecisions } = req.body;

        const updated = await prisma.meeting.update({
            where: { id: meeting.id },
            data: {
                ...(title && { title }),
                ...(description !== undefined && { description }),
                ...(startTime && { startTime: new Date(startTime) }),
                ...(agenda !== undefined && { agenda: Array.isArray(agenda) ? agenda : [agenda] }),
                ...(aiSummary !== undefined && { aiSummary }),
                ...(keyDecisions !== undefined && { keyDecisions }),
            },
        });

        await cacheDel(cacheKey(req.params.id));
        await cacheDel(cacheKey(meeting.roomId));

        res.status(200).json({ success: true, meeting: updated });
    } catch (err) {
        next(err);
    }
};

// ─── DELETE MEETING ───────────────────────────────────────────────────────────

export const deleteMeeting = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        if (!req.user?.userId) {
            res.status(401).json({ success: false, message: 'Unauthorized' });
            return;
        }

        const meeting = await prisma.meeting.findFirst({
            where: {
                OR: [{ id: req.params.id }, { roomId: req.params.id }],
            },
        });

        if (!meeting) {
            res.status(404).json({ success: false, message: 'Meeting not found' });
            return;
        }

        if (meeting.hostId !== req.user.userId) {
            res.status(403).json({ success: false, message: 'Only the host can delete this meeting' });
            return;
        }

        await prisma.meeting.update({
            where: { id: meeting.id },
            data: {
                status: 'ended',
                endTime: new Date(),
            },
        });

        await cacheDel(cacheKey(req.params.id));
        await cacheDel(cacheKey(meeting.roomId));

        res.status(200).json({ success: true, message: 'Meeting cancelled' });
    } catch (err) {
        next(err);
    }
};

// ─── JOIN MEETING ─────────────────────────────────────────────────────────────

export const joinMeeting = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        if (!req.user?.userId) {
            res.status(401).json({ success: false, message: 'Unauthorized' });
            return;
        }

        const meeting = await prisma.meeting.findFirst({
            where: {
                OR: [{ id: req.params.id }, { roomId: req.params.id }],
            },
            include: { participants: true },
        });

        if (!meeting) {
            res.status(404).json({ success: false, message: 'Meeting not found' });
            return;
        }

        if (meeting.status === 'ended') {
            res.status(400).json({ success: false, message: 'This meeting has ended' });
            return;
        }

        const userId = req.user.userId;
        const existingParticipant = meeting.participants.find((p: { userId: string; }) => p.userId === userId);

        if (!existingParticipant) {
            await prisma.participant.create({
                data: {
                    meetingId: meeting.id,
                    userId,
                    role: meeting.hostId === userId ? 'host' : 'attendee',
                },
            });
        } else {
            await prisma.participant.update({
                where: { id: existingParticipant.id },
                data: { joinedAt: new Date(), leftAt: null },
            });
        }

        if (meeting.status === 'scheduled') {
            await prisma.meeting.update({
                where: { id: meeting.id },
                data: {
                    status: 'active',
                    startTime: meeting.startTime || new Date(),
                },
            });
        }

        await cacheDel(cacheKey(req.params.id));
        await cacheDel(cacheKey(meeting.roomId));

        res.status(200).json({
            success: true,
            message: 'Joined meeting',
            roomId: meeting.roomId,
        });
    } catch (err) {
        next(err);
    }
};

// ─── LEAVE MEETING ────────────────────────────────────────────────────────────

export const leaveMeeting = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        if (!req.user?.userId) {
            res.status(401).json({ success: false, message: 'Unauthorized' });
            return;
        }

        const meeting = await prisma.meeting.findFirst({
            where: {
                OR: [{ id: req.params.id }, { roomId: req.params.id }],
            },
            include: { participants: true },
        });

        if (meeting) {
            const participant = meeting.participants.find((p) => p.userId === req.user?.userId);
            if (participant) {
                await prisma.participant.update({
                    where: { id: participant.id },
                    data: { leftAt: new Date() },
                });
            }
            await cacheDel(cacheKey(req.params.id));
            await cacheDel(cacheKey(meeting.roomId));
        }

        res.status(200).json({ success: true, message: 'Left meeting' });
    } catch (err) {
        next(err);
    }
};

// ─── END MEETING ──────────────────────────────────────────────────────────────

export const endMeeting = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        if (!req.user?.userId) {
            res.status(401).json({ success: false, message: 'Unauthorized' });
            return;
        }

        const meeting = await prisma.meeting.findFirst({
            where: {
                OR: [{ id: req.params.id }, { roomId: req.params.id }],
            },
        });

        if (!meeting) {
            res.status(404).json({ success: false, message: 'Meeting not found' });
            return;
        }

        if (meeting.hostId !== req.user.userId) {
            res.status(403).json({ success: false, message: 'Only the host can end this meeting' });
            return;
        }

        const updated = await prisma.meeting.update({
            where: { id: meeting.id },
            data: {
                status: 'ended',
                endTime: new Date(),
            },
        });

        await cacheDel(cacheKey(req.params.id));
        await cacheDel(cacheKey(meeting.roomId));

        res.status(200).json({ success: true, message: 'Meeting ended', meeting: updated });
    } catch (err) {
        next(err);
    }
};
