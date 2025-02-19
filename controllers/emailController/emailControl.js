const nodemailer = require("nodemailer");
const asyncHandler = require("express-async-handler");
require("dotenv").config();

const sendEmail = asyncHandler(async (data) => {
    // field validation
    if (!data.to || !data.subject || (!data.text && !data.html)) {
        throw new Error("Missing required fields: 'to', 'subject', 'text' or 'html'");
    }

    // Validate email format
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(data.to)) {
        throw new Error("Invalid email address.");
    }

    try {
        // transporter
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true, // Use SSL
            auth: {
                user: process.env.MAILER_ID,
                pass: process.env.MAILER_ID_PASSWORD, 
            },
            tls: {
                rejectUnauthorized: false,
            },
        });

        // Send mail with defined transport object
        let info = await transporter.sendMail({
            from: `"Majesty Shoe Collection" <${process.env.MAILER_ID}>`, // Sender address
            to: data.to, // Receiver's address
            subject: data.subject,
            text: data.text || "", 
            html: data.html, // HTML content
        });

        return info.messageId;
        
    } catch (error) {

        console.error("Error sending email:", error);
        throw new Error("Failed to send email: " + error.message);
    }
});

module.exports = sendEmail;
