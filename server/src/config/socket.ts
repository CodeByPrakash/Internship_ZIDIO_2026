import http from 'http';
import { Server } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { pubClient, subClient } from './redis';
import { verifyAccessToken } from '../utils/jwt';
import { registerMeetingSocketHandlers } from '../sockets/meeting.socket';
import { env } from './env';
import logger from '../utils/logger';

/**
 * createSocketServer — attaches Socket.io to an http.Server
 * Returns the io instance for use elsewhere (e.g. emitting from controllers)
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

    // ─── Redis Adapter (horizontal scaling) ────────────────────────────────────
    io.adapter(createAdapter(pubClient, subClient));
    logger.info('⚡ Socket.io Redis adapter attached');

    // ─── JWT Auth Middleware ───────────────────────────────────────────────────
    io.use((socket, next) => {
        const token =
            (socket.handshake.auth?.token as string) ||
            (socket.handshake.headers?.authorization?.split(' ')[1] ?? '');

        if (!token) {
            return next(new Error('Authentication error: no token'));
        }

        try {
            const decoded = verifyAccessToken(token);
            socket.data.userId = decoded.userId;
            socket.data.role = decoded.role;
            next();
        } catch {
            next(new Error('Authentication error: invalid token'));
        }
    });

    // ─── /meeting Namespace ────────────────────────────────────────────────────
    const meetingNs = io.of('/meeting');

    // Apply same JWT middleware to namespace
    meetingNs.use((socket, next) => {
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
    });

    meetingNs.on('connection', (socket) => {
        logger.info(`🎥 Meeting socket connected: ${socket.id} (user: ${socket.data.userId})`);
        registerMeetingSocketHandlers(io as unknown as Server, socket);

        socket.on('disconnect', (reason) => {
            logger.info(`🔌 Meeting socket disconnected: ${socket.id} — ${reason}`);
        });
    });

    // ─── /notification Namespace (Day 6 placeholder) ───────────────────────────
    const notifNs = io.of('/notification');

    notifNs.use((socket, next) => {
        const token = socket.handshake.auth?.token as string;
        if (!token) return next(new Error('Authentication error: no token'));
        try {
            const decoded = verifyAccessToken(token);
            socket.data.userId = decoded.userId;
            next();
        } catch {
            next(new Error('Authentication error: invalid token'));
        }
    });

    notifNs.on('connection', (socket) => {
        logger.info(`🔔 Notification socket connected: ${socket.id} (user: ${socket.data.userId})`);
        // Day 6: real-time notification events go here
    });

    logger.info('✅ Socket.io server configured with /meeting and /notification namespaces');
    return io;
};
