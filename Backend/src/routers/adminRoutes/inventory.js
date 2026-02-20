import express from "express";
import prisma from "../../prismaClient.js";

const router = express.Router();

// Get all items for inventory
router.get("/items", async (req, res) => {
    try {
        const items = await prisma.item.findMany({
            orderBy: { category: 'asc' }
        });

        res.json(items);
    } catch (error) {
        console.error("Error fetching items:", error);
        res.status(500).json({ message: "Error fetching items", error: error.message });
    }
});

// Toggle item availability
router.patch("/items/:id/isavailable", async (req, res) => {
    try {
        const { id } = req.params;

        const currentItem = await prisma.item.findUnique({
            where: { id: parseInt(id) }
        });

        if (!currentItem) {
            return res.status(404).json({ message: "Item not found" });
        }

        const updatedItem = await prisma.item.update({
            where: { id: parseInt(id) },
            data: { isavailable: !currentItem.isavailable }
        });

        res.json({
            message: "Item availability updated",
            item: updatedItem
        });
    } catch (error) {
        console.error("Error updating item availability:", error);
        res.status(500).json({ message: "Error updating availability", error: error.message });
    }
});

// Update item details
router.patch("/items/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { item_name, price, category } = req.body;

        const updatedItem = await prisma.item.update({
            where: { id: parseInt(id) },
            data: {
                ...(item_name && { item_name }),
                ...(price && { price: parseInt(price) }),
                ...(category && { category })
            }
        });

        res.json({
            message: "Item updated successfully",
            item: updatedItem
        });
    } catch (error) {
        console.error("Error updating item:", error);
        res.status(500).json({ message: "Error updating item", error: error.message });
    }
});

export default router;
