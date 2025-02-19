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

        //  reset URL
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
            font-family: 'Arial', sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f8f9fa;
            color: #333;
        }
        .email-container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
        }
             .header{
                padding: 20px;
            text-align: center;
            color: #c20030;
            font-weight: bold;
             }
         .footer {
            background: linear-gradient(135deg, #2c3e50, #34495e);
            padding: 20px;
            text-align: center;
            color: white;
        }
        .header h1, .footer p {
            margin: 0;
            font-size: 18px;
        }
        .content {
            padding: 40px;
            text-align: center;
        }
        .content h1 {
            color: #2c3e50;
            font-size: 24px;
            margin-bottom: 15px;
        }
        .content p {
            font-size: 16px;
            color: #555;
            margin: 10px 0;
            line-height: 1.6;
        }
        .btn {
            background: linear-gradient(135deg, #c20030, #a00028);
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 8px;
            display: inline-block;
            font-size: 16px;
            font-weight: bold;
            margin: 20px 0;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
        }
        .divider {
            border-top: 1px solid #e0e0e0;
            margin: 20px 0;
        }
        .advert {
            padding: 40px;
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
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1>Majesty Shoe Collection</h1>
        </div>
        <div class="content">
            <h1>Password Reset Request</h1>
            <p>You requested a password reset. Click the button below to reset your password.</p>
            <a href="${resetURL}" class="btn">Reset Your Password</a>
            <p style="font-size: 14px; color: #888;">This link is valid for 10 minutes only.</p>
        </div>
        <div class="content">
            <h2>About Majesty Shoe Collection</h2>
            <p>We bring you the finest footwear combining elegance, comfort, and style. Elevate your wardrobe with Majesty Shoe Collection.</p>
            <p>Contact us at <strong>+254 740 045 355</strong> or email <strong>info@majestyshoecollection.com</strong>.</p>
            <a href="https://www.majestyshoecollection.com" class="btn">Visit Our Website</a>
        </div>
        <div class="footer">
            <p>&copy; 2023 Majesty Shoe Collection. All rights reserved.</p>
            <p>Follow us: 
                <a href="https://facebook.com/majestyshoecollection" style="color:white; text-decoration: underline;">Facebook</a> | 
                <a href="https://instagram.com/majestyshoecollection" style="color:white; text-decoration: underline;">Instagram</a>
            </p>
        </div>
        <div class="divider"></div>
        <div class="advert">
            <h2>Powered by Welt Tallis Cooperation</h2>
            <p>Integrating email notifications, SMS, and M-Pesa for seamless business solutions.</p>
            <p>Contact us at <strong>0740045355</strong> or email <strong>peteritumo2030@gmail.com</strong>.</p>
            <a href="https://welt-tallis-cooperation.com" class="btn">Visit Our Website</a>
        </div>
        <div class="footer">
            <p>&copy; 2023 Welt Tallis Cooperation. All rights reserved.</p>
            <p>Follow us: 
                <a href="https://facebook.com/welttallis" style="color:white; text-decoration: underline;">Facebook</a> | 
                <a href="https://linkedin.com/company/welttallis" style="color:white; text-decoration: underline;">LinkedIn</a>
            </p>
        </div>
    </div>
</body>
</html>
`
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
