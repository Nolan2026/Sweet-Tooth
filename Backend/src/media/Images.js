import multer from "multer";
import { storage } from "../utils/cloudinary.js";

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        } else {
            cb(new Error("Only image files allowed"), false);
        }
    },
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit for Cloudinary
});

export default upload;
