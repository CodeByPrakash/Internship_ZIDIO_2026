import http from 'http';
import { Server } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { redisAvailable, getRedisClient } from './redis';
import { verifyAccessToken } from '../utils/jwt';
import { registerMeetingSocketHandlers } from '../sockets/meeting.socket';
import { registerChatSocketHandlers } from '../sockets/chat.socket';
import { registerNotificationSocketHandlers } from '../sockets/notification.socket';
import { env } from './env';
import logger from '../utils/logger';

/**
 * createSocketServer — attaches Socket.io to an http.Server
 */
export const createSocketServer = (httpServer: http.Server): Server => {
    const io = new Server(httpServer, {
        cors: {
            origin: env.CLIENT_URL,
            methods: ['GET', 'POST'],
            credentials: true,
        },
        pingTimeout: 60000,
        pingInterval: 25000,
    });

    // ─── Redis Adapter (only if Redis is connected) ──────────────────────────
    if (redisAvailable) {
        try {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const redis = require('./redis');
            if (redis.pubClient && redis.subClient) {
                io.adapter(createAdapter(redis.pubClient, redis.subClient));
                logger.info('Socket.io Redis adapter attached');
            }
        } catch {
            logger.warn('Socket.io Redis adapter failed — single-instance mode');
        }
    } else {
        logger.warn('Socket.io running without Redis adapter (single-instance mode)');
    }

    // ─── JWT Auth Middleware ───────────────────────────────────────────────────
    const authMiddleware = (socket: any, next: any) => {
        const token =
            (socket.handshake.auth?.token as string) ||
            (socket.handshake.headers?.authorization?.split(' ')[1] ?? '');

        if (!token) return next(new Error('Authentication error: no token'));

        try {
            const decoded = verifyAccessToken(token);
            socket.data.userId = decoded.userId;
            socket.data.role = decoded.role;
            next();
        } catch {
            next(new Error('Authentication error: invalid token'));
        }
    };

    // Apply auth to default namespace
    io.use(authMiddleware);

    // ─── /meeting Namespace ────────────────────────────────────────────────────
    const meetingNs = io.of('/meeting');
    meetingNs.use(authMiddleware);

    meetingNs.on('connection', (socket) => {
        logger.info(`🎥 Meeting socket connected: ${socket.id} (user: ${socket.data.userId})`);
        registerMeetingSocketHandlers(io as unknown as Server, socket);
        registerChatSocketHandlers(socket);

        socket.on('disconnect', (reason) => {
            logger.info(`🔌 Meeting socket disconnected: ${socket.id} — ${reason}`);
        });
    });

    // ─── /notification Namespace ───────────────────────────────────────────────
    const notifNs = io.of('/notification');
    notifNs.use(authMiddleware);

    notifNs.on('connection', (socket) => {
        logger.info(`Notification socket connected: ${socket.id} (user: ${socket.data.userId})`);
        registerNotificationSocketHandlers(io as unknown as Server, socket);
    });

    logger.info('Socket.io server configured with /meeting and /notification namespaces');
    return io;
};
