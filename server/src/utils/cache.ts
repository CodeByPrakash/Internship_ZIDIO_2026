import redisClient from '../config/redis';
import logger from './logger';

const DEFAULT_TTL = 300; // 5 minutes

/**
 * cacheGet — retrieve a cached value; returns null on miss or error
 */
export const cacheGet = async <T>(key: string): Promise<T | null> => {
    try {
        const data = await redisClient.get(key);
        if (!data) return null;
        return JSON.parse(data) as T;
    } catch (err) {
        logger.warn(`Cache GET failed for key "${key}": ${err}`);
        return null;
    }
};

/**
 * cacheSet — store a JSON-serializable value with optional TTL
 */
export const cacheSet = async <T>(
    key: string,
    value: T,
    ttlSeconds = DEFAULT_TTL
): Promise<void> => {
    try {
        await redisClient.setex(key, ttlSeconds, JSON.stringify(value));
    } catch (err) {
        logger.warn(`Cache SET failed for key "${key}": ${err}`);
    }
};

/**
 * cacheDel — invalidate a cached key
 */
export const cacheDel = async (key: string): Promise<void> => {
    try {
        await redisClient.del(key);
    } catch (err) {
        logger.warn(`Cache DEL failed for key "${key}": ${err}`);
    }
};

/**
 * cacheDelPattern — invalidate all keys matching a glob pattern
 * e.g. cacheDel('meetings:user:*')
 */
export const cacheDelPattern = async (pattern: string): Promise<void> => {
    try {
        const keys = await redisClient.keys(pattern);
        if (keys.length > 0) {
            await redisClient.del(...keys);
        }
    } catch (err) {
        logger.warn(`Cache DEL pattern "${pattern}" failed: ${err}`);
    }
};
