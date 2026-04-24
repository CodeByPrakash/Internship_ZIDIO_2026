import dotenv from 'dotenv';
dotenv.config();

function getEnv(key: string, fallback?: string): string {
    const value = process.env[key] ?? fallback;
    if (!value) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
    return value;
}

function getOptionalEnv(key: string, fallback = ''): string {
    return process.env[key] ?? fallback;
}

export const env = {
    PORT: parseInt(process.env.PORT || '5000', 10),
    NODE_ENV: process.env.NODE_ENV || 'development',

    MONGO_URI: getEnv('MONGO_URI'),

    JWT_SECRET: getEnv('JWT_SECRET'),
    JWT_REFRESH_SECRET: getEnv('JWT_REFRESH_SECRET'),
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '15m',
    JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d',

    CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
    COOKIE_SECRET: process.env.COOKIE_SECRET || 'fallback_cookie_secret',

    // Redis
    REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',

    // Cloudinary (optional in dev — avatar upload disabled if not set)
    CLOUDINARY_CLOUD_NAME: getOptionalEnv('CLOUDINARY_CLOUD_NAME'),
    CLOUDINARY_API_KEY: getOptionalEnv('CLOUDINARY_API_KEY'),
    CLOUDINARY_API_SECRET: getOptionalEnv('CLOUDINARY_API_SECRET'),
};
