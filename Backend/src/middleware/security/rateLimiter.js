import rateLimit from 'express-rate-limit';

/**
 * API Rate Limiter
 * Limits total requests to the API
 */
export const apiLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 100, // Limit each IP to 100 requests per windowMs
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: {
        message: "Too many API requests. Please slow down.",
        status: 429
    }
});

/**
 * Auth Rate Limiter
 * Stricter limits for authentication endpoints to prevent brute force
 */
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Limit each IP to 10 requests per 15 minutes
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        message: "Too many login attempts. Please try again after 15 minutes.",
        status: 429
    }
});

/**
 * Strict Rate Limiter
 * For highly sensitive operations
 */
export const strictLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 5, // Limit each IP to 5 requests per minute
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        message: "Rate limit exceeded. Please wait before trying again.",
        status: 429
    }
});

export default {
    apiLimiter,
    authLimiter,
    strictLimiter
};
