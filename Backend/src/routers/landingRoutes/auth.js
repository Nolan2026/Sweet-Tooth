import express from "express";
import prisma from "../../prismaClient.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validateRegistration, validateLogin } from "../../middleware/validation/inputValidator.js";

const router = express.Router();

// user register
router.post("/register", validateRegistration, async (req, res) => {
    try {
        console.log("Registration request body:", JSON.stringify(req.body));
        const { username, email, password, phone } = req.body;
        const cleanEmail = email.trim().toLowerCase();
        const cleanUsername = username.trim();

        if (!cleanUsername || !cleanEmail || !password || !phone) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (phone.length > 15) {
            return res.status(400).json({ message: "Mobile number is too long (max 15 characters)" });
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
        console.error("Registration error details:", error);
        if (error.code === 'P2002') {
            return res.status(400).json({
                message: "Username or Email already exists",
                field: error.meta?.target
            });
        }
        res.status(500).json({
            message: "Internal server error during registration",
            error: error.message
        });
    }
});

// user login
router.post("/login", validateLogin, async (req, res) => {
    try {
        const { email, password } = req.body;
        const cleanEmail = email.trim().toLowerCase();

        if (!cleanEmail || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        // Find user by email
        const user = await prisma.user.findUnique({
            where: { email: cleanEmail }
        });

        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Generate JWT
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
        console.error("Login error details:", error);
        res.status(500).json({
            message: "Internal server error during login",
            error: error.message
        });
    }
});


export default router;