import prisma from './prisma';
import logger from '../utils/logger';

const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 3000;

const connectDB = async (attempt = 1): Promise<void> => {
    try {
        await prisma.$connect();
        logger.info('✅ Neon PostgreSQL database connected successfully via Prisma');
    } catch (error) {
        logger.error(`❌ PostgreSQL connection failed (attempt ${attempt}/${MAX_RETRIES}): ${error}`);
        if (attempt < MAX_RETRIES) {
            logger.info(`🔄 Retrying in ${RETRY_DELAY_MS / 1000}s...`);
            await new Promise((res) => setTimeout(res, RETRY_DELAY_MS));
            return connectDB(attempt + 1);
        }
        logger.error('💀 PostgreSQL connection exhausted. Exiting.');
        process.exit(1);
    }
};

export default connectDB;
