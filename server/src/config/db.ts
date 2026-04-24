import mongoose from 'mongoose';
import { env } from './env';
import logger from '../utils/logger';

const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 3000;

const connectDB = async (attempt = 1): Promise<void> => {
    try {
        await mongoose.connect(env.MONGO_URI, {
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        logger.info(`✅ MongoDB connected: ${mongoose.connection.host}`);
    } catch (error) {
        logger.error(`❌ MongoDB connection failed (attempt ${attempt}/${MAX_RETRIES}): ${error}`);
        if (attempt < MAX_RETRIES) {
            logger.info(`🔄 Retrying in ${RETRY_DELAY_MS / 1000}s...`);
            await new Promise((res) => setTimeout(res, RETRY_DELAY_MS));
            return connectDB(attempt + 1);
        }
        logger.error('💀 MongoDB connection exhausted. Exiting.');
        process.exit(1);
    }
};

mongoose.connection.on('disconnected', () => {
    logger.warn('⚠️  MongoDB disconnected');
});

mongoose.connection.on('reconnected', () => {
    logger.info('🔁 MongoDB reconnected');
});

export default connectDB;
