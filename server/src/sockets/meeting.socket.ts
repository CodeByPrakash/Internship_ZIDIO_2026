import { Server, Socket, Namespace } from 'socket.io';
import logger from '../utils/logger';

interface PeerInfo {
    socketId: string;
    userId: string;
    name: string;
}

interface RoomMap {
    [roomId: string]: Map<string, PeerInfo>; // socketId -> PeerInfo
}

const rooms: RoomMap = {};

export const registerMeetingSocketHandlers = (_io: Server, socket: Socket): void => {
    const userId = socket.data.userId as string;
    const nsp: Namespace = socket.nsp; // The /meeting namespace

    // ─── Join Room ─────────────────────────────────────────────────────────────
    socket.on('join-room', (data: { roomId: string; userName?: string }) => {
        const roomId = typeof data === 'string' ? data : data.roomId;
        const userName = typeof data === 'string' ? 'User' : (data.userName || 'User');
        if (!roomId) return;

        socket.join(roomId);

        if (!rooms[roomId]) rooms[roomId] = new Map();
        const peerInfo: PeerInfo = { socketId: socket.id, userId, name: userName };
        rooms[roomId].set(socket.id, peerInfo);

        // Send list of all existing peers (with info) to the new joiner
        const existingPeers = [...rooms[roomId].values()].filter(
            (p) => p.socketId !== socket.id
        );
        socket.emit('existing-participants', existingPeers);

        // Notify others in room about the new user
        socket.to(roomId).emit('user-connected', peerInfo);

        logger.info(`User ${userName} (${userId}) joined room ${roomId}. Total: ${rooms[roomId].size}`);
    });

    // ─── WebRTC Signaling — relay via namespace, NOT root io ──────────────────

    // Offer: caller → callee
    socket.on('offer', (payload: { to: string; offer: RTCSessionDescriptionInit }) => {
        nsp.to(payload.to).emit('offer', {
            from: socket.id,
            offer: payload.offer,
        });
    });

    // Answer: callee → caller
    socket.on('answer', (payload: { to: string; answer: RTCSessionDescriptionInit }) => {
        nsp.to(payload.to).emit('answer', {
            from: socket.id,
            answer: payload.answer,
        });
    });

    // ICE candidates
    socket.on(
        'ice-candidate',
        (payload: { to: string; candidate: RTCIceCandidateInit }) => {
            nsp.to(payload.to).emit('ice-candidate', {
                from: socket.id,
                candidate: payload.candidate,
            });
        }
    );

    // Media toggle (mute/cam) — broadcast to room
    socket.on(
        'media-toggle',
        (payload: { roomId?: string; type: 'audio' | 'video'; enabled: boolean }) => {
            // Broadcast to all rooms this socket is in
            for (const roomId of Object.keys(rooms)) {
                if (rooms[roomId].has(socket.id)) {
                    socket.to(roomId).emit('media-toggle', {
                        socketId: socket.id,
                        userId,
                        ...payload,
                    });
                }
            }
        }
    );

    // Chat message relay within room (simple version)
    socket.on('send-message', (payload: { roomId: string; sender: string; text: string; time: string }) => {
        socket.to(payload.roomId).emit('chat-message', {
            sender: payload.sender,
            text: payload.text,
            time: payload.time,
        });
    });

    // ─── Disconnect ────────────────────────────────────────────────────────────
    socket.on('disconnect', () => {
        for (const roomId of Object.keys(rooms)) {
            if (rooms[roomId].has(socket.id)) {
                const info = rooms[roomId].get(socket.id);
                rooms[roomId].delete(socket.id);
                socket.to(roomId).emit('user-disconnected', {
                    socketId: socket.id,
                    userId,
                    name: info?.name,
                });
                logger.info(
                    `User ${info?.name} (${userId}) left room ${roomId}. Remaining: ${rooms[roomId].size}`
                );
                if (rooms[roomId].size === 0) delete rooms[roomId];
            }
        }
    });
};
