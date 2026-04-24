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
import { notFound, errorHandler } from './middleware/error.middleware';

const app = express();

// ─── Security & Parsing Middleware ────────────────────────────────────────────

app.use(helmet());
app.use(
    cors({
        origin: env.CLIENT_URL,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser(env.COOKIE_SECRET));
app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// ─── Health Check ─────────────────────────────────────────────────────────────

app.get('/health', (_req, res) => {
    res.status(200).json({
        status: 'ok',
        environment: env.NODE_ENV,
        timestamp: new Date().toISOString(),
        service: 'IntellMeet API',
        version: '1.0.0',
    });
});

// ─── API Routes ───────────────────────────────────────────────────────────────

app.use('/api', apiLimiter);          // Global 100 req/15min
app.use('/api/auth', authRoutes);     // auth limiter applied per-route inside
app.use('/api/users', userRoutes);
app.use('/api/meetings', meetingRoutes);

// ─── 404 & Error Handlers ────────────────────────────────────────────────────

app.use(notFound);
app.use(errorHandler);

// ─── HTTP Server + Socket.io ──────────────────────────────────────────────────

const httpServer = http.createServer(app);
const io = createSocketServer(httpServer);

// Make io available on app for controller use if needed
app.set('io', io);

// ─── Start ────────────────────────────────────────────────────────────────────

const startServer = async () => {
    await connectDB();

    // Redis connection (non-fatal: app degrades gracefully without cache)
    try {
        await connectRedis();
    } catch (err) {
        logger.warn(`⚠️  Redis unavailable — caching disabled: ${err}`);
    }

    httpServer.listen(env.PORT, () => {
        logger.info(`🚀 IntellMeet Server running on port ${env.PORT} [${env.NODE_ENV}]`);
        logger.info(`📡 API: http://localhost:${env.PORT}/api`);
        logger.info(`🔌 WebSocket: ws://localhost:${env.PORT}`);
        logger.info(`❤️  Health: http://localhost:${env.PORT}/health`);
    });
};

startServer();

export { io };
export default app;
