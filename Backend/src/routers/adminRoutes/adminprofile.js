import express from "express";
import prisma from "../../prismaClient.js";
import authenticateAdmin from "../../middleware/authentication/adminAuth.js";
import { encrypt } from "../../utils/encryption.js";
import upload from "../../media/Images.js";
import { deleteFromCloudinary, extractPublicId } from "../../utils/cloudinary.js";

const router = express.Router();

// Helper to sanitize profile (remove sensitive data)
const sanitizeProfile = (profile) => {
    if (!profile) return profile;
    const { smtp_password, ...safeProfile } = profile;
    return {
        ...safeProfile,
        has_smtp_config: !!(profile.smtp_email && profile.smtp_password)
    };
};

// GET profile
router.get("/admin-profile", async (req, res) => {
    try {
        let profile = await prisma.adminProfile.findFirst();
        if (!profile) {
            // Create a default one if it doesn't exist
            profile = await prisma.adminProfile.create({
                data: {
                    business_name: "Sweet Tooth",
                    address: "Business Address",
                    gstin: "",
                    phone: "",
                    whatsapp: "",
                    business_email: "",
                    instagram_url: "",
                    facebook_url: ""
                }
            });
        }
        res.json(sanitizeProfile(profile));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST update profile
router.post("/admin-profile", authenticateAdmin, upload.fields([
    { name: "frontend_logo", maxCount: 1 },
    { name: "backend_logo", maxCount: 1 },
    { name: "business_logo", maxCount: 1 },
    { name: "Collections_image", maxCount: 1 },
    { name: "OurStory_image", maxCount: 1 }
]), async (req, res) => {
    try {
        const {
            business_name, address, gstin, phone, whatsapp,
            business_email, instagram_url, facebook_url,
            smtp_email, smtp_password, order_receiver, cod_limit,
            upi_id, upi_message
        } = req.body;
        const files = req.files;

        const data = {
            business_name,
            address,
            gstin,
            phone,
            whatsapp,
            business_email,
            instagram_url,
            facebook_url,
            smtp_email,
            order_receiver,
            cod_limit: cod_limit ? parseInt(cod_limit) : undefined,
            upi_id,
            upi_message
        };

        // Only update password if provided
        if (smtp_password) {
            data.smtp_password = encrypt(smtp_password);
        }

        if (files) {
            if (files.frontend_logo) data.frontend_logo = files.frontend_logo[0].path;
            if (files.backend_logo) data.backend_logo = files.backend_logo[0].path;
            if (files.business_logo) data.business_logo = files.business_logo[0].path;
            if (files.Collections_image) data.Collections_image = files.Collections_image[0].path;
            if (files.OurStory_image) data.OurStory_image = files.OurStory_image[0].path;
        }

        const existing = await prisma.adminProfile.findFirst();

        let profile;
        if (existing) {
            profile = await prisma.adminProfile.update({
                where: { id: existing.id },
                data
            });
        } else {
            profile = await prisma.adminProfile.create({
                data
            });
        }
        res.json(sanitizeProfile(profile));
    } catch (err) {
        console.error("Profile update error:", err);
        res.status(500).json({ error: err.message });
    }
});

// DELETE image from profile
router.delete("/admin-profile/image/:field", authenticateAdmin, async (req, res) => {
    try {
        const { field } = req.params;
        const existing = await prisma.adminProfile.findFirst();

        if (!existing || !existing[field]) {
            return res.status(404).json({ error: "Image not found" });
        }

        const imageUrl = existing[field];
        const publicId = extractPublicId(imageUrl);

        // Delete from Cloudinary if publicId exists
        if (publicId) {
            await deleteFromCloudinary(publicId);
        }

        // Update database to nullify the field
        const updated = await prisma.adminProfile.update({
            where: { id: existing.id },
            data: { [field]: null }
        });

        res.json({ message: "Image deleted", updated });
    } catch (err) {
        console.error("Image delete error:", err);
        res.status(500).json({ error: err.message });
    }
});

export default router;

