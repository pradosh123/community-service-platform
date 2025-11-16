require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');

/**
 * MongoDB Migration Script
 * This script can be used to seed initial data or run migrations
 */

// Example: Create indexes, seed data, etc.
const runMigrations = async () => {
    try {
        console.log('🔄 Starting migrations...');

        // Connect to database
        await connectDB();

        // Import models to ensure indexes are created
        require('../models/user.model');
        require('../models/worker.model');

        // Wait a moment for indexes to be created
        await new Promise((resolve) => setTimeout(resolve, 2000));

        console.log('✅ Migrations completed successfully');
        process.exit(0);
    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
};

// Run migrations if called directly
if (require.main === module) {
    runMigrations();
}

module.exports = runMigrations;

