import express from "express";
import prisma from "../../prismaClient.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validateRegistration, validateLogin } from "../../middleware/validation/inputValidator.js";
import sendOtp from "../adminRoutes/sendOtp.js";

const router = express.Router();

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// 1. Initial Registration Request
router.post("/register", validateRegistration, async (req, res) => {
    try {
        const { username, email, password, phone } = req.body;
        const cleanEmail = email.trim().toLowerCase();
        const cleanUsername = username.trim();

        const existingUser = await prisma.user.findUnique({ where: { email: cleanEmail } });
        if (existingUser) {
            return res.status(400).json({ message: "Email already registered" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const otp = generateOTP();
        const expiry = new Date(Date.now() + 3 * 60 * 1000); // 3 mins

        // Create user with isVerified: false
        await prisma.user.create({
            data: {
                username: cleanUsername,
                email: cleanEmail,
                phone: phone.trim(),
                password: hashedPassword,
                isVerified: false,
                otp: otp,
                otpExpiresAt: expiry
            }
        });

        await sendOtp(cleanEmail, otp);

        res.status(201).json({
            message: "OTP sent to your email for verification.",
            email: cleanEmail
        });
    } catch (error) {
        console.error("Register Error:", error);
        if (error.code === 'P2002') {
            return res.status(400).json({ message: "Username or Email already exists" });
        }
        res.status(500).json({ message: "Internal server error" });
    }
});

// 2. Initial Login Request
router.post("/login", validateLogin, async (req, res) => {
    try {
        const { email, password } = req.body;
        const cleanEmail = email.trim().toLowerCase();

        const user = await prisma.user.findUnique({ where: { email: cleanEmail } });
        if (!user) return res.status(401).json({ message: "Invalid email or password" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "Invalid email or password" });

        // Generate OTP for login
        const otp = generateOTP();
        const expiry = new Date(Date.now() + 3 * 60 * 1000); // 3 mins

        await prisma.user.update({
            where: { email: cleanEmail },
            data: {
                otp: otp,
                otpExpiresAt: expiry
            }
        });

        await sendOtp(cleanEmail, otp);

        res.status(200).json({
            message: "OTP sent to your email for login verification.",
            email: cleanEmail,
            requiresOtp: true
        });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// 3. Verify OTP (Shared for Registration and Login)
router.post("/verify-otp", async (req, res) => {
    try {
        const { email, otp, type } = req.body; // type: 'register' or 'login'
        const cleanEmail = email?.trim().toLowerCase();

        if (!cleanEmail || !otp) {
            return res.status(400).json({ message: "Email and OTP are required" });
        }

        const user = await prisma.user.findUnique({ where: { email: cleanEmail } });

        if (!user || user.otp !== otp || (user.otpExpiresAt && new Date() > user.otpExpiresAt)) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        // Clear OTP after successful verification
        const updateData = {
            otp: null,
            otpExpiresAt: null
        };

        if (type === 'register') {
            updateData.isVerified = true;
        }

        await prisma.user.update({
            where: { id: user.id },
            data: updateData
        });

        const secret = process.env.JWT_SECRET;
        if (!secret) {
            if (process.env.NODE_ENV === 'production') {
                throw new Error("JWT_SECRET is required in production");
            }
            console.warn("WARNING: JWT_SECRET not set, using default for development");
        }

        const token = jwt.sign(
            { id: user.id, email: user.email },
            secret || "default_secret",
            { expiresIn: "1d" }
        );

        res.status(200).json({
            message: type === 'register' ? "Verification successful and registered" : "Login successful",
            token,
            user: { id: user.id, username: user.username, email: user.email, phone: user.phone }
        });
    } catch (error) {
        console.error("Verify OTP Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// 4. Resend OTP
router.post("/resend-otp", async (req, res) => {
    try {
        const { email } = req.body;
        const cleanEmail = email?.trim().toLowerCase();

        if (!cleanEmail) {
            return res.status(400).json({ message: "Email is required" });
        }

        const user = await prisma.user.findUnique({ where: { email: cleanEmail } });
        if (!user) return res.status(404).json({ message: "User not found" });

        const otp = generateOTP();
        const expiry = new Date(Date.now() + 3 * 60 * 1000); // 3 mins

        await prisma.user.update({
            where: { email: cleanEmail },
            data: {
                otp: otp,
                otpExpiresAt: expiry
            }
        });

        await sendOtp(cleanEmail, otp);

        res.status(200).json({ message: "OTP resent successfully" });
    } catch (error) {
        console.error("Resend OTP Error:", error);
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

        const otp = generateOTP();
        const expiry = new Date(Date.now() + 3 * 60 * 1000); // 3 mins

        await prisma.user.update({
            where: { id: user.id },
            data: {
                resetToken: otp,
                resetTokenExpiry: expiry
            }
        });

        await sendOtp(cleanEmail, otp);
        res.json({ message: "OTP sent to your email" });
    } catch (error) {
        console.error("Forgot Password Error:", error);
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

        if (!user || user.resetToken !== otp || (user.resetTokenExpiry && new Date() > user.resetTokenExpiry)) {
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
        console.error("Reset Password Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

export default router;