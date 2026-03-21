import express from "express";
import upload from "../../media/Images.js";

const router = express.Router();

router.post("/", upload.single("image"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "No image uploaded" });
    }

    res.json({
        message: "Image uploaded successfully",
        filename: req.file.path, // Return the Cloudinary URL
        public_id: req.file.filename // Return the public_id as filename
    });
});

export default router;
