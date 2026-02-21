import express from "express";
import fs from "fs";
import path from "path";
import authenticateAdmin from "../../middleware/authentication/adminAuth.js";
import upload from "../../media/Images.js";

const router = express.Router();
const uploadDir = path.join(process.cwd(), "uploads");

// Get all uploaded images
router.get("/", authenticateAdmin, async (req, res) => {
    try {
        if (!fs.existsSync(uploadDir)) {
            return res.json([]);
        }

        const files = fs.readdirSync(uploadDir);
        const images = files.filter(file => {
            const ext = path.extname(file).toLowerCase();
            return [".jpg", ".jpeg", ".png", ".webp", ".gif"].includes(ext);
        }).map(file => ({
            filename: file,
            url: `/uploads/${file}`,
            size: fs.statSync(path.join(uploadDir, file)).size,
            mtime: fs.statSync(path.join(uploadDir, file)).mtime
        }));

        // Sort by newest first
        images.sort((a, b) => b.mtime - a.mtime);

        res.json(images);
    } catch (error) {
        console.error("Error fetching media:", error);
        res.status(500).json({ message: "Error fetching media" });
    }
});

// Delete an image
router.delete("/:filename", authenticateAdmin, async (req, res) => {
    try {
        const { filename } = req.params;
        const filePath = path.join(uploadDir, filename);

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ message: "File not found" });
        }

        fs.unlinkSync(filePath);
        res.json({ message: "File deleted successfully" });
    } catch (error) {
        console.error("Error deleting media:", error);
        res.status(500).json({ message: "Error deleting media" });
    }
});

// Replace/Update an image (by uploading a new one and deleting the old one)
router.post("/replace/:oldFilename", authenticateAdmin, upload.single("image"), async (req, res) => {
    try {
        const { oldFilename } = req.params;
        const oldPath = path.join(uploadDir, oldFilename);

        if (fs.existsSync(oldPath)) {
            fs.unlinkSync(oldPath);
        }

        if (!req.file) {
            return res.status(400).json({ message: "No new image uploaded" });
        }

        res.json({
            message: "Image replaced successfully",
            filename: req.file.filename
        });
    } catch (error) {
        console.error("Error replacing media:", error);
        res.status(500).json({ message: "Error replacing media" });
    }
});

export default router;
