const AWS = require('aws-sdk');

/**
 * AWS S3 Configuration
 * For file uploads in production
 */
const s3Config = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION || 'us-east-1',
};

// Initialize S3 client only if credentials are provided
const s3 = process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY
    ? new AWS.S3(s3Config)
    : null;

/**
 * Upload file to S3
 * @param {Buffer} fileBuffer - File buffer
 * @param {String} fileName - File name
 * @param {String} mimetype - File MIME type
 * @returns {Promise<Object>} Upload result
 */
const uploadToS3 = async (fileBuffer, fileName, mimetype) => {
    if (!s3) {
        throw new Error('S3 configuration is not set. Please provide AWS credentials in environment variables.');
    }

    const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: fileName,
        Body: fileBuffer,
        ContentType: mimetype,
        ACL: 'public-read', // Adjust based on your security requirements
    };

    try {
        const result = await s3.upload(params).promise();
        return {
            url: result.Location,
            key: result.Key,
        };
    } catch (error) {
        console.error('S3 upload error:', error);
        throw new Error('Failed to upload file to S3');
    }
};

/**
 * Delete file from S3
 * @param {String} fileKey - S3 file key
 * @returns {Promise<Object>} Delete result
 */
const deleteFromS3 = async (fileKey) => {
    if (!s3) {
        throw new Error('S3 configuration is not set.');
    }

    const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: fileKey,
    };

    try {
        const result = await s3.deleteObject(params).promise();
        return result;
    } catch (error) {
        console.error('S3 delete error:', error);
        throw new Error('Failed to delete file from S3');
    }
};

module.exports = {
    s3,
    uploadToS3,
    deleteFromS3,
};

