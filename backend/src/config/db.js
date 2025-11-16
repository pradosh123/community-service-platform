const mongoose = require('mongoose');

/**
 * Database connection configuration
 * Supports both local MongoDB and MongoDB Atlas
 */
const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI || 'mongodb://admin:admin123@localhost:27017/?authSource=admin';
        const dbName = process.env.MONGODB_DB_NAME || 'community_service_platform';

        // Check if database name is already in the URI
        const uriHasDbName = /mongodb:\/\/[^\/]+\/[^?\/]+/.test(mongoUri);

        // If database name is not in URI, add it before query params
        let connectionString = mongoUri;
        if (!uriHasDbName) {
            // Remove trailing slash if present, then add database name
            const cleanUri = mongoUri.replace(/\/+$/, '');
            if (mongoUri.includes('?')) {
                // Insert db name before query params
                connectionString = cleanUri.replace('?', `/${dbName}?`);
            } else {
                // No query params, just append database name
                connectionString = `${cleanUri}/${dbName}`;
            }
        }

        const options = {
            dbName: dbName, // Explicitly set database name
            useNewUrlParser: true,
            useUnifiedTopology: true,
        };

        const conn = await mongoose.connect(connectionString, options);

        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        console.log(`📦 Database: ${conn.connection.name}`);

        // Handle connection events
        mongoose.connection.on('error', (err) => {
            console.error('❌ MongoDB connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('⚠️ MongoDB disconnected');
        });

        // Graceful shutdown
        process.on('SIGINT', async () => {
            await mongoose.connection.close();
            console.log('MongoDB connection closed through app termination');
            process.exit(0);
        });

        return conn;
    } catch (error) {
        console.error('❌ MongoDB connection failed:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;

