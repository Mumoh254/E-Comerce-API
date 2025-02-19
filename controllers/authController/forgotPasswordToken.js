const asyncHandler = require("express-async-handler");
const userModel = require("../../models/userModel");
const sendEmail = require("../emailController/emailControl");

const forgotPasswordToken = asyncHandler(async (req, res) => {
    const { email } = req.body;

    // Find the user by email
    const user = await userModel.findOne({ email });
    if (!user) {
        return res.status(404).json({
            message: "User not found",
            statusCode: 404,
            success: false,
        });
    }

    try {
        // Generate a password reset token
        const token = await user.createPasswordResetToken();
        await user.save();

        // Create the reset URL
        const resetURL = `${req.protocol}://${req.get('host')}/apiV1/majestycollections/forgotpass/reset/${token}`;
        console.log({
            message:  "Reset  url  extracted",
            data:  resetURL
        })

        const subject = "Password Reset Request - Welt Tallis Cooperation";
        const html = `
         <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset Request - Majesty Shoe Collection</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
            color: #333;
        }
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        .header {
            background-color: #2c3e50;
            padding: 20px;
            text-align: center;
        }
        .header h1 {
            color: white;
            margin: 0;
            font-size: 24px;
            font-weight: bold;
        }
        .content {
            padding: 30px;
            text-align: center;
        }
        .content h1 {
            color: #2c3e50;
            margin: 0 0 20px;
            font-size: 24px;
            font-weight: bold;
        }
        .content p {
            font-size: 16px;
            color: #555;
            margin: 10px 0;
            line-height: 1.6;
        }
        .content a {
            background-color: #c20030;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 5px;
            display: inline-block;
            font-size: 16px;
            font-weight: bold;
            margin: 20px 0;
        }
        .content a:hover {
            background-color: #a00028;
        }
        .footer {
            background-color: #2c3e50;
            padding: 20px;
            text-align: center;
            color: white;
        }
        .footer p {
            font-size: 12px;
            margin: 5px 0;
        }
        .footer a {
            color: white;
            text-decoration: underline;
        }
        .footer a:hover {
            color: #f4f4f4;
        }
        .advert {
            padding: 20px;
            background-color: #f8f9fa;
            text-align: center;
        }
        .advert h2 {
            color: #2c3e50;
            font-size: 20px;
            margin-bottom: 10px;
        }
        .advert p {
            font-size: 14px;
            color: #555;
            margin: 10px 0;
            line-height: 1.6;
        }
        .advert a {
            background-color: #2c3e50;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 5px;
            display: inline-block;
            font-size: 16px;
            font-weight: bold;
            margin: 20px 0;
        }
        .advert a:hover {
            background-color: #1a2633;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- Header -->
        <div class="header">
            <h1>Majesty Shoe Collection</h1>
        </div>

        <!-- Main Content -->
        <div class="content">
            <h1>Password Reset Request</h1>
            <p>You requested a password reset. Please click the button below to reset your password.</p>
            <a href="${resetURL}">Reset Your Password</a>
            <p style="font-size: 14px; color: #888;">This link is valid for 10 minutes only.</p>
        </div>

        <!-- Majesty Shoe Collection Information -->
        <div class="content">
            <h2>About Majesty Shoe Collection</h2>
            <p>At Majesty Shoe Collection, we bring you the finest footwear that combines elegance, comfort, and style. Our collection is designed to elevate your wardrobe and make every step you take a statement.</p>
            <p><strong>Step into Style with Majesty Shoe Collection</strong></p>
            <p>Contact us at <strong>+254 740 045 355</strong>  <br> email <strong>info@majestyshoecollection.com</strong> for assistance.</p>
            <a href="https://www.majestyshoecollection.com">Visit Our Website</a>
        </div>

        <!-- Footer with Social Media Links -->
        <div class="footer">
            <p>&copy; 2023 Majesty Shoe Collection. All rights reserved.</p>
            <p>Follow us: 
                <a href="https://facebook.com/majestyshoecollection">Facebook</a> | 
                <a href="https://instagram.com/majestyshoecollection">Instagram</a> | 
                <a href="https://twitter.com/majestyshoes">Twitter</a> | 
                <a href="https://linkedin.com/company/majestyshoecollection">LinkedIn</a>
            </p>
        </div>

        <!-- Welt Tallis Cooperation Advert -->
        <div class="advert">
            <h2>Powered by Welt Tallis Cooperation</h2>
            <p>At Welt Tallis Cooperation, we integrate <strong>email notifications</strong>, <strong>SMS</strong>, and <strong>M-Pesa</strong> into your systems for seamless communication and transactions. Our mission is to provide innovative solutions that empower businesses and individuals.</p>
            <p><strong>Where Creativity Meets Innovation</strong></p>
            <p>Contact us at <strong>0740045355</strong>  <br> email <strong>peteritumo2030@gmail.com</strong> for assistance.</p>
            <a href="https://welt-tallis-cooperation.com">Visit Our Website</a>
        </div>

        <!-- Footer for Welt Tallis Cooperation -->
        <div class="footer">
            <p>&copy; 2023 Welt Tallis Cooperation. All rights reserved.</p>
            <p>Follow us: 
                <a href="https://facebook.com/welttallis">Facebook</a> | 
                <a href="https://twitter.com/welttallis">Twitter</a> | 
                <a href="https://linkedin.com/company/welttallis">LinkedIn</a>
            </p>
        </div>
    </div>
</body>
</html>`

        // Prepare email data
        const data = {
            to: email,
            subject: "Forgot Password Link",
            html: html
        };

        // Send the email
        await sendEmail(data);

        
        return res.status(200).json({
            message: "Password reset link sent to your email",
            statusCode: 200,
            success: true,
        });
    } catch (error) {
        console.error("Error sending email:", error);
        return res.status(500).json({
            message: "Failed to send password reset email",
            statusCode: 500,
            success: false,
            error: error.message,
        });
    }
});

module.exports = {
    forgotPasswordToken,
};
