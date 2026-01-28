import express from "express"
import prisma from "../../prismaClient.js";

const router = express.Router();

// get all items
router.get("/", async (req, res) => {
    try {
        const items = await prisma.item.findMany();
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({error: error.message})
    }
});

// add new item 
router.post("/", async (req, res) => { 
    const { category, item_name, price, image_url } = req.body;
    try {
        const newItem = await prisma.item.create({
            data: {
                category,
                item_name,
                price: parseInt(price),
                image_url
            }
        });
        res.status(201).json(newItem);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// update a item 
router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { price } = req.body;

    // 🔒 HARD VALIDATION
    if (!Number.isInteger(price)) {
        return res.status(400).json({
            error: "Price must be a valid integer",
        });
    }

    try {
        const updatedItem = await prisma.item.update({
            where: { id: Number(id) },
            data: { price },
        });

        res.status(200).json(updatedItem);
    } catch (error) {
        console.error("PRISMA UPDATE ERROR:", error);

        if (error.code === "P2025") {
            return res.status(404).json({ error: "Item not found" });
        }

        res.status(500).json({ error: error.message });
    }
});


// Delete a item 
router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.item.delete({where:{id: Number(id) } });
        res.status(200).json({message: "Item deleted successfully"});
    } catch (error) {
        if (error.code === "P2025") {
            return res.status(404).json({ error: "Item not found" });
        }
        res.status(500).json({ error: error.message})
    }
});

export default router;