import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '../store/auth.store';

const getToken = () => useAuthStore.getState().accessToken || '';

const BASE_URL = import.meta.env.VITE_API_URL || window.location.origin;

export const meetingSocket: Socket = io(`${BASE_URL}/meeting`, {
    autoConnect: false,
    transports: ['websocket', 'polling'],
});

export const notificationSocket: Socket = io(`${BASE_URL}/notification`, {
    autoConnect: false,
    transports: ['websocket', 'polling'],
});

export const connectSockets = () => {
    const token = getToken();
    if (!token) return;

    meetingSocket.auth = { token };
    notificationSocket.auth = { token };

    if (!meetingSocket.connected) meetingSocket.connect();
    if (!notificationSocket.connected) notificationSocket.connect();
};

export const disconnectSockets = () => {
    meetingSocket.disconnect();
    notificationSocket.disconnect();
};
