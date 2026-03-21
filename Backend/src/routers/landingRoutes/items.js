import express from "express"
import prisma from "../../prismaClient.js";
import img from "../../media/Images.js";
import { deleteFromCloudinary, extractPublicId } from "../../utils/cloudinary.js";

const router = express.Router();

// get all items
router.get("/", async (req, res) => {
    try {
        const items = await prisma.item.findMany({
            where: { isbill: false }
        });
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
});

// get item by id
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
            ? req.file.path
            : null;

        const newItem = await prisma.item.create({
            data: {
                category,
                item_name,
                price: parseInt(price),
                image_url,
                isavailable: req.body.isavailable === "true" || req.body.isavailable === true,
                iskilo: req.body.iskilo === "true" || req.body.iskilo === true,
                isbill: req.body.isbill === "true" || req.body.isbill === true,
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
    const { item_name, price, isavailable, iskilo, isbill } = req.body;

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

    if (isavailable !== undefined) {
        data.isavailable =
            isavailable === "true" || isavailable === true;
    }

    if (iskilo !== undefined) {
        data.iskilo =
            iskilo === "true" || iskilo === true;
    }

    if (isbill !== undefined) {
        data.isbill =
            isbill === "true" || isbill === true;
    }

    // ✅ Only update image if new file uploaded
    if (req.file) {
        // Find existing item to delete old image
        try {
            const existingItem = await prisma.item.findUnique({ where: { id: Number(id) } });
            if (existingItem && existingItem.image_url) {
                const publicId = extractPublicId(existingItem.image_url);
                if (publicId) await deleteFromCloudinary(publicId);
            }
        } catch (err) {
            console.error("Error deleting old image during update:", err);
        }
        
        data.image_url = req.file.path;
    }

    try {
        const updatedItem = await prisma.item.update({
            where: { id: Number(id) },
            data,
        });

        /* console.log(
            `[${new Date().toISOString()}] Item updated`,
            updatedItem
        ); */

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
        // Find item to get image_url
        const item = await prisma.item.findUnique({ where: { id: Number(id) } });
        
        if (item && item.image_url) {
            const publicId = extractPublicId(item.image_url);
            if (publicId) await deleteFromCloudinary(publicId);
        }

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