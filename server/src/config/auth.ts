import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import prisma from './prisma';
import { env } from './env';

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: 'postgresql',
    }),
    secret: env.JWT_SECRET || 'better-auth-secret-key-at-least-32-chars-long',
    baseURL: process.env.BETTER_AUTH_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://zidio-intership-backend.vercel.app'),
    basePath: '/api/auth',
    emailAndPassword: {
        enabled: true,
        autoSignIn: true,
    },
    user: {
        additionalFields: {
            role: {
                type: 'string',
                defaultValue: 'member',
                required: false,
            },
            avatar: {
                type: 'string',
                required: false,
            },
            bio: {
                type: 'string',
                required: false,
            },
        },
    },
    trustedOrigins: [
        env.CLIENT_URL,
        'http://localhost:5173',
        'http://localhost:3000',
        'http://localhost:5000',
        'https://internship-zidio-2026-client.vercel.app',
        'https://zidio-intership-backend.vercel.app',
    ],
});

export type Auth = typeof auth;
