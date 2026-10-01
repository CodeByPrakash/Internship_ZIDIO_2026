import Redis from 'ioredis';
import { env } from './env';
import logger from '../utils/logger';

// Track whether Redis is available
export let redisAvailable = false;

const createRedisClient = (label = 'redis') => {
    const client = new Redis(env.REDIS_URL || 'redis://localhost:6379', {
        maxRetriesPerRequest: null,
        lazyConnect: true,
        retryStrategy: (times) => {
            if (times > 3) {
                logger.error(`${label}: max retries reached — giving up`);
                return null;
            }
            return Math.min(times * 200, 2000);
        },
    });

    client.on('error', () => {}); // Suppress unhandled error events
    return client;
};

// These are created lazily only when Redis is enabled
let _redisClient: Redis | null = null;
let _pubClient: Redis | null = null;
let _subClient: Redis | null = null;

export const connectRedis = async (): Promise<void> => {
    if (!env.REDIS_URL) {
        logger.warn('⚠️  REDIS_URL not set — running without Redis (no caching, single-instance sockets)');
        return;
    }

    try {
        _redisClient = createRedisClient('cache');
        _pubClient = createRedisClient('pub');
        _subClient = createRedisClient('sub');

        await Promise.all([
            _redisClient.connect(),
            _pubClient.connect(),
            _subClient.connect(),
        ]);
        redisAvailable = true;
        logger.info('✅ All Redis connections established');
    } catch (err) {
        logger.warn(`⚠️  Redis connection failed — running without Redis: ${err}`);
        redisAvailable = false;
        try { _redisClient?.disconnect(); } catch {}
        try { _pubClient?.disconnect(); } catch {}
        try { _subClient?.disconnect(); } catch {}
        _redisClient = null;
        _pubClient = null;
        _subClient = null;
    }
};

// Safe getters — return null when Redis unavailable
export const getRedisClient = () => _redisClient;
export const pubClient = _pubClient;
export const subClient = _subClient;

// Default export — provides a safe wrapper that no-ops when Redis is unavailable
const noopClient = {
    get: async () => null,
    setex: async () => 'OK',
    del: async () => 0,
    keys: async () => [] as string[],
} as unknown as Redis;

export default new Proxy(noopClient, {
    get(_target, prop) {
        if (_redisClient && redisAvailable) {
            return (_redisClient as any)[prop];
        }
        return (noopClient as any)[prop];
    },
});
