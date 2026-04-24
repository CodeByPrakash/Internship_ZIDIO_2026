import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
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
        const user = await User.findById(req.user?.userId);
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
        const { name, bio } = req.body;

        const updated = await User.findByIdAndUpdate(
            req.user?.userId,
            { name, bio },
            { new: true, runValidators: true }
        );

        if (!updated) {
            res.status(404).json({ success: false, message: 'User not found' });
            return;
        }

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

        const user = await User.findById(req.user?.userId).select('+cloudinaryPublicId');
        if (!user) {
            res.status(404).json({ success: false, message: 'User not found' });
            return;
        }

        // Delete existing avatar from Cloudinary before uploading new one
        if (user.cloudinaryPublicId) {
            await cloudinaryDestroy(user.cloudinaryPublicId).catch((e) =>
                logger.warn(`Old avatar delete failed: ${e.message}`)
            );
        }

        const { url, publicId } = await cloudinaryUpload(req.file.buffer, {
            folder: 'intellmeet/avatars',
            public_id: `avatar_${user._id}`,
        });

        user.avatar = url;
        user.cloudinaryPublicId = publicId;
        await user.save({ validateBeforeSave: false });

        res.status(200).json({
            success: true,
            message: 'Avatar uploaded',
            avatarUrl: url,
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
        const user = await User.findById(req.user?.userId).select('+cloudinaryPublicId');
        if (!user) {
            res.status(404).json({ success: false, message: 'User not found' });
            return;
        }

        if (user.cloudinaryPublicId) {
            await cloudinaryDestroy(user.cloudinaryPublicId);
        }

        user.avatar = '';
        user.cloudinaryPublicId = undefined;
        await user.save({ validateBeforeSave: false });

        res.status(200).json({ success: true, message: 'Avatar removed' });
    } catch (err) {
        next(err);
    }
};
