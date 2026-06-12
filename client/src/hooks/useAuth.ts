import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../lib/axios';
import { useAuthStore } from '../store/auth.store';
import { connectSockets, disconnectSockets } from '../lib/socket';
import toast from 'react-hot-toast';

export const useLogin = () => {
    const setAuth = useAuthStore((s) => s.setAuth);
    return useMutation({
        mutationFn: async (data: { email: string; password: string }) => {
            const res = await api.post('/auth/login', data);
            return res.data;
        },
        onSuccess: (data) => {
            setAuth(data.user, data.accessToken);
            connectSockets();
            toast.success('Welcome back!');
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || 'Login failed');
        },
    });
};

export const useSignup = () => {
    const setAuth = useAuthStore((s) => s.setAuth);
    return useMutation({
        mutationFn: async (data: { name: string; email: string; password: string }) => {
            const res = await api.post('/auth/signup', data);
            return res.data;
        },
        onSuccess: (data) => {
            setAuth(data.user, data.accessToken);
            connectSockets();
            toast.success('Account created!');
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || 'Signup failed');
        },
    });
};

export const useLogout = () => {
    const clearAuth = useAuthStore((s) => s.clearAuth);
    const qc = useQueryClient();
    return useMutation({
        mutationFn: () => api.post('/auth/logout'),
        onSuccess: () => {
            clearAuth();
            disconnectSockets();
            qc.clear();
            toast.success('Logged out');
        },
    });
};

export const useMe = () => {
    const accessToken = useAuthStore((s) => s.accessToken);
    const setUser = useAuthStore((s) => s.setUser);
    return useQuery({
        queryKey: ['me'],
        queryFn: async () => {
            const res = await api.get('/auth/me');
            setUser(res.data.user);
            return res.data.user;
        },
        enabled: !!accessToken,
        retry: false,
    });
};
