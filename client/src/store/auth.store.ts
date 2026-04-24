import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
    _id: string;
    name: string;
    email: string;
    role: 'admin' | 'member';
    avatar?: string;
    createdAt: string;
}

interface AuthState {
    user: User | null;
    accessToken: string | null;
    setAuth: (user: User, accessToken: string) => void;
    setAccessToken: (token: string) => void;
    clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            accessToken: null,

            setAuth: (user, accessToken) => set({ user, accessToken }),

            setAccessToken: (token) => set({ accessToken: token }),

            clearAuth: () => set({ user: null, accessToken: null }),
        }),
        {
            name: 'intellmeet-auth',
            // Only persist user data, NOT the access token (security)
            partialize: (state) => ({ user: state.user }),
        }
    )
);
