import express from "express";
import prisma from "../../prismaClient.js";

const router = express.Router();

// Get all contact messages
router.get("/", async (req, res) => {
    try {
        const messages = await prisma.contact.findMany({
            orderBy: { createdAt: 'desc' }
        });

        res.json(messages);
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ message: "Error fetching messages", error: error.message });
    }
});

// Delete a message
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        await prisma.contact.delete({
            where: { id: parseInt(id) }
        });

        res.json({ message: "Message deleted successfully" });
    } catch (error) {
        console.error("Error deleting message:", error);
        res.status(500).json({ message: "Error deleting message", error: error.message });
    }
});

export default router;
