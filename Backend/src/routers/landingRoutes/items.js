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
router.post("/", (req, res) => { })

// update a item 
router.put("/:id", (req, res) => { })

// Delete a item 
router.delete("/:id", (req, res) => { })

export default router;