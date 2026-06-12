import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';
import { env } from '../config/env';

interface AppError extends Error {
    statusCode?: number;
    code?: number;
    keyValue?: Record<string, unknown>;
    path?: string;
    value?: string;
    errors?: Record<string, { message: string }>;
}

/**
 * notFound — 404 handler for unmatched routes
 */
export const notFound = (req: Request, _res: Response, next: NextFunction): void => {
    const error = new Error(`Not Found - ${req.method} ${req.originalUrl}`) as AppError;
    error.statusCode = 404;
    next(error);
};

/**
 * errorHandler — global centralized error handler
 */
export const errorHandler = (
    err: AppError,
    _req: Request,
    res: Response,
    _next: NextFunction
): void => {
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';

    // Mongoose duplicate key (e.g. duplicate email)
    if (err.code === 11000 && err.keyValue) {
        statusCode = 409;
        const field = Object.keys(err.keyValue)[0];
        message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
    }

    // Mongoose cast error (invalid ObjectId)
    if (err.name === 'CastError') {
        statusCode = 400;
        message = `Invalid value for field: ${err.path}`;
    }

    // Mongoose validation error
    if (err.name === 'ValidationError' && err.errors) {
        statusCode = 400;
        message = Object.values(err.errors)
            .map((e) => e.message)
            .join(', ');
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        statusCode = 401;
        message = 'Invalid token';
    }
    if (err.name === 'TokenExpiredError') {
        statusCode = 401;
        message = 'Token expired';
    }

    logger.error(`${statusCode} - ${message}`);

    res.status(statusCode).json({
        success: false,
        message,
        ...(env.NODE_ENV === 'development' && { stack: err.stack }),
    });
};
