import jwt from "jsonwebtoken";

const authenticateAdmin = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: "Access denied. No token provided." });

    const secret = process.env.JWT_SECRET;
    if (!secret) {
        return res.status(500).json({ message: "Internal server error: Security configuration missing" });
    }

    jwt.verify(token, secret, (err, user) => {
        if (err) return res.status(403).json({ message: "Invalid or expired token." });

        if (user.role !== "ADMIN") {
            return res.status(403).json({ message: "Access denied. Admin privileges required." });
        }

        req.user = user;
        next();
    });
};

export default authenticateAdmin;
