import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.GMAIL_PASSWORD, // make sure spelling is correct in .env
    },
});

const sendOtp = async (email, otp) => {
    return transporter.sendMail({
        from: process.env.EMAIL,
        to: email,
        subject: "Your OTP for Sweet Tooth - Verification Needed",
        text: `Your OTP is ${otp}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                <h2 style="color: #ff69b4; text-align: center;">Sweet Tooth Verification</h2>
                <p>Hello,</p>
                <p>Please use the following One-Time Password (OTP) to complete your verification process:</p>
                <div style="font-size: 24px; font-weight: bold; text-align: center; padding: 20px; background-color: #f9f9f9; border-radius: 5px; margin: 20px 0;">
                    ${otp}
                </div>
                <p>This OTP is valid for 10 minutes. Please do not share this code with anyone.</p>
                <p>Thank you,<br>The Sweet Tooth Team</p>
            </div>
        `,
    });
};

export default sendOtp;