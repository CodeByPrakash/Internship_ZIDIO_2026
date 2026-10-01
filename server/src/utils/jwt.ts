import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export interface JwtPayload {
    userId: string;
    role: string;
}

export interface RefreshPayload {
    userId: string;
}

export const generateAccessToken = (userId: string, role: string): string => {
    return jwt.sign({ userId, role } as JwtPayload, env.JWT_SECRET, {
        expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
    });
};

export const generateRefreshToken = (userId: string): string => {
    return jwt.sign({ userId } as RefreshPayload, env.JWT_REFRESH_SECRET, {
        expiresIn: env.JWT_REFRESH_EXPIRES_IN as jwt.SignOptions['expiresIn'],
    });
};

export const verifyAccessToken = (token: string): JwtPayload => {
    return jwt.verify(token, env.JWT_SECRET) as JwtPayload;
};

export const verifyRefreshToken = (token: string): RefreshPayload => {
    return jwt.verify(token, env.JWT_REFRESH_SECRET) as RefreshPayload;
};
