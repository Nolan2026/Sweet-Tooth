import express from "express";
import prisma from "../../prismaClient.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { validateRegistration, validateLogin } from "../../middleware/validation/inputValidator.js";

const router = express.Router();

// user register
router.post("/register", validateRegistration, async (req, res) => {
    try {
        const { username, email, password, phone } = req.body;
        const cleanEmail = email.trim().toLowerCase();
        const cleanUsername = username.trim();

        if (!cleanUsername || !cleanEmail || !password || !phone) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await prisma.user.create({
            data: {
                username: cleanUsername,
                email: cleanEmail,
                phone: phone.trim(),
                password: hashedPassword
            }
        });

        res.status(201).json({
            message: "User registered successfully",
            user: { id: newUser.id, username: newUser.username, email: newUser.email, phone: newUser.phone }
        });
    } catch (error) {
        if (error.code === 'P2002') {
            return res.status(400).json({ message: "Username or Email already exists" });
        }
        res.status(500).json({ message: "Internal server error" });
    }
});

// user login
router.post("/login", validateLogin, async (req, res) => {
    try {
        const { email, password } = req.body;
        const cleanEmail = email.trim().toLowerCase();

        const user = await prisma.user.findUnique({ where: { email: cleanEmail } });
        if (!user) return res.status(401).json({ message: "Invalid email or password" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "Invalid email or password" });

        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET || "default_secret",
            { expiresIn: "1d" }
        );

        res.status(200).json({
            message: "Login successful",
            token,
            user: { id: user.id, username: user.username, email: user.email, phone: user.phone }
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

// Forgot Password
router.post("/forgot-password", async (req, res) => {
    try {
        const { email } = req.body;
        const cleanEmail = email.trim().toLowerCase();

        const user = await prisma.user.findUnique({
            where: { email: cleanEmail }
        });

        if (!user) {
            return res.status(404).json({ message: "User not found with this email" });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiry = new Date(Date.now() + 15 * 60 * 1000);

        await prisma.user.update({
            where: { id: user.id },
            data: {
                resetToken: otp,
                resetTokenExpiry: expiry
            }
        });

        console.log(`[AUTH] Reset OTP for ${cleanEmail}: ${otp}`);
        res.json({ message: "OTP sent to your email (Check console for now)" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

// Reset Password
router.post("/reset-password", async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        const cleanEmail = email.trim().toLowerCase();

        const user = await prisma.user.findUnique({
            where: { email: cleanEmail }
        });

        if (!user || user.resetToken !== otp || new Date() > user.resetTokenExpiry) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                resetToken: null,
                resetTokenExpiry: null
            }
        });

        res.json({ message: "Password reset successful. You can now login." });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

export default router;