import nodemailer from "nodemailer";
import dotenv from "dotenv";
import prisma from "../../prismaClient.js";
import { decrypt } from "../../utils/encryption.js";

dotenv.config({ quiet: true });

// Default transporter as fallback
const defaultTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.GMAIL_PASSWORD,
    },
});

const getTransporter = async () => {
    try {
        const profile = await prisma.adminProfile.findFirst();
        if (profile) {
            let transporter = defaultTransporter;
            let fromEmail = process.env.EMAIL;

            if (profile.smtp_email && profile.smtp_password) {
                const decryptedPassword = decrypt(profile.smtp_password);
                if (decryptedPassword) {
                    transporter = nodemailer.createTransport({
                        service: "gmail",
                        auth: {
                            user: profile.smtp_email,
                            pass: decryptedPassword,
                        },
                    });
                    fromEmail = profile.smtp_email;
                }
            }

            return {
                transporter,
                fromEmail,
                orderReceiver: profile.order_receiver || process.env.OrderConformEmail || fromEmail
            };
        }
    } catch (error) {
        console.error("Error fetching admin SMTP config:", error);
    }
    return {
        transporter: defaultTransporter,
        fromEmail: process.env.EMAIL,
        orderReceiver: process.env.OrderConformEmail || process.env.EMAIL
    };
};

export const sendOtp = async (email, otp) => {
    const { transporter, fromEmail } = await getTransporter();
    return transporter.sendMail({
        from: fromEmail,
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
            <p>This OTP is valid for 3 minutes. Please do not share this code with anyone.</p>
            <p>Thank you,<br>The Sweet Tooth Team</p>
        </div>
    `,
    });
};

export const sendOrderPlaced = async ({ id, paymentMethod, paymentDetails}) => {
    try {
        const orderData = await prisma.order.findUnique({
            where: {
                id: Number(id)
            },
            include: {
                user: {
                    include: {
                        addresses: true
                    }
                }
            }
        });

        if (!orderData) {
            console.error(`Order with ID ${id} not found`);
            return;
        }

        let itemsSubtotal = 0;
        const itemsRows = (orderData.items || []).map(item => {
            itemsSubtotal += item.subtotal;
            let displayUnit = "";
            if (item.isKilo) {
                const w = parseFloat(item.weight);
                displayUnit = w >= 1 ? `${w}kg` : `${w * 1000}g`;
            } else {
                displayUnit = `${item.quantity} pcs`;
            }

            return `
            <tr>
                <td style="border-bottom: 1px solid #eee; font-size: 14px; padding: 10px 0;">
                    <strong>${item.name}</strong><br/>
                    <small style="color: #666;">Unit: ${displayUnit}</small>
                </td>
                <td align="center" style="border-bottom: 1px solid #eee; font-size: 14px; padding: 10px 0;">${item.quantity}</td>
                <td align="right" style="border-bottom: 1px solid #eee; font-size: 14px; padding: 10px 0;">₹${item.subtotal}</td>
            </tr>
        `}).join("");

        const discountAmount = itemsSubtotal - orderData.total;

        let { transporter, fromEmail, orderReceiver } = await getTransporter();

        // Format Payment Info
        let paymentInfoHtml = `<p style="margin: 5px 0;"><strong>Method:</strong> ${paymentMethod || 'N/A'}</p>`;
        if (paymentMethod === 'UPI' && paymentDetails?.upiId) {
            paymentInfoHtml += `<p style="margin: 5px 0;"><strong>UPI ID:</strong> ${paymentDetails.upiId}</p>`;
        } else if (paymentMethod === 'Card' && paymentDetails?.cardNumber) {
            const cardNumber = String(paymentDetails.cardNumber);
            const maskedCard = cardNumber.slice(-4).padStart(cardNumber.length, '*');
            paymentInfoHtml += `<p style="margin: 5px 0;"><strong>Card:</strong> ${maskedCard}</p>`;
        } else if (paymentMethod === 'COD'){ paymentMethod += `<div> </div>`}
        
        return transporter.sendMail({
            from: fromEmail,
            to: orderReceiver,
            subject: `New Order No: ${orderData.id} - Sweet Tooth (${orderData.user.username})`,
            text: `A new order has been placed by ${orderData.user.username}. Total: ₹${orderData.total}`,
            html: `
            <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333; line-height: 1.6; border: 1px solid #eee; border-radius: 10px;">
                <div style="background-color: #ff69b4; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
                    <h1 style="color: white; margin: 0; font-size: 24px;">New Order Placed!</h1>
                    <p style="color: white; margin: 5px 0 0 0; opacity: 0.9;">Order #${orderData.id}</p>
                </div>
                
                <div style="padding: 20px; background-color: #fff;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                        <tr>
                            <td width="50%" valign="top" style="padding-right: 10px;">
                                <h3 style="border-bottom: 2px solid #ff69b4; padding-bottom: 5px; color: #ff69b4; font-size: 16px;">Customer Information</h3>
                                <p style="margin: 5px 0; font-size: 14px;"><strong>Name:</strong> ${orderData.user.username}</p>
                                <p style="margin: 5px 0; font-size: 14px;"><strong>Phone:</strong> ${orderData.user.phone}</p>
                                <p style="margin: 5px 0; font-size: 14px;"><strong>Date:</strong> ${new Date(orderData.createdAt).toLocaleString()}</p>
                                <p style="margin: 5px 0; font-size: 14px;"><strong>Payment Method:</strong> ${paymentMethod}</p>
                                ${paymentInfoHtml}
                            </td>
                            <td width="50%" valign="top" style="padding-left: 10px;">
                                <h3 style="border-bottom: 2px solid #ff69b4; padding-bottom: 5px; color: #ff69b4; font-size: 16px;">Shipping Address</h3>
                                ${orderData.user.addresses[0] ? `
                                    <div style="font-size: 14px; color: #555;">
                                        <p style="margin: 0;">${orderData.user.addresses[0].street}, ${orderData.user.addresses[0].area}</p>
                                        <p style="margin: 5px 0 0 0;">${orderData.user.addresses[0].district}, ${orderData.user.addresses[0].state} - ${orderData.user.addresses[0].pinCode}</p>
                                        <p style="margin: 5px 0 0 0;">${orderData.user.addresses[0].country}</p>
                                    </div>
                                ` : "<p style='color: #666; font-style: italic; font-size: 14px;'>No address found.</p>"}
                            </td>
                        </tr>
                    </table>

                    <div style="margin-top: 25px;">
                        <h3 style="border-bottom: 2px solid #ff69b4; padding-bottom: 5px; color: #ff69b4; font-size: 16px;">Order Summary</h3>
                        <table width="100%" border="0" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
                            <thead>
                                <tr style="background-color: #f9f9f9;">
                                    <th align="left" style="padding: 10px; border-bottom: 1px solid #eee; font-size: 13px; text-transform: uppercase;">Item</th>
                                    <th align="center" style="padding: 10px; border-bottom: 1px solid #eee; font-size: 13px; text-transform: uppercase;">Qty</th>
                                    <th align="right" style="padding: 10px; border-bottom: 1px solid #eee; font-size: 13px; text-transform: uppercase;">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${itemsRows}
                                ${discountAmount > 0 ? `
                                <tr style="background-color: #fcfcfc;">
                                    <td colspan="2" align="right" style="padding: 10px 10px; font-size: 14px; color: #666;">Subtotal:</td>
                                    <td align="right" style="padding: 10px 10px; font-size: 14px; color: #666;">₹${itemsSubtotal}</td>
                                </tr>
                                <tr style="background-color: #fcfcfc;">
                                    <td colspan="2" align="right" style="padding: 10px 10px; font-size: 14px; color: #e71d36;">Coupon Discount:</td>
                                    <td align="right" style="padding: 10px 10px; font-size: 14px; color: #e71d36;">-₹${discountAmount}</td>
                                </tr>
                                ` : ''}
                                <tr style="background-color: #fcfcfc;">
                                    <td colspan="2" align="right" style="padding: 15px 10px; font-size: 15px;"><strong>Final Total:</strong></td>
                                    <td align="right" style="padding: 15px 10px; font-size: 18px; color: #ff69b4;"><strong>₹${orderData.total}</strong></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div style="text-align: center; margin-top: 40px; border-top: 1px solid #eee; padding-top: 20px; font-size: 12px; color: #999;">
                        <p>You are receiving this because an order was placed on Sweet Tooth.</p>
                        <p>&copy; ${new Date().getFullYear()} Sweet Tooth. All rights reserved.</p>
                    </div>
                </div>
            </div>
            `
        });
    } catch (error) {
        console.error("Error in sendOrderPlaced:", error);
    }
};


export default sendOtp;
