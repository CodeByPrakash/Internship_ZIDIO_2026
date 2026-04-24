import { Server, Socket } from 'socket.io';
import logger from '../utils/logger';

interface RoomMap {
    [roomId: string]: Set<string>; // roomId -> Set of socketIds
}

const rooms: RoomMap = {};

export const registerMeetingSocketHandlers = (io: Server, socket: Socket): void => {
    const userId = socket.data.userId as string;

    // ─── Join Room ─────────────────────────────────────────────────────────────
    socket.on('join-room', (roomId: string) => {
        if (!roomId) return;

        socket.join(roomId);

        if (!rooms[roomId]) rooms[roomId] = new Set();
        rooms[roomId].add(socket.id);

        // Send existing participants list to the new joiner
        const existingParticipants = [...rooms[roomId]].filter(
            (id) => id !== socket.id
        );
        socket.emit('existing-participants', existingParticipants);

        // Notify others in the room
        socket.to(roomId).emit('user-connected', {
            socketId: socket.id,
            userId,
        });

        logger.info(`User ${userId} joined room ${roomId}. Total: ${rooms[roomId].size}`);

        // ─── WebRTC Signaling Relay ───────────────────────────────────────────

        // Offer: caller → callee
        socket.on('offer', (payload: { to: string; offer: RTCSessionDescriptionInit }) => {
            io.to(payload.to).emit('offer', {
                from: socket.id,
                offer: payload.offer,
            });
        });

        // Answer: callee → caller
        socket.on('answer', (payload: { to: string; answer: RTCSessionDescriptionInit }) => {
            io.to(payload.to).emit('answer', {
                from: socket.id,
                answer: payload.answer,
            });
        });

        // ICE candidates: relay between peers
        socket.on(
            'ice-candidate',
            (payload: { to: string; candidate: RTCIceCandidateInit }) => {
                io.to(payload.to).emit('ice-candidate', {
                    from: socket.id,
                    candidate: payload.candidate,
                });
            }
        );

        // User toggle events (mute/cam) — broadcast to room
        socket.on(
            'media-toggle',
            (payload: { type: 'audio' | 'video'; enabled: boolean }) => {
                socket.to(roomId).emit('media-toggle', {
                    socketId: socket.id,
                    userId,
                    ...payload,
                });
            }
        );
    });

    // ─── Disconnect ────────────────────────────────────────────────────────────
    socket.on('disconnect', () => {
        // Remove socket from all rooms it was in
        for (const roomId of Object.keys(rooms)) {
            if (rooms[roomId].has(socket.id)) {
                rooms[roomId].delete(socket.id);
                socket.to(roomId).emit('user-disconnected', {
                    socketId: socket.id,
                    userId,
                });
                logger.info(
                    `User ${userId} left room ${roomId}. Remaining: ${rooms[roomId].size}`
                );
                // Clean up empty rooms
                if (rooms[roomId].size === 0) delete rooms[roomId];
            }
        }
    });
};
