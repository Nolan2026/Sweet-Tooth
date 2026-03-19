import dotenv from "dotenv";
dotenv.config({ quiet: true });
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from 'url';
import fs from "fs/promises";

const __filename = fileURLToPath(import.meta.url);
const __backendDir = path.join(path.dirname(__filename), '..'); // Points to Backend directory

import items from "./routers/landingRoutes/items.js"
import auth from "./routers/landingRoutes/auth.js"
import userRoutes from "./routers/landingRoutes/user.js"
import orderRoutes from "./routers/landingRoutes/order.js"
import contactRoutes from "./routers/landingRoutes/contact.js"
import uploadRoutes from "./routers/uploadsRoutes/upload.js"
import couponRoutes from "./routers/landingRoutes/coupons.js"

// Admin Routes
import adminOrderRoutes from "./routers/adminRoutes/orders.js"
import adminMessageRoutes from "./routers/adminRoutes/messages.js"
import adminBillingRoutes from "./routers/adminRoutes/billing.js"
import adminInventoryRoutes from "./routers/adminRoutes/inventory.js"
import adminAttendanceRoutes from "./routers/adminRoutes/attendance.js"
import adminprofileRoutes from "./routers/adminRoutes/adminprofile.js"
import adminCouponRoutes from "./routers/adminRoutes/coupons.js"
import adminMediaRoutes from "./routers/adminRoutes/media.js"

import authenticateAdmin from "./middleware/authentication/adminAuth.js"
import { authLimiter, apiLimiter } from "./middleware/security/rateLimiter.js"
import helmet from "helmet";
import hpp from "hpp";
import errorHandler, { notFoundHandler } from "./middleware/error/errorHandler.js"

import prisma from "./prismaClient.js"

const app = express();
const PORT = process.env.PORT || 5016;

if (!process.env.JWT_SECRET) {
    throw new Error("FATAL: JWT_SECRET is not set. Application cannot start without it.");
}

if (!process.env.DATABASE_URL) {
    throw new Error("FATAL: DATABASE_URL is not set. Application cannot start without it.");
}

// Security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            ...helmet.contentSecurityPolicy.getDefaultDirectives(),
            "img-src": ["'self'", "data:", "https:", "http:", "*"], // Allow all for images
            "connect-src": ["'self'", "*"],
            "script-src": ["'self'", "'unsafe-inline'", "https:"],
            "style-src": ["'self'", "'unsafe-inline'", "https:"],
            "font-src": ["'self'", "https:", "data:"],
        },
    },
    crossOriginResourcePolicy: { policy: "cross-origin" }, // Allow cross-origin images
}));
app.use(hpp());

// Security: Restrict CORS in production
const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.replace(/[\[\]']/g, '').split(',').map(o => o.trim())
    : ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:5174'];

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10kb' })); // Limit payload size

// Routes with rate limiting
app.use("/items", apiLimiter, items)
app.use("/auth", apiLimiter, auth)
app.use("/user", apiLimiter, userRoutes)
app.use("/order", apiLimiter, orderRoutes)
app.use("/contact", apiLimiter, contactRoutes)
app.use("/coupons", apiLimiter, couponRoutes)


// Admin Order Routes
app.use("/admin/orders", authenticateAdmin, adminOrderRoutes)
app.use("/admin/messages", authenticateAdmin, adminMessageRoutes)
app.use("/admin/billing", authenticateAdmin, adminBillingRoutes)
app.use("/admin/inventory", authenticateAdmin, adminInventoryRoutes)
app.use("/admin/attendance", authenticateAdmin, adminAttendanceRoutes)
app.use("/admin/media", authenticateAdmin, adminMediaRoutes)
app.use("/admin", authenticateAdmin, adminprofileRoutes)
app.use("/admin/coupons", authenticateAdmin, adminCouponRoutes)


// serve uploaded images
app.use("/uploads", express.static(path.join(__backendDir, "uploads")));

// routes
app.use("/api/uploads", uploadRoutes);


// Health check route
app.get("/health", async (req, res) => {
    console.log("Health check hit");
    let dbStatus = "Checking...";

    try {
        // Add a 3-second timeout to the DB check
        const dbCheck = prisma.$queryRaw`SELECT 1`;
        const timeout = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Database timeout')), 3000)
        );

        await Promise.race([dbCheck, timeout]);
        dbStatus = "Connected";
    } catch (err) {
        dbStatus = "Disconnected or Slow: " + err.message;
    }

    // If request asks for JSON or has a query param 'json=true', return JSON
    if (req.headers.accept?.includes('application/json') || req.query.json) {
        return res.status(200).json({
            status: "ok",
            database: dbStatus,
            timestamp: new Date().toISOString(),
            uptime: Math.floor(process.uptime()),
            platform: process.platform,
            nodeVersion: process.version
        });
    }
    // Otherwise serve the styled HTML page
    res.sendFile(path.join(__backendDir, "public", "health.html"));
});

// API Documentation Page
app.get(["/docs", "/api-docs"], (req, res) => {
    res.sendFile(path.join(__backendDir, "public", "api-docs.html"));
});

// API Documentation Data Route
app.get("/api/docs-data", async (req, res) => {
    const password = req.query.pass || req.headers['x-api-password'];
    
    // Simple password check
    if (password !== "nolan2026") {
        return res.status(401).json({ error: "Unauthorized. Password required." });
    }

    try {
        // Try to find API_DOCUMENTATION.md in Gdocs folder (parent of Backend)
        const gdocsPath = path.join(__backendDir, "..", "Gdocs", "API_DOCUMENTATION.md");
        const content = await fs.readFile(gdocsPath, "utf-8");
        res.status(200).json({ content });
    } catch (err) {
        console.error("Documentation fetch error:", err);
        res.status(404).json({ error: "Documentation not found", details: err.message });
    }
});

// Serve public static files (index.html, health.html, api-docs.html)
app.use(express.static(path.join(__backendDir, "public")));

app.get("/", async (req, res) => {
    try {
        await prisma.$queryRaw`SELECT 1`;
        res.sendFile(path.join(__backendDir, "public", "index.html"));
    } catch (err) {
        res.status(500).send("Backend is up, but DB is down: " + err.message);
    }
});

// 404 Handler - must be after all routes
app.use(notFoundHandler);

// Global Error Handler - must be last
app.use(errorHandler);


app.listen(PORT, () => {
    console.log(`Server Started on port: ${PORT}`);
});

// Keep the process alive
setInterval(() => { }, 1000);

process.on('SIGINT', () => {
    console.log('Received SIGINT. Press Control-D to exit.');
    process.exit();
});

process.on('exit', (code) => {
    console.log(`About to exit with code: ${code}`);
});
