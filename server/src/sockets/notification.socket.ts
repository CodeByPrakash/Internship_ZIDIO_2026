import { Server, Socket } from 'socket.io';
import logger from '../utils/logger';

export const registerNotificationSocketHandlers = (io: Server, socket: Socket): void => {
    const userId = socket.data.userId as string;

    // Join user-specific room for targeted notifications
    socket.join(`user:${userId}`);
    logger.info(`User ${userId} joined notification room`);

    socket.on('disconnect', () => {
        socket.leave(`user:${userId}`);
    });
};

// Helper: emit notification to specific user
export const emitNotification = (io: Server, userId: string, notification: Record<string, unknown>): void => {
    io.of('/notification').to(`user:${userId}`).emit('notify', notification);
};
