const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.MAILER_ID, 
        pass: process.env.MAILER_ID_PASSWORD,
    },
});

const sendThankYouEmail = async (emailData) => {
    try {
        const mailOptions = {
            from: `"Majesty Shoe Collection" <${process.env.MAILER_ID}>`,
            to: emailData.to,
            subject: emailData.subject,
            html: emailData.html,
        };

        await transporter.sendMail(mailOptions);
        console.log(`✅ Email successfully sent to ${emailData.to}`);
    } catch (error) {
        console.error("❌ Email sending failed:", error);
        throw error;
    }
};

module.exports = sendThankYouEmail;
