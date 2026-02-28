import express from "express";
import prisma from "../../prismaClient.js";

const router = express.Router();

// Fetch all active, non-expired coupons
router.get("/", async (req, res) => {
    try {
        const coupons = await prisma.coupon.findMany({
            where: {
                active: true,
                expiryDate: {
                    gt: new Date()
                }
            }
        });
        res.json(coupons);
    } catch (error) {
        console.error("Error fetching coupons:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Validate and apply coupon
router.post("/validate", async (req, res) => {
    try {
        const { code, cartTotal } = req.body;

        if (!code) {
            return res.status(400).json({ error: "Coupon code is required" });
        }

        const coupon = await prisma.coupon.findUnique({
            where: { code }
        });

        if (!coupon) {
            return res.status(404).json({ error: "Invalid coupon code" });
        }

        if (!coupon.active) {
            return res.status(400).json({ error: "Coupon is no longer active" });
        }

        if (new Date() > new Date(coupon.expiryDate)) {
            return res.status(400).json({ error: "Coupon has expired" });
        }

        if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
            return res.status(400).json({ error: "Coupon usage limit reached" });
        }

        if (cartTotal < coupon.minOrderValue) {
            return res.status(400).json({ error: `Minimum order value of ₹${coupon.minOrderValue} required` });
        }

        let discountAmount = 0;
        if (coupon.discountType === "percentage") {
            discountAmount = (cartTotal * coupon.discountValue) / 100;
        } else {
            discountAmount = coupon.discountValue;
        }

        // Ensure discount doesn't exceed total
        discountAmount = Math.min(discountAmount, cartTotal);

        res.json({
            valid: true,
            code: coupon.code,
            discountType: coupon.discountType,
            discountValue: coupon.discountValue,
            discountAmount: Math.round(discountAmount)
        });

    } catch (error) {
        console.error("Coupon validation error:", error);
        res.status(500).json({ error: "Internal server error during validation" });
    }
});

export default router;
