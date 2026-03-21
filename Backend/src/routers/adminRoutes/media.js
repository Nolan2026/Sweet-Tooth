import express from "express";
import authenticateAdmin from "../../middleware/authentication/adminAuth.js";
import upload from "../../media/Images.js";
import { cloudinary, deleteFromCloudinary } from "../../utils/cloudinary.js";

const router = express.Router();

// Get all uploaded images
router.get("/", authenticateAdmin, async (req, res) => {
    try {
        // List resources from the "Sweet_Tooth" folder
        const result = await cloudinary.api.resources({
            type: "upload",
            prefix: "Sweet_Tooth/", // Folder name defined in cloudinary.js
            max_results: 100,
        });

        const images = result.resources.map(resource => ({
            filename: resource.public_id,
            url: resource.secure_url,
            size: resource.bytes,
            mtime: resource.created_at
        }));

        res.json(images);
    } catch (error) {
        console.error("Error fetching media from Cloudinary:", error);
        res.status(500).json({ message: "Error fetching media from Cloudinary" });
    }
});

// Delete an image
router.delete("/:publicId", authenticateAdmin, async (req, res) => {
    try {
        let publicId = decodeURIComponent(req.params.publicId);
        if (publicId && publicId.startsWith("/")) {
            publicId = publicId.substring(1);
        }
        
        if (!publicId) {
            return res.status(400).json({ message: "No publicId provided" });
        }

        await deleteFromCloudinary(publicId);
        res.json({ message: "File deleted successfully" });
    } catch (error) {
        console.error("Error deleting media from Cloudinary:", error);
        res.status(500).json({ message: "Error deleting media from Cloudinary" });
    }
});

// Bulk delete images
router.post("/bulk-delete", authenticateAdmin, async (req, res) => {
    try {
        const { publicIds } = req.body;
        if (!Array.isArray(publicIds)) {
            return res.status(400).json({ message: "Invalid request. Expected array of publicIds." });
        }

        if (publicIds.length === 0) {
            return res.json({ message: "No files to delete", deleted: [], failed: [] });
        }

        // Cloudinary supports deleting up to 100 resources at once
        const result = await cloudinary.api.delete_resources(publicIds);
        
        res.json({
            message: `Batch delete completed.`,
            result
        });
    } catch (error) {
        console.error("Error bulk deleting media from Cloudinary:", error);
        res.status(500).json({ message: "Error during bulk delete from Cloudinary" });
    }
});

// Replace/Update an image
router.post("/replace/:oldPublicId", authenticateAdmin, upload.single("image"), async (req, res) => {
    try {
        let oldPublicId = decodeURIComponent(req.params.oldPublicId);
        if (oldPublicId && oldPublicId.startsWith("/")) {
            oldPublicId = oldPublicId.substring(1);
        }

        if (oldPublicId) {
            await deleteFromCloudinary(oldPublicId);
        }

        if (!req.file) {
            return res.status(400).json({ message: "No new image uploaded" });
        }

        res.json({
            message: "Image replaced successfully",
            filename: req.file.path // Path is the URL in Cloudinary
        });
    } catch (error) {
        console.error("Error replacing media in Cloudinary:", error);
        res.status(500).json({ message: "Error replacing media in Cloudinary" });
    }
});

export default router;
