import { Socket } from 'socket.io';
import prisma from '../config/prisma';
import logger from '../utils/logger';

export const registerChatSocketHandlers = (socket: Socket): void => {
    const userId = socket.data.userId as string;

    socket.on('send-message', async (data: { meetingId: string; content: string; type?: string }) => {
        try {
            // Find meeting by id or roomId
            const meeting = await prisma.meeting.findFirst({
                where: { OR: [{ id: data.meetingId }, { roomId: data.meetingId }] },
            });

            if (!meeting) return;

            const message = await prisma.message.create({
                data: {
                    meetingId: meeting.id,
                    senderId: userId,
                    content: data.content,
                    type: data.type || 'text',
                },
                include: {
                    sender: { select: { id: true, name: true, avatar: true } },
                },
            });

            // Broadcast to room
            socket.to(data.meetingId).emit('new-message', message);
            socket.emit('new-message', message);
        } catch (err) {
            logger.error(`Chat message save failed: ${err}`);
        }
    });

    socket.on('typing-start', (roomId: string) => {
        socket.to(roomId).emit('typing-start', { userId, socketId: socket.id });
    });

    socket.on('typing-stop', (roomId: string) => {
        socket.to(roomId).emit('typing-stop', { userId, socketId: socket.id });
    });
};
