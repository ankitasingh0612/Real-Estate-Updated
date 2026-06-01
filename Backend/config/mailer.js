import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER || 'singhankit919869@gmail.com', // Using user's provided email as default
        pass: process.env.EMAIL_PASS // App Password is required for Gmail
    }
});

export const sendNotificationEmail = async (to, subject, html) => {
    try {
        const info = await transporter.sendMail({
            from: `"Quirex Real Estate" <${process.env.EMAIL_USER || 'singhankit919869@gmail.com'}>`,
            to,
            subject,
            html
        });
        console.log("📧 Email sent: %s", info.messageId);
        return true;
    } catch (error) {
        console.error("❌ Email error:", error);
        return false;
    }
};
