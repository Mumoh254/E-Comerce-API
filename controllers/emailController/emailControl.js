const nodemailer = require("nodemailer");
const asyncHandler = require("express-async-handler");
require("dotenv").config();

const sendEmail = asyncHandler(async (data) => {
    // Field validation
    if (!data.to || !data.subject || (!data.text && !data.html)) {
        throw new Error("Missing required fields: 'to', 'subject', 'text' or 'html'");
    }

    // Validate email format
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(data.to)) {
        throw new Error("Invalid email address.");
    }

    try {
        // Create  Gmail SMTP
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true, // Use SSL
            auth: {
                user: process.env.MAILER_ID, 
                pass: process.env.MAILER_ID_PASSWORD,
            },
            tls: {
                rejectUnauthorized: false, // Bypass SSL 
            },
        });

      
        const info = await transporter.sendMail({
            from: `"Majesty Shoe Collection" <${process.env.MAILER_ID}>`,
            to: data.to, 
            subject: data.subject, 
            text: data.text || "", 
            html: data.html,
        });

        console.log("Email sent successfully! Message ID:", info.messageId);
        return info.messageId; 

    } catch (error) {
        console.error("Error sending email:", error);
        throw new Error("Failed to send email: " + error.message);
    }
});

module.exports = sendEmail;