import express from "express";
import prisma from "../../prismaClient.js";

const router = express.Router();

// Submit a contact form
router.post("/submit", async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ message: "Name, email and message are required" });
        }

        const contact = await prisma.contact.create({
            data: {
                name,
                email,
                subject: subject || "No Subject",
                message
            }
        });

        res.status(201).json({
            message: "Thank you for reaching out! We'll get back to you soon.",
            id: contact.id
        });
    } catch (error) {
        console.error("Error submitting contact form:", error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
});

export default router;
