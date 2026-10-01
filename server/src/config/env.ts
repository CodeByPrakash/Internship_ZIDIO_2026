import dotenv from 'dotenv';
dotenv.config();

function getOptionalEnv(key: string, fallback = ''): string {
    return process.env[key] ?? fallback;
}

export const env = {
    PORT: parseInt(process.env.PORT || '5000', 10),
    NODE_ENV: process.env.NODE_ENV || 'development',

    DATABASE_URL: process.env.DATABASE_URL,

    JWT_SECRET: process.env.JWT_SECRET || '54a86a361835fa95541dcc7174ea46dc8a9e6e14a9ddcb77662f06077d5221b117f3e7d57a2423e7b9499b457f1d2a4670b3733450ba7b80d53fcee73275b4a7',
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || '905943092b3ab2748b505b6d0923433334e130319f5c8eec5df1fdf3600176541471ce6f707ea3ddb5c8bbe8e92eeeb95636d8518dc1d7765fb96b8e2d7d03d6',
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '15m',
    JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d',

    CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
    COOKIE_SECRET: process.env.COOKIE_SECRET || '3013872f10dbdb677c2d44b874271133be5a939aa7dda7c293173adbe1566d09',

    // Redis
    REDIS_URL: getOptionalEnv('REDIS_URL'),

    // Cloudinary (optional in dev — avatar upload disabled if not set)
    CLOUDINARY_CLOUD_NAME: getOptionalEnv('CLOUDINARY_CLOUD_NAME'),
    CLOUDINARY_API_KEY: getOptionalEnv('CLOUDINARY_API_KEY'),
    CLOUDINARY_API_SECRET: getOptionalEnv('CLOUDINARY_API_SECRET'),
};

