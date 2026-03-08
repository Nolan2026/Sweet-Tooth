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
                orderReceiver: profile.order_receiver || process.env.OrderConformEmail || fromEmail,
                profile: profile // Return the full profile
            };
        }
    } catch (error) {
        console.error("Error fetching admin SMTP config:", error);
    }
    return {
        transporter: defaultTransporter,
        fromEmail: process.env.EMAIL,
        orderReceiver: process.env.OrderConformEmail || process.env.EMAIL,
        profile: { business_name: "Sweet Tooth" } // Fallback
    };
};

export const sendOtp = async (email, otp) => {
    const { transporter, fromEmail, profile } = await getTransporter();
    const businessName = profile?.business_name || "Sweet Tooth";

    return transporter.sendMail({
        from: fromEmail,
        to: email,
        subject: `Your OTP for ${businessName} - Verification Needed`,
        text: `Your OTP is ${otp}`,
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #ff69b4; text-align: center;">${businessName} Verification</h2>
            <p>Hello,</p>
            <p>Please use the following One-Time Password (OTP) to complete your verification process:</p>
            <div style="font-size: 24px; font-weight: bold; text-align: center; padding: 20px; background-color: #f9f9f9; border-radius: 5px; margin: 20px 0;">
                ${otp}
            </div>
            <p>This OTP is valid for 3 minutes. Please do not share this code with anyone.</p>
            <p>Thank you,<br>The ${businessName} Team</p>
        </div>
    `,
    });
};

export const sendOrderPlaced = async ({ id, paymentMethod, paymentDetails }) => {
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

        let { transporter, fromEmail, orderReceiver, profile } = await getTransporter();
        const businessName = profile?.business_name || "Sweet Tooth";

        // Format Payment Info
        let paymentInfoHtml = `<p style="margin: 5px 0;"><strong>Method:</strong> ${paymentMethod || 'N/A'}</p>`;
        if (paymentMethod === 'UPI' && paymentDetails?.upiId) {
            paymentInfoHtml += `<p style="margin: 5px 0;"><strong>UPI ID:</strong> ${paymentDetails.upiId}</p>`;
            if (paymentDetails.transactionId) {
                paymentInfoHtml += `<p style="margin: 5px 0;"><strong>Transaction ID:</strong> ${paymentDetails.transactionId}</p>`;
            }
        } else if (paymentMethod === 'Card' && paymentDetails?.cardNumber) {
            const cardNumber = String(paymentDetails.cardNumber);
            const maskedCard = cardNumber.slice(-4).padStart(cardNumber.length, '*');
            paymentInfoHtml += `<p style="margin: 5px 0;"><strong>Card:</strong> ${maskedCard}</p>`;
        } else if (paymentMethod === 'COD') {
            paymentInfoHtml += `<div> </div>`;
        }

        const emailHtml = (title, subtitle, showTrackingId = false) => `
            <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333; line-height: 1.6; border: 1px solid #eee; border-radius: 10px;">
                <div style="background-color: #ff69b4; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
                    <h1 style="color: white; margin: 0; font-size: 24px;">${title}</h1>
                    <p style="color: white; margin: 5px 0 0 0; opacity: 0.9;">${subtitle} #${orderData.id}</p>
                </div>
                
                <div style="padding: 20px; background-color: #fff;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                        <tr>
                            <td width="50%" valign="top" style="padding-right: 10px;">
                                <h3 style="border-bottom: 2px solid #ff69b4; padding-bottom: 5px; color: #ff69b4; font-size: 16px;">Customer Information</h3>
                                <p style="margin: 5px 0; font-size: 14px;"><strong>Name:</strong> ${orderData.user.username}</p>
                                <p style="margin: 5px 0; font-size: 14px;"><strong>Phone:</strong> ${orderData.user.phone}</p>
                                <p style="margin: 5px 0; font-size: 14px;"><strong>Date:</strong> ${new Date(orderData.createdAt).toLocaleString()}</p>
                                ${showTrackingId ? `<p style="margin: 5px 0; font-size: 14px;"><strong>Tracking ID:</strong> ${orderData.trackingId || 'N/A'}</p>` : ''}
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
                        <p>You are receiving this because an order was placed on ${businessName}.</p>
                        ${profile?.address ? `<p>${profile.address}</p>` : ''}
                        ${profile?.phone ? `<p>Contact: ${profile.phone}</p>` : ''}
                        <p>&copy; ${new Date().getFullYear()} ${businessName}. All rights reserved.</p>
                    </div>
                </div>
            </div>
        `;

        // Send to Admin
        await transporter.sendMail({
            from: fromEmail,
            to: orderReceiver,
            subject: `New Order No: ${orderData.id} - ${businessName} (${orderData.user.username})`,
            text: `A new order has been placed by ${orderData.user.username}. Total: ₹${orderData.total}`,
            html: emailHtml("New Order Placed!", "Order", true)
        });

        // Send to User if email exists
        if (orderData.user.email) {
            await transporter.sendMail({
                from: fromEmail,
                to: orderData.user.email,
                subject: `Order Confirmation - #${orderData.id} - ${businessName}`,
                text: `Hello ${orderData.user.username}, thank you for your order! Your Order ID is #${orderData.id}. Total: ₹${orderData.total}`,
                html: emailHtml("Thank You for Your Order!", "Order Confirmation", false)
            });
        }

    } catch (error) {
        console.error("Error in sendOrderPlaced:", error);
    }
};

export const sendOrderCancelled = async (id) => {
    try {
        const orderData = await prisma.order.findUnique({
            where: { id: Number(id) },
            include: { user: true }
        });

        if (!orderData) return;

        let { transporter, fromEmail, orderReceiver, profile } = await getTransporter();
        const businessName = profile?.business_name || "Sweet Tooth";

        const cancelHtml = `
            <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 0; color: #333; line-height: 1.6; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
                <div style="background-color: #ef4444; padding: 30px 20px; text-align: center;">
                    <div style="background-color: white; width: 60px; height: 60px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 15px;">
                        <span style="color: #ef4444; font-size: 30px; font-weight: bold;">✕</span>
                    </div>
                    <h1 style="color: white; margin: 0; font-size: 26px; font-weight: 600;">Order Cancelled</h1>
                    <p style="color: #fee2e2; margin: 8px 0 0 0; font-size: 16px;">Order #${orderData.id}</p>
                </div>
                
                <div style="padding: 30px 25px; background-color: #ffffff;">
                    <p style="font-size: 16px; margin-top: 0;">Hello <strong>${orderData.user.username}</strong>,</p>
                    <p style="font-size: 15px; color: #555;">This email is to confirm that your order <strong>#${orderData.id}</strong> with <strong>${businessName}</strong> has been successfully cancelled.</p>
                    
                    <div style="background-color: #f9fafb; border: 1px solid #f3f4f6; border-radius: 8px; padding: 15px; margin: 25px 0;">
                        <p style="margin: 0; color: #4b5563; font-size: 14px;"><strong>Note:</strong> If you have already made a payment, refunds will be initiated according to our standard refund policy and may take up to 5-7 business days to reflect in your account.</p>
                    </div>
                    
                    <p style="font-size: 15px; color: #555;">If you cancelled this order by mistake or if you need any further assistance, our support team is always here to help.</p>
                    
                    <div style="margin-top: 35px; border-top: 1px solid #f3f4f6; padding-top: 25px; text-align: center;">
                        <p style="margin: 0; font-size: 14px; font-weight: bold; color: #374151;">${businessName}</p>
                        ${profile?.address ? `<p style="margin: 5px 0 0; font-size: 13px; color: #6b7280;">${profile.address}</p>` : ''}
                        ${profile?.phone ? `<p style="margin: 5px 0 0; font-size: 13px; color: #6b7280;">Contact: ${profile.phone}</p>` : ''}
                        <p style="margin: 15px 0 0; font-size: 12px; color: #9ca3af;">&copy; ${new Date().getFullYear()} ${businessName}. All rights reserved.</p>
                    </div>
                </div>
            </div>
        `;

        // Send to Admin
        await transporter.sendMail({
            from: fromEmail,
            to: orderReceiver,
            subject: `Order Cancelled - #${orderData.id} - ${businessName}`,
            text: `Order #${orderData.id} has been cancelled by ${orderData.user.username}.`,
            html: cancelHtml
        });

        // Send to User
        if (orderData.user.email) {
            await transporter.sendMail({
                from: fromEmail,
                to: orderData.user.email,
                subject: `Order Cancelled - #${orderData.id} - ${businessName}`,
                text: `Your order #${orderData.id} has been cancelled successfully.`,
                html: cancelHtml
            });
        }
    } catch (error) {
        console.error("Error in sendOrderCancelled:", error);
    }
};

export default sendOtp;

