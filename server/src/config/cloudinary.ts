import { v2 as cloudinary } from 'cloudinary';
import { env } from './env';
import logger from '../utils/logger';

cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
    secure: true,
});

/**
 * Upload a buffer directly to Cloudinary (no temp file)
 */
export const cloudinaryUpload = (
    buffer: Buffer,
    options: {
        folder?: string;
        public_id?: string;
        transformation?: object[];
    } = {}
): Promise<{ url: string; publicId: string }> => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: options.folder || 'intellmeet',
                public_id: options.public_id,
                resource_type: 'image',
                transformation: options.transformation || [
                    { width: 400, height: 400, crop: 'fill', gravity: 'face' },
                    { quality: 'auto', fetch_format: 'auto' },
                ],
            },
            (error, result) => {
                if (error || !result) {
                    logger.error(`Cloudinary upload error: ${error?.message}`);
                    reject(error || new Error('Cloudinary upload failed'));
                    return;
                }
                resolve({ url: result.secure_url, publicId: result.public_id });
            }
        );
        uploadStream.end(buffer);
    });
};

/**
 * Delete a file from Cloudinary by its public_id
 */
export const cloudinaryDestroy = async (publicId: string): Promise<void> => {
    try {
        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        logger.error(`Cloudinary destroy error: ${error}`);
        throw error;
    }
};

export default cloudinary;
