import { Request, Response, NextFunction } from 'express';
import prisma from '../config/prisma';
import { cloudinaryUpload, cloudinaryDestroy } from '../config/cloudinary';
import logger from '../utils/logger';
import { env } from '../config/env';

// ─── GET PROFILE ─────────────────────────────────────────────────────────────

export const getProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        if (!req.user?.userId) {
            res.status(401).json({ success: false, message: 'Unauthorized' });
            return;
        }

        const user = await prisma.user.findUnique({
            where: { id: req.user.userId },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                avatar: true,
                bio: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        if (!user) {
            res.status(404).json({ success: false, message: 'User not found' });
            return;
        }
        res.status(200).json({ success: true, user });
    } catch (err) {
        next(err);
    }
};

// ─── UPDATE PROFILE ───────────────────────────────────────────────────────────

export const updateProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        if (!req.user?.userId) {
            res.status(401).json({ success: false, message: 'Unauthorized' });
            return;
        }

        const { name, bio, avatar } = req.body;

        const updated = await prisma.user.update({
            where: { id: req.user.userId },
            data: {
                ...(name && { name }),
                ...(bio !== undefined && { bio }),
                ...(avatar !== undefined && { avatar }),
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                avatar: true,
                bio: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        res.status(200).json({
            success: true,
            message: 'Profile updated',
            user: updated,
        });
    } catch (err) {
        next(err);
    }
};

// ─── UPLOAD AVATAR ────────────────────────────────────────────────────────────

export const uploadAvatar = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        if (!req.user?.userId) {
            res.status(401).json({ success: false, message: 'Unauthorized' });
            return;
        }

        if (!env.CLOUDINARY_CLOUD_NAME) {
            res.status(503).json({
                success: false,
                message: 'Cloudinary is not configured on this server',
            });
            return;
        }

        if (!req.file) {
            res.status(400).json({ success: false, message: 'No image file provided' });
            return;
        }

        const user = await prisma.user.findUnique({
            where: { id: req.user.userId },
        });

        if (!user) {
            res.status(404).json({ success: false, message: 'User not found' });
            return;
        }

        const { url } = await cloudinaryUpload(req.file.buffer, {
            folder: 'intellmeet/avatars',
            public_id: `avatar_${user.id}`,
        });

        const updated = await prisma.user.update({
            where: { id: user.id },
            data: { avatar: url },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                avatar: true,
                bio: true,
            },
        });

        res.status(200).json({
            success: true,
            message: 'Avatar uploaded',
            avatarUrl: url,
            user: updated,
        });
    } catch (err) {
        next(err);
    }
};

// ─── DELETE AVATAR ────────────────────────────────────────────────────────────

export const deleteAvatar = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        if (!req.user?.userId) {
            res.status(401).json({ success: false, message: 'Unauthorized' });
            return;
        }

        const updated = await prisma.user.update({
            where: { id: req.user.userId },
            data: { avatar: null },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                avatar: true,
                bio: true,
            },
        });

        res.status(200).json({ success: true, message: 'Avatar removed', user: updated });
    } catch (err) {
        next(err);
    }
};
