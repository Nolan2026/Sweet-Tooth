import jwt from "jsonwebtoken";

const authenticateAdmin = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: "Access denied. No token provided." });

    jwt.verify(token, process.env.JWT_SECRET || "default_secret", (err, user) => {
        if (err) return res.status(403).json({ message: "Invalid or expired token." });

        // You could also check for an 'isAdmin' flag here if your JWT payload has it
        req.user = user;
        next();
    });
};

export default authenticateAdmin;
