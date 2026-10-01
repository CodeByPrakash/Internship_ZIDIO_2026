import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../lib/axios';
import { useAuthStore } from '../store/auth.store';
import { connectSockets, disconnectSockets } from '../lib/socket';
import { authClient } from '../lib/auth-client';
import toast from 'react-hot-toast';

export const useLogin = () => {
    const setAuth = useAuthStore((s) => s.setAuth);
    return useMutation({
        mutationFn: async (data: { email: string; password: string }) => {
            // 1. Authenticate with Better Auth Client
            const result = await authClient.signIn.email({
                email: data.email,
                password: data.password,
            });

            if (result.error) {
                // Fallback to legacy/direct endpoint if needed
                const res = await api.post('/auth/login', data);
                return res.data;
            }

            // Sync user data
            const user = result.data?.user || {
                id: (result.data as any)?.session?.userId,
                email: data.email,
                name: (result.data as any)?.user?.name || 'User',
                role: (result.data as any)?.user?.role || 'member',
            };
            const token = (result.data as any)?.token || (result.data as any)?.session?.token || 'session-active';

            return { user, accessToken: token };
        },
        onSuccess: (data) => {
            setAuth(data.user, data.accessToken);
            connectSockets();
            toast.success('Welcome back to IntellMeet!');
        },
        onError: (err: any) => {
            toast.error(err.message || err.response?.data?.message || 'Login failed. Please verify credentials.');
        },
    });
};

export const useSignup = () => {
    const setAuth = useAuthStore((s) => s.setAuth);
    return useMutation({
        mutationFn: async (data: { name: string; email: string; password: string }) => {
            // 1. Sign up with Better Auth Client
            const result = await authClient.signUp.email({
                name: data.name,
                email: data.email,
                password: data.password,
            });

            if (result.error) {
                // Fallback to API endpoint
                const res = await api.post('/auth/signup', data);
                return res.data;
            }

            const user = result.data?.user || {
                name: data.name,
                email: data.email,
                role: 'member',
            };
            const token = (result.data as any)?.token || (result.data as any)?.session?.token || 'session-active';

            return { user, accessToken: token };
        },
        onSuccess: (data) => {
            setAuth(data.user, data.accessToken);
            connectSockets();
            toast.success('Account created successfully!');
        },
        onError: (err: any) => {
            toast.error(err.message || err.response?.data?.message || 'Signup failed');
        },
    });
};

export const useLogout = () => {
    const clearAuth = useAuthStore((s) => s.clearAuth);
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async () => {
            try {
                await authClient.signOut();
            } catch {
                await api.post('/auth/logout');
            }
        },
        onSuccess: () => {
            clearAuth();
            disconnectSockets();
            qc.clear();
            toast.success('Signed out safely');
        },
    });
};

export const useMe = () => {
    const accessToken = useAuthStore((s) => s.accessToken);
    const setUser = useAuthStore((s) => s.setUser);
    return useQuery({
        queryKey: ['me'],
        queryFn: async () => {
            try {
                const session = await authClient.getSession();
                if (session.data?.user) {
                    setUser(session.data.user as any);
                    return session.data.user;
                }
            } catch {
                // Fallback to standard endpoint
            }
            const res = await api.get('/auth/me');
            setUser(res.data.user);
            return res.data.user;
        },
        enabled: !!accessToken,
        retry: false,
    });
};
