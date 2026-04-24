import Redis from 'ioredis';
import { env } from './env';
import logger from '../utils/logger';

const createRedisClient = () => {
    const client = new Redis(env.REDIS_URL, {
        maxRetriesPerRequest: null,
        lazyConnect: true,
        retryStrategy: (times) => {
            if (times > 10) {
                logger.error('Redis: max retries reached');
                return null; // Stop retrying
            }
            const delay = Math.min(times * 200, 3000);
            logger.warn(`Redis: retrying in ${delay}ms (attempt ${times})`);
            return delay;
        },
    });

    client.on('connect', () => logger.info('✅ Redis connected'));
    client.on('ready', () => logger.info('⚡ Redis ready'));
    client.on('error', (err) => logger.error(`❌ Redis error: ${err.message}`));
    client.on('close', () => logger.warn('⚠️  Redis connection closed'));
    client.on('reconnecting', () => logger.info('🔄 Redis reconnecting...'));

    return client;
};

// Main client for cache operations
const redisClient = createRedisClient();

// Separate pub/sub clients for Socket.io adapter (must not share connection)
const pubClient = createRedisClient();
const subClient = createRedisClient();

export const connectRedis = async (): Promise<void> => {
    await Promise.all([
        redisClient.connect(),
        pubClient.connect(),
        subClient.connect(),
    ]);
};

export { pubClient, subClient };
export default redisClient;
