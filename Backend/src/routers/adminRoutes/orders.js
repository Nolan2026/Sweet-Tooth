import express from "express";
import prisma from "../../prismaClient.js";

const router = express.Router();

// Get all orders with user details
router.get("/", async (req, res) => {
    try {
        const { status, startDate, endDate } = req.query;

        let where = {};
        if (status) where.status = status;
        if (startDate || endDate) {
            where.createdAt = {};
            if (startDate) where.createdAt.gte = new Date(startDate);
            if (endDate) where.createdAt.lte = new Date(endDate);
        }

        const orders = await prisma.order.findMany({
            where,
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        email: true,
                        phone: true,
                        addresses: true,
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(orders);
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ message: "Error fetching orders", error: error.message });
    }
});

// get Order Details with order id
router.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {

        if (!id || isNaN(id)) {
            return res.status(400).json({ message: "Invalid Order Id" });
        }

        const orderbyId = await prisma.order.findUnique({
            where: {
                id: Number(id)
            },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        email: true,
                        phone: true,
                        addresses: {
                            select: {
                                street: true,
                                area: true,
                                district: true,
                                state: true,
                                pinCode: true,
                                country: true,
                            }
                        }
                    }
                }
            }
        });
        res.json(orderbyId);
    } catch (error) {
        console.error(`Error in Fetching Order By Id: ${id}`, error);
        res.status(500).json({ message: "Error fetching orders", error: error.message });
    }
});

// Update order status
router.patch("/:id/status", async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const orderId = parseInt(id);
        if (isNaN(orderId)) {
            return res.status(400).json({ message: "Invalid order ID" });
        }

        if (!status) {
            return res.status(400).json({ message: "Status is required" });
        }

        console.log(`Updating order ${orderId} status to: ${status}`);

        const order = await prisma.order.update({
            where: { id: orderId },
            data: { status }
        });

        res.json({ message: "Order status updated", order });
    } catch (error) {
        console.error("Error updating order:", error);
        res.status(500).json({ message: "Error updating order", error: error.message });
    }
});

// Delete order
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.order.delete({
            where: { id: parseInt(id) }
        });
        res.json({ message: "Order deleted successfully" });
    } catch (error) {
        console.error("Error deleting order:", error);
        res.status(500).json({ message: "Error deleting order", error: error.message });
    }
});

export default router;
