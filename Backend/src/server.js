import dotenv from "dotenv";
dotenv.config({ quiet: true });
import express from "express";
import cors from "cors";
import path from "path";
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

import authenticateAdmin from "./middleware/authentication/adminAuth.js"
import { authLimiter, apiLimiter } from "./middleware/security/rateLimiter.js"
import securityHeaders from "./middleware/security/securityHeaders.js"
import errorHandler, { notFoundHandler } from "./middleware/error/errorHandler.js"

import prisma from "./prismaClient.js"

const app = express();
const PORT = process.env.PORT || 5016;

if (!process.env.JWT_SECRET) {
    console.warn("WARNING: JWT_SECRET is not set in environment variables!");
}

// Security: Restrict CORS in production
const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',')
    : ['http://localhost:5173', 'http://localhost:3000'];

app.use(cors());

// Security middleware
app.use(securityHeaders);
app.use(express.json({ limit: '10mb' })); // Limit payload size

// Routes with rate limiting
app.use("/items", apiLimiter, items)
app.use("/auth", authLimiter, auth) // Protect auth with stricter limits
app.use("/user", apiLimiter, userRoutes)
app.use("/order", apiLimiter, orderRoutes)
app.use("/contact", apiLimiter, contactRoutes)
app.use("/coupons", apiLimiter, couponRoutes)


// Admin Routes
app.use("/admin/orders", authenticateAdmin, adminOrderRoutes)
app.use("/admin/messages", authenticateAdmin, adminMessageRoutes)
app.use("/admin/billing", authenticateAdmin, adminBillingRoutes)
app.use("/admin/inventory", authenticateAdmin, adminInventoryRoutes)
app.use("/admin/attendance", authenticateAdmin, adminAttendanceRoutes)
app.use("/admin", adminprofileRoutes)
app.use("/admin/coupons", authenticateAdmin, adminCouponRoutes)


// serve uploaded images
const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// routes
app.use("/api/uploads", uploadRoutes);


app.get("/debug-profile", async (req, res) => {
    try {
        const profile = await prisma.adminProfile.findFirst();
        res.json(profile);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get("/test-db", async (req, res) => {

    try {
        const count = await prisma.user.count();
        res.json({ count });
    } catch (err) {
        console.error("DB TEST ERROR:", err);
        res.status(500).json({ error: err.message, stack: err.stack });
    }
});

app.get("/", async (req, res) => {
    try {
        await prisma.$queryRaw`SELECT 1`;
        res.send("Welcome to Sweet Tooth Backend - DB Connected!");
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
