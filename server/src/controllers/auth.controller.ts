import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken,
} from '../utils/jwt';
import logger from '../utils/logger';
import { env } from '../config/env';

const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
};

// ─── SIGNUP ──────────────────────────────────────────────────────────────────
export const signup = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { name, email, password } = req.body;

        // Check for existing user
        const existing = await User.findOne({ email });
        if (existing) {
            res.status(409).json({ success: false, message: 'Email already registered' });
            return;
        }

        const user = await User.create({ name, email, password });

        const accessToken = generateAccessToken(user.id, user.role);
        const refreshToken = generateRefreshToken(user.id);

        // Store hashed refresh token in DB
        user.refreshToken = await bcrypt.hash(refreshToken, 10);
        await user.save({ validateBeforeSave: false });

        res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);

        logger.info(`New user registered: ${email}`);
        res.status(201).json({
            success: true,
            message: 'Account created successfully',
            accessToken,
            user,
        });
    } catch (err) {
        next(err);
    }
};

// ─── LOGIN ────────────────────────────────────────────────────────────────────
export const login = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { email, password } = req.body;

        // Select password field explicitly (it's select: false in schema)
        const user = await User.findOne({ email }).select('+password');
        if (!user || !user.isActive) {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
            return;
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
            return;
        }

        const accessToken = generateAccessToken(user.id, user.role);
        const refreshToken = generateRefreshToken(user.id);

        // Rotate refresh token (invalidate old)
        user.refreshToken = await bcrypt.hash(refreshToken, 10);
        await user.save({ validateBeforeSave: false });

        res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);

        logger.info(`User logged in: ${email}`);
        res.status(200).json({
            success: true,
            message: 'Login successful',
            accessToken,
            user,
        });
    } catch (err) {
        next(err);
    }
};

// ─── REFRESH TOKEN ────────────────────────────────────────────────────────────
export const refresh = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const token = req.cookies?.refreshToken;
        if (!token) {
            res.status(401).json({ success: false, message: 'No refresh token' });
            return;
        }

        const decoded = verifyRefreshToken(token);

        const user = await User.findById(decoded.userId).select('+refreshToken');
        if (!user || !user.refreshToken) {
            res.status(401).json({ success: false, message: 'Invalid refresh token' });
            return;
        }

        // Validate stored hash matches incoming token
        const isValid = await bcrypt.compare(token, user.refreshToken);
        if (!isValid) {
            res.status(401).json({ success: false, message: 'Refresh token mismatch' });
            return;
        }

        // Rotate: issue new pair
        const newAccessToken = generateAccessToken(user.id, user.role);
        const newRefreshToken = generateRefreshToken(user.id);

        user.refreshToken = await bcrypt.hash(newRefreshToken, 10);
        await user.save({ validateBeforeSave: false });

        res.cookie('refreshToken', newRefreshToken, COOKIE_OPTIONS);

        res.status(200).json({
            success: true,
            accessToken: newAccessToken,
        });
    } catch (err) {
        next(err);
    }
};

// ─── LOGOUT ───────────────────────────────────────────────────────────────────
export const logout = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const userId = req.user?.userId;
        if (userId) {
            await User.findByIdAndUpdate(userId, { refreshToken: undefined });
        }

        res.clearCookie('refreshToken');
        res.status(200).json({ success: true, message: 'Logged out successfully' });
    } catch (err) {
        next(err);
    }
};

// ─── GET ME ────────────────────────────────────────────────────────────────────
export const getMe = async (
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
