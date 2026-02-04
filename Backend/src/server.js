import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import items from "./routers/landingRoutes/items.js"
import auth from "./routers/landingRoutes/auth.js"
import userRoutes from "./routers/landingRoutes/user.js"
import orderRoutes from "./routers/landingRoutes/order.js"
import contactRoutes from "./routers/landingRoutes/contact.js"
import uploadRoutes from "./routers/uploadsRoutes/upload.js"

// Admin Routes
import adminOrderRoutes from "./routers/adminRoutes/orders.js"
import adminMessageRoutes from "./routers/adminRoutes/messages.js"
import adminBillingRoutes from "./routers/adminRoutes/billing.js"
import adminInventoryRoutes from "./routers/adminRoutes/inventory.js"
import adminAttendanceRoutes from "./routers/adminRoutes/attendance.js"

import prisma from "./prismaClient.js"

const app = express();
const PORT = process.env.PORT || 5016;

if (!process.env.JWT_SECRET) {
    console.warn("WARNING: JWT_SECRET is not set in environment variables!");
}

app.use(cors());
app.use(express.json());

// Routes
app.use("/items", items)
app.use("/auth", auth)
app.use("/user", userRoutes)
app.use("/order", orderRoutes)
app.use("/contact", contactRoutes)

// Admin Routes
app.use("/admin/orders", adminOrderRoutes)
app.use("/admin/messages", adminMessageRoutes)
app.use("/admin/billing", adminBillingRoutes)
app.use("/admin/inventory", adminInventoryRoutes)
app.use("/admin/attendance", adminAttendanceRoutes)

// serve uploaded images
app.use("/uploads", express.static("uploads"));

// routes
app.use("/api/uploads", uploadRoutes);


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
