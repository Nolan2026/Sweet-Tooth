import express from "express"
import prisma from "../../prismaClient.js";
import img from "../../media/Images.js";

const router = express.Router();

// get all items
router.get("/", async (req, res) => {
    try {
        const items = await prisma.item.findMany();
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
});

router.get("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const item = await prisma.item.findUnique({
            where: { id: Number(id) },
        });

        if (!item) {
            return res.status(404).json({ error: "Item not found" });
        }

        res.json(item);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// add new item
router.post("/", img.single("image"), async (req, res) => {
    try {
        const { category, item_name, price } = req.body;

        const image_url = req.file
            ? `/uploads/${req.file.filename}`
            : null;

        const newItem = await prisma.item.create({
            data: {
                category,
                item_name,
                price: parseInt(price),
                image_url,
            },
        });

        res.status(201).json(newItem);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});


// update a item 
// Update item by ID
router.put("/:id", img.single("image"), async (req, res) => {
    const { id } = req.params;
    const { item_name, price, availability } = req.body;

    // 🔥 Build update object safely
    const data = {};

    if (item_name !== undefined) {
        data.item_name = item_name;
    }

    if (price !== undefined) {
        const parsedPrice = Number(price);

        if (!Number.isInteger(parsedPrice)) {
            return res.status(400).json({
                error: "Price must be an integer",
            });
        }

        data.price = parsedPrice;
    }

    if (availability !== undefined) {
        data.availability =
            availability === "true" || availability === true;
    }

    // ✅ Only update image if new file uploaded
    if (req.file) {
        data.image_url = `/uploads/${req.file.filename}`;
    }

    try {
        const updatedItem = await prisma.item.update({
            where: { id: Number(id) },
            data,
        });

        console.log(
            `[${new Date().toISOString()}] Item updated`,
            updatedItem
        );

        res.status(200).json(updatedItem);
    } catch (error) {
        console.error("PUT /items/:id ERROR:", error);

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
        await prisma.item.delete({ where: { id: Number(id) } });
        res.status(200).json({ message: "Item deleted successfully" });
    } catch (error) {
        if (error.code === "P2025") {
            return res.status(404).json({ error: "Item not found" });
        }
        res.status(500).json({ error: error.message })
    }
});

export default router;