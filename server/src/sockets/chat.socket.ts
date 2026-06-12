import { Socket } from 'socket.io';
import Message from '../models/Message';
import logger from '../utils/logger';

export const registerChatSocketHandlers = (socket: Socket): void => {
    const userId = socket.data.userId as string;

    socket.on('send-message', async (data: { meetingId: string; content: string; type?: string }) => {
        try {
            const message = await Message.create({
                meeting: data.meetingId,
                sender: userId,
                content: data.content,
                type: data.type || 'text',
            });

            const populated = await message.populate('sender', 'name avatar');

            // Broadcast to room
            socket.to(data.meetingId).emit('new-message', populated);
            socket.emit('new-message', populated);
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

    socket.on('message-read', async (data: { messageId: string }) => {
        try {
            await Message.findByIdAndUpdate(data.messageId, {
                $addToSet: { readBy: { user: userId, readAt: new Date() } },
            });
        } catch (err) {
            logger.error(`Read receipt failed: ${err}`);
        }
    });
};
