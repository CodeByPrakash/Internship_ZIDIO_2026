import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import Meeting from '../models/Meeting';
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
        const { title, description, startTime, agenda, passcode } = req.body;

        const meeting = await Meeting.create({
            title,
            description,
            agenda,
            passcode,
            startTime: startTime ? new Date(startTime) : undefined,
            host: req.user!.userId,
            participants: [
                {
                    user: new mongoose.Types.ObjectId(req.user!.userId),
                    role: 'host',
                    joinedAt: new Date(),
                },
            ],
        });

        logger.info(`Meeting created: ${meeting.roomId} by user ${req.user!.userId}`);
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
        const userId = req.user!.userId;
        const { status, page = 1, limit = 10 } = req.query;

        const filter: Record<string, unknown> = {
            $or: [{ host: userId }, { 'participants.user': userId }],
        };
        if (status) filter.status = status;

        const skip = (Number(page) - 1) * Number(limit);
        const [meetings, total] = await Promise.all([
            Meeting.find(filter)
                .populate('host', 'name email avatar')
                .populate('participants.user', 'name avatar')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(Number(limit)),
            Meeting.countDocuments(filter),
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
        const key = cacheKey(req.params.id);

        // Try cache first
        const cached = await cacheGet<Record<string, unknown>>(key);
        if (cached) {
            logger.debug(`Cache HIT: ${key}`);
            res.status(200).json({ success: true, meeting: cached, fromCache: true });
            return;
        }

        logger.debug(`Cache MISS: ${key}`);

        const meeting = await Meeting.findById(req.params.id)
            .populate('host', 'name email avatar')
            .populate('participants.user', 'name avatar');

        if (!meeting) {
            res.status(404).json({ success: false, message: 'Meeting not found' });
            return;
        }

        const userId = req.user!.userId;
        const isMember =
            meeting.host._id.toString() === userId ||
            meeting.participants.some((p) => p.user._id.toString() === userId);

        if (!isMember) {
            res.status(403).json({ success: false, message: 'Access denied' });
            return;
        }

        // Store in cache
        await cacheSet(key, meeting.toJSON(), CACHE_TTL);

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
        const meeting = await Meeting.findById(req.params.id);
        if (!meeting) {
            res.status(404).json({ success: false, message: 'Meeting not found' });
            return;
        }

        if (meeting.host.toString() !== req.user!.userId) {
            res.status(403).json({ success: false, message: 'Only the host can update this meeting' });
            return;
        }

        if (meeting.status === 'ended') {
            res.status(400).json({ success: false, message: 'Cannot update an ended meeting' });
            return;
        }

        const { title, description, startTime, agenda } = req.body;
        Object.assign(meeting, {
            ...(title && { title }),
            ...(description !== undefined && { description }),
            ...(startTime && { startTime: new Date(startTime) }),
            ...(agenda !== undefined && { agenda }),
        });

        await meeting.save();
        await cacheDel(cacheKey(req.params.id)); // Invalidate cache

        res.status(200).json({ success: true, meeting });
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
        const meeting = await Meeting.findById(req.params.id);
        if (!meeting) {
            res.status(404).json({ success: false, message: 'Meeting not found' });
            return;
        }

        if (meeting.host.toString() !== req.user!.userId) {
            res.status(403).json({ success: false, message: 'Only the host can delete this meeting' });
            return;
        }

        meeting.status = 'ended';
        meeting.endTime = new Date();
        await meeting.save();
        await cacheDel(cacheKey(req.params.id)); // Invalidate cache

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
        const meeting = await Meeting.findById(req.params.id);
        if (!meeting) {
            res.status(404).json({ success: false, message: 'Meeting not found' });
            return;
        }

        if (meeting.status === 'ended') {
            res.status(400).json({ success: false, message: 'This meeting has ended' });
            return;
        }

        const userId = req.user!.userId;
        const alreadyJoined = meeting.participants.some(
            (p) => p.user.toString() === userId
        );

        if (!alreadyJoined) {
            meeting.participants.push({
                user: new mongoose.Types.ObjectId(userId),
                role: 'attendee',
                joinedAt: new Date(),
            });
        } else {
            const participant = meeting.participants.find(
                (p) => p.user.toString() === userId
            );
            if (participant) {
                participant.joinedAt = new Date();
                participant.leftAt = undefined;
            }
        }

        if (meeting.status === 'scheduled') {
            meeting.status = 'active';
            meeting.startTime = meeting.startTime || new Date();
        }

        await meeting.save();
        await cacheDel(cacheKey(req.params.id));

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
        const meeting = await Meeting.findById(req.params.id);
        if (!meeting) {
            res.status(404).json({ success: false, message: 'Meeting not found' });
            return;
        }

        const participant = meeting.participants.find(
            (p) => p.user.toString() === req.user!.userId
        );

        if (participant) {
            participant.leftAt = new Date();
            await meeting.save();
            await cacheDel(cacheKey(req.params.id));
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
        const meeting = await Meeting.findById(req.params.id);
        if (!meeting) {
            res.status(404).json({ success: false, message: 'Meeting not found' });
            return;
        }

        if (meeting.host.toString() !== req.user!.userId) {
            res.status(403).json({ success: false, message: 'Only the host can end this meeting' });
            return;
        }

        meeting.status = 'ended';
        meeting.endTime = new Date();
        meeting.participants.forEach((p) => {
            if (!p.leftAt) p.leftAt = new Date();
        });

        await meeting.save();
        await cacheDel(cacheKey(req.params.id));

        res.status(200).json({ success: true, message: 'Meeting ended', meeting });
    } catch (err) {
        next(err);
    }
};
