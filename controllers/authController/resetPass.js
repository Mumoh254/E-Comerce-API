const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const userModel = require("../../models/userModel"); // Ensure this path is correct

const resetPassword = asyncHandler(async (req, res) => {
    const { password } = req.body;
    const { token } = req.params;

    // Validate password
    if (!password || password.length < 6) {
        return res.status(400).json({
            message: "Password must be at least 6 characters long",
            success: false,
        });
    }

    // Hash the token for comparison
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    try {
        // Find the user by the hashed token and check if the reset token has not expired
        const user = await userModel.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires: { $gt: Date.now() }, // Check if token has expired
        });

        // If user is not found or token has expired
        if (!user) {
            return res.status(400).json({
                message: "Invalid or expired token.",
                success: false,
            });
        }

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Update the user's password and clear the reset token and expiration time
        user.password = hashedPassword;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;

        // Save the updated user document
        await user.save();

        console.log("Password reset successful. User updated:", user);

        return res.status(200).json({
            message: "Your password has been reset successfully. You can now log in with your new password.",
            success: true,
        });
    } catch (error) {
        console.error("Error resetting password:", error);
        return res.status(500).json({
            message: "Error resetting the password",
            success: false,
            error: error.message,
        });
    }
});

module.exports = {
    resetPassword,
};