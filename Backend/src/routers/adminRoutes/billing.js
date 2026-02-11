import express from "express";
import prisma from "../../prismaClient.js";

const router = express.Router();

// Create a new bill
router.post("/create", async (req, res) => {
    try {
        const { items, paymentMode } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: "Items are required" });
        }

        // Validate items and fetch current prices from database
        let totalAmount = 0;
        const processedItems = [];

        for (const item of items) {
            const dbItem = await prisma.item.findUnique({
                where: { id: parseInt(item.itemId) }
            });

            if (!dbItem) {
                return res.status(404).json({ message: `Item ${item.itemId} not found` });
            }

            const price = dbItem.price;
            const subtotal = price * item.quantity;
            totalAmount += subtotal;

            processedItems.push({
                itemId: dbItem.id,
                itemName: dbItem.item_name,
                quantity: item.quantity,
                price: price,
                subtotal: subtotal
            });
        }

        const bill = await prisma.bill.create({
            data: {
                items: processedItems,
                totalAmount,
                paymentMode: paymentMode || "Cash"
            }
        });

        res.status(201).json({
            message: "Bill created successfully",
            bill
        });
    } catch (error) {
        console.error("Error creating bill:", error);
        res.status(500).json({ message: "Error creating bill", error: error.message });
    }
});

// delete a bill
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const killbill = await prisma.bill.delete({
            where: { id: parseInt(id) }
        });
        res.json({ message: "bill deleted successfully" }); 
    } catch (error) {
        res.status(500).json({ message: "Error in deleting bill", error: error.message });
        
    }
});

// Get all bills with filters
router.get("/history", async (req, res) => {
    try {
        const { startDate, endDate, paymentMode } = req.query;

        let where = {};
        if (paymentMode) where.paymentMode = paymentMode;
        if (startDate || endDate) {
            where.createdAt = {};
            if (startDate) where.createdAt.gte = new Date(startDate);
            if (endDate) where.createdAt.lte = new Date(endDate);
        }

        const bills = await prisma.bill.findMany({
            where,
            orderBy: { createdAt: 'desc' }
        });

        res.json(bills);
    } catch (error) {
        console.error("Error fetching bills:", error);
        res.status(500).json({ message: "Error fetching bills", error: error.message });
    }
});

// Get single bill details
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const bill = await prisma.bill.findUnique({
            where: { id: parseInt(id) }
        });

        if (!bill) {
            return res.status(404).json({ message: "Bill not found" });
        }

        res.json(bill);
    } catch (error) {
        console.error("Error fetching bill:", error);
        res.status(500).json({ message: "Error fetching bill", error: error.message });
    }
});

export default router;
