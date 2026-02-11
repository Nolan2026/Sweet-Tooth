/**
 * Global Error Handler Middleware
 * Centralizes error handling and prevents information leakage
 */

export const errorHandler = (err, req, res, next) => {
    // Log error for debugging (use proper logging service in production)
    console.error('[ERROR]', {
        message: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
        path: req.path,
        method: req.method,
        timestamp: new Date().toISOString()
    });

    // Default error status and message
    let status = err.status || err.statusCode || 500;
    let message = err.message || 'Internal Server Error';

    // Handle specific error types
    if (err.name === 'ValidationError') {
        status = 400;
        message = 'Validation error';
    }

    if (err.name === 'UnauthorizedError' || err.name === 'JsonWebTokenError') {
        status = 401;
        message = 'Authentication failed';
    }

    if (err.name === 'TokenExpiredError') {
        status = 401;
        message = 'Session expired. Please login again';
    }

    // Prisma errors
    if (err.code) {
        if (err.code === 'P2002') {
            status = 409;
            message = 'Resource already exists';
        } else if (err.code === 'P2025') {
            status = 404;
            message = 'Resource not found';
        } else if (err.code.startsWith('P')) {
            status = 400;
            message = 'Database operation failed';
        }
    }

    // Multer file upload errors
    if (err.name === 'MulterError') {
        status = 400;
        if (err.code === 'LIMIT_FILE_SIZE') {
            message = 'File size too large. Maximum 5MB allowed';
        } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
            message = 'Unexpected file upload';
        } else {
            message = 'File upload error';
        }
    }

    // Prepare response object
    const response = {
        success: false,
        message: message
    };

    // Include additional details only in development
    if (process.env.NODE_ENV === 'development') {
        response.error = {
            message: err.message,
            stack: err.stack,
            code: err.code
        };
    }

    res.status(status).json(response);
};

// 404 Handler for undefined routes
export const notFoundHandler = (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
};

export default errorHandler;
