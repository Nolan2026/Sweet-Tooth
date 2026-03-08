import express from "express";
import prisma from "../../prismaClient.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    const secret = process.env.JWT_SECRET;
    if (!secret) {
        return res.status(500).json({ message: "Internal server error: Security configuration missing" });
    }

    jwt.verify(token, secret, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// Get user profile including addresses and orders
router.get("/profile", authenticateToken, async (req, res) => {
    try {
        const userId = req.user?.id ? parseInt(req.user.id) : null;

        if (!userId || isNaN(userId)) {
            return res.status(400).json({ message: "Invalid user token" });
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                addresses: true,
                orders: {
                    orderBy: { createdAt: 'desc' }
                }
            }
        });

        if (!user) return res.status(404).json({ message: "User not found" });

        const { password, ...userData } = user;
        res.json(userData);
    } catch (error) {
        console.error("Error fetching profile:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
});

// Get User Addresses
router.get("/address/:id", async (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        if (isNaN(userId)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        const address = await prisma.address.findMany({
            where: { userId: userId }
        });

        if (address.length === 0) {
            return res.status(404).json({ message: "Address not found" });
        };

        res.json(address);
    } catch (error) {
        console.error("Error fetching address:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
});

// Add or Update Address
router.post("/address", authenticateToken, async (req, res) => {
    try {
        const { id, label, street, area, district, state, pinCode, country } = req.body;
        const userId = parseInt(req.user.id);

        let address;
        if (id) {
            // Update existing
            address = await prisma.address.update({
                where: { id: parseInt(id), userId: userId },
                data: { label, street, area, district, state, pinCode, country }
            });
        } else {
            // Create new
            address = await prisma.address.create({
                data: {
                    userId: userId,
                    label: label || "Home",
                    street,
                    area,
                    district,
                    state,
                    pinCode,
                    country
                }
            });
        }

        res.json({ message: id ? "Address updated" : "Address added", address });
    } catch (error) {
        console.error("Error saving address:", error);
        res.status(500).json({ message: "Error saving address" });
    }
});

// Delete Address
router.delete("/address/:id", authenticateToken, async (req, res) => {
    try {
        const addressId = parseInt(req.params.id);
        const userId = parseInt(req.user.id);

        await prisma.address.delete({
            where: { id: addressId, userId: userId }
        });

        res.json({ message: "Address deleted successfully" });
    } catch (error) {
        console.error("Error deleting address:", error);
        res.status(500).json({ message: "Error deleting address" });
    }
});

export default router;
