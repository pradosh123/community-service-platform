/**
 * Error Handling Middleware
 * Centralized error handling for the application
 */

/**
 * Custom Error Handler Class
 */
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * Error handler middleware
 */
const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;
    error.statusCode = err.statusCode || 500;
    error.status = err.status || 'error';

    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
        error = handleCastErrorDB(err);
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
        error = handleDuplicateFieldsDB(err);
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        error = handleValidationErrorDB(err);
    }

    // Development error response
    if (process.env.NODE_ENV === 'development') {
        return res.status(error.statusCode).json({
            success: false,
            status: error.status,
            error: error,
            message: error.message,
            stack: err.stack,
        });
    }

    // Production error response
    // Only send operational errors to client
    if (error.isOperational) {
        return res.status(error.statusCode).json({
            success: false,
            status: error.status,
            message: error.message,
        });
    }

    // Programming or unknown errors: don't leak error details
    console.error('ERROR 💥:', err);
    return res.status(500).json({
        success: false,
        status: 'error',
        message: 'Something went wrong!',
    });
};

/**
 * Handle MongoDB duplicate key errors
 */
const handleDuplicateFieldsDB = (err) => {
    const message = `Duplicate field value. Please use another value.`;
    return new AppError(message, 400);
};

/**
 * Handle MongoDB validation errors
 */
const handleValidationErrorDB = (err) => {
    const errors = Object.values(err.errors).map((el) => el.message);
    const message = `Invalid input data. ${errors.join('. ')}`;
    return new AppError(message, 400);
};

/**
 * Handle MongoDB cast errors (invalid ObjectId)
 */
const handleCastErrorDB = (err) => {
    const message = `Invalid ${err.path}: ${err.value}`;
    return new AppError(message, 400);
};

/**
 * Async error wrapper
 * Wraps async route handlers to catch errors
 */
const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

module.exports = {
    AppError,
    errorHandler,
    handleDuplicateFieldsDB,
    handleValidationErrorDB,
    handleCastErrorDB,
    asyncHandler,
};

