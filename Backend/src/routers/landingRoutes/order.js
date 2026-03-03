import express from "express";
import prisma from "../../prismaClient.js";
import jwt from "jsonwebtoken";
import generateTrackingId from "../../middleware/authentication/trakingId.js";
import { sendOrderPlaced } from "../adminRoutes/sendOtp.js";
import { useState } from "react";

const router = express.Router();

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: "Login required" });

    jwt.verify(token, process.env.JWT_SECRET || "default_secret", (err, user) => {
        if (err) return res.status(403).json({ message: "Session expired" });
        req.user = user;
        next();
    });
};

// Validate cart and get current prices from DB
router.post("/validate", authenticateToken, async (req, res) => {
    try {
        const { cartItems } = req.body;
        if (!cartItems || cartItems.length === 0) {
            return res.status(400).json({ message: "Cart is empty" });
        }

        let total = 0;
        const processedItems = [];

        for (const item of cartItems) {
            const dbItem = await prisma.item.findUnique({
                where: { id: parseInt(item.id) }
            });

            if (!dbItem) {
                return res.status(404).json({ message: `Item with id ${item.id} not found` });
            }

            const itemPrice = Math.round(dbItem.price * item.selectedWeight);
            const subtotal = itemPrice * item.quantity;
            total += subtotal;

            processedItems.push({
                ...item,
                dbPrice: dbItem.price,
                confirmedPrice: itemPrice,
                subtotal: subtotal
            });
        }

        res.json({
            items: processedItems,
            total: total
        });
    } catch (error) {
        res.status(500).json({ message: "Error validating cart" });
    }
});

// Create a new order
router.post("/create", authenticateToken, async (req, res) => {
    try {
        const userId = parseInt(req.user.id);
        const { cartItems, paymentMethod, paymentDetails } = req.body;

        if (!cartItems || cartItems.length === 0) {
            return res.status(400).json({ message: "Cart is empty" });
        }

        // 1. Check if user has at least one address
        const userWithAddress = await prisma.user.findUnique({
            where: { id: userId },
            include: { addresses: true }
        });

        if (!userWithAddress) {
            return res.status(404).json({ message: "User not found. Please register or login again." });
        }

        if (!userWithAddress.addresses || userWithAddress.addresses.length === 0) {
            return res.status(400).json({ message: "Address required. Please add an address in your profile." });
        }

        // 2. Fetch current prices from DB and calculate total
        let total = 0;
        const processedItems = [];

        for (const item of cartItems) {
            const dbItem = await prisma.item.findUnique({
                where: { id: parseInt(item.id) }
            });

            if (!dbItem) {
                return res.status(404).json({ message: `Item with id ${item.id} not found` });
            }

            // Price calculation based on weight (assuming price is per kg)
            // If weight is 0.25 (250g), price is dbItem.price * 0.25
            const itemPrice = Math.round(dbItem.price * item.selectedWeight);
            const subtotal = itemPrice * item.quantity;
            total += subtotal;

            processedItems.push({
                id: dbItem.id,
                name: dbItem.item_name,
                weight: item.selectedWeight,
                quantity: item.quantity,
                isKilo: dbItem.iskilo,
                pricePerUnit: itemPrice,
                subtotal: subtotal
            });
        }

        // 3. Create the order
        const order = await prisma.order.create({
            data: {
                userId: userId,
                total: req.body.total || total,
                status: "Pending",
                items: processedItems,
                paymentMethod: req.body.paymentMethod || "COD",
                paymentDetails: req.body.paymentDetails || {},
                trackingId: generateTrackingId()
            }
        });
        
        await sendOrderPlaced({id:order.id, paymentMethod, paymentDetails});

        // 4. Update coupon usage if used
        if (req.body.couponCode) {
            try {
                await prisma.coupon.update({
                    where: { code: req.body.couponCode },
                    data: { usedCount: { increment: 1 } }
                });
            } catch (couponErr) {
                console.error("Failed to update coupon usage:", couponErr);
            }
        }

        res.status(201).json({
            message: "Order created successfully",
            orderId: order.id,
            total: order.total
        });

    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
});

// Get user orders (reusing logic if needed)
router.get("/my-orders", authenticateToken, async (req, res) => {
    try {
        const userId = parseInt(req.user.id);
        const orders = await prisma.order.findMany({
            where: { userId: userId },
            orderBy: { createdAt: 'desc' }
        });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: "Error fetching orders" });
    }
});

// Cancel an order
router.delete("/cancel/:id", authenticateToken, async (req, res) => {
    try {
        const orderId = parseInt(req.params.id);
        const userId = parseInt(req.user.id);

        const order = await prisma.order.findUnique({
            where: { id: orderId }
        });

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        if (order.userId !== userId) {
            return res.status(403).json({ message: "Not authorized to cancel this order" });
        }

        if (order.status !== "Pending") {
            return res.status(400).json({ message: `Cannot cancel an order that is already ${order.status}` });
        }

        await prisma.order.update({
            where: { id: orderId },
            data: { status: "Cancelled" }
        });

        res.json({ message: "Order cancelled successfully" });
    } catch (error) {
        console.error("Error cancelling order:", error);
        res.status(500).json({ message: "Error cancelling order" });
    }
});

export default router;
