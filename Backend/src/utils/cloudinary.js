import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";

dotenv.config({ quiet: true });

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "Sweet_Tooth", // You can change this to any folder name you want
        allowed_formats: ["jpg", "jpeg", "png", "webp", "gif"],
        // Extract public_id from original filename if needed, or leave it to be auto-generated
        // public_id: (req, file) => `${file.fieldname}-${Date.now()}`,
    },
});

/**
 * Delete image from Cloudinary
 * @param {string} publicId - The public ID of the image to delete
 * @returns {Promise<any>}
 */
const deleteFromCloudinary = async (publicId) => {
    try {
        if (!publicId) return null;
        const result = await cloudinary.uploader.destroy(publicId);
        return result;
    } catch (error) {
        console.error("Cloudinary delete error:", error);
        throw error;
    }
};

/**
 * Extract publicId from Cloudinary URL
 * @param {string} url - The Cloudinary image URL
 * @returns {string|null}
 */
const extractPublicId = (url) => {
    try {
        if (!url || !url.includes("cloudinary.com")) return null;
        
        // Example URL: https://res.cloudinary.com/demo/image/upload/v123456789/Sweet_Tooth/image-12345.jpg
        // We want: Sweet_Tooth/image-12345
        
        const parts = url.split("/");
        const filenameWithExt = parts.pop();
        const filename = filenameWithExt.split(".")[0];
        
        // Find the index of 'upload' and get everything after it EXCEPT the version part (vXXXXXX)
        const uploadIndex = parts.indexOf("upload");
        if (uploadIndex !== -1) {
            const pathParts = parts.slice(uploadIndex + 1);
            // If the next part starts with 'v' followed by numbers, it's the version part, skip it
            if (pathParts[0].match(/^v\d+$/)) {
                pathParts.shift();
            }
            return [...pathParts, filename].join("/");
        }
        
        return filename;
    } catch (error) {
        console.error("Error extracting public ID from URL:", error);
        return null;
    }
};

export { cloudinary, storage, deleteFromCloudinary, extractPublicId };
