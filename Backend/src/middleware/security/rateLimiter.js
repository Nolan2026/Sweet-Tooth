/**
 * Rate Limiting Middleware
 * Simple in-memory rate limiter for production use
 * For large scale applications, use Redis-based rate limiting
 */

const requestCounts = new Map();

// Clean up old entries every 10 minutes
setInterval(() => {
    const now = Date.now();
    for (const [key, data] of requestCounts.entries()) {
        if (now - data.resetTime > 600000) { // 10 minutes
            requestCounts.delete(key);
        }
    }
}, 600000);

/**
 * Rate limiter factory
 * @param {number} maxRequests - Maximum requests allowed
 * @param {number} windowMs - Time window in milliseconds
 * @param {string} message - Error message when limit exceeded
 */
export const createRateLimiter = (maxRequests = 100, windowMs = 60000, message = "Too many requests") => {
    return (req, res, next) => {
        const identifier = req.ip || req.connection.remoteAddress;
        const now = Date.now();

        if (!requestCounts.has(identifier)) {
            requestCounts.set(identifier, {
                count: 1,
                resetTime: now + windowMs
            });
            return next();
        }

        const userData = requestCounts.get(identifier);

        // Reset if window has passed
        if (now > userData.resetTime) {
            userData.count = 1;
            userData.resetTime = now + windowMs;
            return next();
        }

        // Check if limit exceeded
        if (userData.count >= maxRequests) {
            return res.status(429).json({
                message,
                retryAfter: Math.ceil((userData.resetTime - now) / 1000)
            });
        }

        userData.count++;
        next();
    };
};

// Pre-configured rate limiters for different routes
export const authLimiter = createRateLimiter(
    5,      // 5 attempts
    900000, // 15 minutes
    "Too many login attempts. Please try again later."
);

export const apiLimiter = createRateLimiter(
    100,    // 100 requests
    60000,  // 1 minute
    "Too many API requests. Please slow down."
);

export const strictLimiter = createRateLimiter(
    10,     // 10 requests
    60000,  // 1 minute
    "Rate limit exceeded. Please wait before trying again."
);

export default {
    createRateLimiter,
    authLimiter,
    apiLimiter,
    strictLimiter
};
