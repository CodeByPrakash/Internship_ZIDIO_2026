import 'dotenv/config';
import http from 'http';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

import { env } from './config/env';
import connectDB from './config/db';
import { connectRedis } from './config/redis';
import { createSocketServer } from './config/socket';
import logger from './utils/logger';
import { apiLimiter } from './middleware/rateLimit.middleware';

import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import meetingRoutes from './routes/meeting.routes';
import chatRoutes from './routes/chat.routes';
import notificationRoutes from './routes/notification.routes';
import aiRoutes from './routes/ai.routes';
import workspaceRoutes from './routes/workspace.routes';
import { notFound, errorHandler } from './middleware/error.middleware';

import { toNodeHandler } from 'better-auth/node';
import { auth } from './config/auth';

const app = express();

const allowedOrigins = [
    env.CLIENT_URL,
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:5000',
    'https://internship-zidio-2026-client.vercel.app',
    'https://zidio-intership-backend.vercel.app',
];

const corsOptions: cors.CorsOptions = {
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (
            allowedOrigins.includes(origin) ||
            origin.endsWith('.vercel.app') ||
            origin.includes('localhost')
        ) {
            return callback(null, true);
        }
        return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'X-Requested-With', 'Accept'],
    exposedHeaders: ['Set-Cookie'],
};

// ─── Security Middleware ──────────────────────────────────────────────────────

app.use(
    helmet({
        crossOriginResourcePolicy: false,
    })
);
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));


// ─── Parsing & Logging Middleware ─────────────────────────────────────────────

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser(env.COOKIE_SECRET));
app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// ─── Health & Root Checks ───────────────────────────────────────────────────

app.get(['/', '/health', '/api/health'], (_req, res) => {
    res.status(200).json({
        status: 'ok',
        environment: env.NODE_ENV,
        timestamp: new Date().toISOString(),
        service: 'IntellMeet Backend API',
        version: '1.0.0',
    });
});

app.get('/favicon.ico', (_req, res) => {
    res.status(204).end();
});

// ─── REST API Routes ──────────────────────────────────────────────────────────

app.use('/api', apiLimiter);          // Global 100 req/15min
app.use('/api/auth', authRoutes);     // Custom REST auth: /login, /signup, /refresh, /logout, /me

// ─── Better Auth Native Handler (Mounted for Better Auth endpoints) ───────────

app.all('/api/auth/*', toNodeHandler(auth));

app.use('/api/users', userRoutes);
app.use('/api/meetings', meetingRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/workspaces', workspaceRoutes);


// ─── 404 & Error Handlers ────────────────────────────────────────────────────

app.use(notFound);
app.use(errorHandler);

// ─── HTTP Server + Socket.io ──────────────────────────────────────────────────

const httpServer = http.createServer(app);
const io = createSocketServer(httpServer);

// ─── Startup Sequence ────────────────────────────────────────────────────────

const startServer = async () => {
    try {
        // 1. Connect Neon PostgreSQL
        await connectDB();

        // 2. Connect Redis (optional caching / scaling)
        await connectRedis();
    } catch (err) {
        logger.warn(`Startup initialization warning: ${err}`);
    }

    // 3. Start HTTP Server (in standalone Node.js environments)
    if (!process.env.VERCEL) {
        httpServer.listen(env.PORT, () => {
            logger.info(`🚀 IntellMeet Server running on port ${env.PORT} [${env.NODE_ENV}]`);
            logger.info(`📡 API: http://localhost:${env.PORT}/api`);
            logger.info(`🔌 WebSocket: ws://localhost:${env.PORT}`);
            logger.info(`❤️  Health: http://localhost:${env.PORT}/health`);
        });
    }
};

// Handle unhandled rejections
process.on('unhandledRejection', (err: Error) => {
    logger.error(`Unhandled Rejection: ${err.message}`);
    if (!process.env.VERCEL) {
        httpServer.close(() => process.exit(1));
    }
});

// Handle uncaught exceptions
process.on('uncaughtException', (err: Error) => {
    logger.error(`Uncaught Exception: ${err.message}`);
    if (!process.env.VERCEL) {
        process.exit(1);
    }
});

startServer();

export { app, io, httpServer };
export default app;

