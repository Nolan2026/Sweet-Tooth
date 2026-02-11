import express from "express";
import prisma from "../../prismaClient.js";

const router = express.Router();

// Get all coupons
router.get("/", async (req, res) => {
    try {
        const coupons = await prisma.coupon.findMany({
            orderBy: { createdAt: "desc" }
        });
        res.json(coupons);
    } catch (error) {
        console.error("Error fetching coupons:", error);
        res.status(500).json({ error: "Failed to fetch coupons" });
    }
});

// Create a new coupon
router.post("/", async (req, res) => {
    try {
        const { code, discountType, discountValue, expiryDate, minOrderValue, usageLimit } = req.body;

        if (!code || !discountType || discountValue === undefined || !expiryDate) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const existing = await prisma.coupon.findUnique({ where: { code } });
        if (existing) {
            return res.status(400).json({ error: "Coupon code already exists" });
        }

        const coupon = await prisma.coupon.create({
            data: {
                code,
                discountType,
                discountValue: parseFloat(discountValue),
                expiryDate: new Date(expiryDate),
                minOrderValue: parseFloat(minOrderValue || 0),
                usageLimit: usageLimit ? parseInt(usageLimit) : 1,
                active: true
            }
        });

        res.status(201).json(coupon);
    } catch (error) {
        console.error("Error creating coupon:", error);
        res.status(500).json({ error: "Failed to create coupon" });
    }
});

// Toggle coupon status (active/inactive)
router.patch("/:id/toggle", async (req, res) => {
    try {
        const { id } = req.params;
        const coupon = await prisma.coupon.findUnique({ where: { id: parseInt(id) } });
        if (!coupon) return res.status(404).json({ error: "Coupon not found" });

        const updated = await prisma.coupon.update({
            where: { id: parseInt(id) },
            data: { active: !coupon.active }
        });

        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: "Failed to update coupon" });
    }
});

// Delete a coupon
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.coupon.delete({ where: { id: parseInt(id) } });
        res.json({ message: "Coupon deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete coupon" });
    }
});

export default router;
