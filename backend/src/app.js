require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Import routes
const authRoutes = require('./routes/auth.routes');
const workerRoutes = require('./routes/worker.routes');
const jobRoutes = require('./routes/job.routes');
const adminRoutes = require('./routes/admin.routes');
const categoryRoutes = require('./routes/category.routes');

// Import middleware
const { errorHandler } = require('./middlewares/error.middleware');

const app = express();

// Swagger configuration
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Community Service Platform API',
            version: '1.0.0',
            description: 'RESTful API documentation for Community Service Platform',
            contact: {
                name: 'API Support',
                email: 'support@communityservice.com',
            },
        },
        servers: [
            {
                url: `http://localhost:${process.env.PORT || 3000}`,
                description: 'Development server',
            },
            {
                url: 'https://api.communityservice.com',
                description: 'Production server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
    },
    apis: ['./src/routes/*.js', './src/app.js'], // Path to the API routes
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Custom JSON parse error handler (must be after body parsers)
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        // Extract helpful message from the error
        let message = 'Invalid JSON format in request body.';

        // Try to provide specific guidance based on common errors
        if (err.message.includes('Unexpected token')) {
            message = 'Invalid JSON format. Check for syntax errors like trailing commas, missing quotes, or invalid characters.';
        } else if (err.message.includes('property name')) {
            message = 'Invalid JSON format. Check for trailing commas (e.g., remove comma before closing brace) or missing quotes around property names.';
        } else if (err.message.includes('position')) {
            message = 'Invalid JSON format. There is a syntax error in your JSON. Common issues: trailing commas, missing quotes, or unclosed brackets.';
        }

        return res.status(400).json({
            success: false,
            status: 'fail',
            message: message,
            error: process.env.NODE_ENV === 'development' ? {
                details: err.message,
                hint: 'Example of invalid JSON: {"name": "test",} - notice the trailing comma before the closing brace',
                received: err.body ? err.body.substring(0, 200) : undefined
            } : undefined
        });
    }
    next(err);
});

// Logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
} else {
    app.use(morgan('combined'));
}

// Rate limiting
const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
    message: {
        success: false,
        message: 'Too many requests from this IP, please try again later.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});

app.use('/api/', limiter);

// Health check route
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
    });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/workers', workerRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/categories', categoryRoutes);

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Community Service Platform API Documentation',
}));

// Root route
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Welcome to Community Service Platform API',
        version: '1.0.0',
        documentation: '/api-docs',
        health: '/health',
    });
});

// 404 handler
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`,
    });
});

// Error handling middleware (must be last)
app.use(errorHandler);

module.exports = app;

