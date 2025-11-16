require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 3000;

// Connect to database
connectDB()
    .then(() => {
        // Start server
        app.listen(PORT, () => {
            console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║   🚀 Community Service Platform API                        ║
║                                                            ║
║   ✅ Server running on port ${PORT}                           ║
║   📖 API Documentation: http://localhost:${PORT}/api-docs     ║
║   🏥 Health Check: http://localhost:${PORT}/health          ║
║   🌍 Environment: ${process.env.NODE_ENV || 'development'}                     ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
      `);
        });
    })
    .catch((error) => {
        console.error('Failed to start server:', error);
        process.exit(1);
    });

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('UNHANDLED REJECTION! 💥 Shutting down...');
    console.error(err.name, err.message);
    process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    console.error(err.name, err.message);
    process.exit(1);
});

