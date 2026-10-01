import { createAuthClient } from 'better-auth/react';

const DEFAULT_BACKEND = import.meta.env.PROD
    ? 'https://internship-zidio-2026.onrender.com'
    : 'http://localhost:5000';

export const authClient = createAuthClient({
    baseURL: import.meta.env.VITE_API_URL || DEFAULT_BACKEND,
});

export const {
    signIn,
    signUp,
    signOut,
    useSession,
    getSession,
} = authClient;
