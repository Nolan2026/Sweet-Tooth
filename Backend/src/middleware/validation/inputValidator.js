/**
 * Input Validation Middleware
 * Provides validation and sanitization for user inputs
 */

// Email validation
export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Phone validation (10-15 digits with optional country code)
export const validatePhone = (phone) => {
    const phoneRegex = /^[\d\s\-\+\(\)]{10,15}$/;
    return phoneRegex.test(phone);
};

// Password strength validation
export const validatePassword = (password) => {
    // Minimum 8 characters, at least one letter and one number
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
    return passwordRegex.test(password);
};

// Sanitize string inputs
export const sanitizeString = (str) => {
    if (!str) return str;
    return str.trim().replace(/[<>]/g, '');
};

// Validate integer ID
export const validateId = (id) => {
    const parsedId = parseInt(id);
    return !isNaN(parsedId) && parsedId > 0;
};

// Validate and sanitize username
export const validateUsername = (username) => {
    // 3-30 characters, alphanumeric with underscores
    const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;
    return usernameRegex.test(username);
};

// Middleware: Validate registration input
export const validateRegistration = (req, res, next) => {
    const { username, email, password, phone } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: "Username, email, and password are required" });
    }

    if (!validateUsername(username)) {
        return res.status(400).json({
            message: "Username must be 3-30 characters and contain only letters, numbers, and underscores"
        });
    }

    if (!validateEmail(email)) {
        return res.status(400).json({ message: "Invalid email format" });
    }

    if (!validatePassword(password)) {
        return res.status(400).json({
            message: "Password must be at least 8 characters with at least one letter and one number"
        });
    }

    if (phone && !validatePhone(phone)) {
        return res.status(400).json({ message: "Invalid phone number format" });
    }

    next();
};

// Middleware: Validate login input
export const validateLogin = (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    if (!validateEmail(email)) {
        return res.status(400).json({ message: "Invalid email format" });
    }

    next();
};

// Middleware: Validate order creation
export const validateOrderCreation = (req, res, next) => {
    const { cartItems } = req.body;

    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
        return res.status(400).json({ message: "Cart items are required" });
    }

    // Validate each cart item
    for (const item of cartItems) {
        if (!validateId(item.id)) {
            return res.status(400).json({ message: "Invalid item ID in cart" });
        }

        if (!item.quantity || item.quantity < 1 || item.quantity > 100) {
            return res.status(400).json({ message: "Invalid quantity (must be 1-100)" });
        }

        if (!item.selectedWeight || item.selectedWeight <= 0 || item.selectedWeight > 10) {
            return res.status(400).json({ message: "Invalid weight selection" });
        }
    }

    next();
};

export default {
    validateEmail,
    validatePhone,
    validatePassword,
    sanitizeString,
    validateId,
    validateUsername,
    validateRegistration,
    validateLogin,
    validateOrderCreation
};
