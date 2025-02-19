

const   asyncHandler   =  require("express-async-handler")
const   bcrypt  =  require("bcrypt")



const resetPassword = asyncHandler(async (req, res) => {
    const { password } = req.body;
    const { token } = req.params;

    // Hash the token to match the stored hashed token
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    try {
        // Find the user by the hashed token and check if the reset token has not expired
        const user = await userModel.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires: { $gt: Date.now() }, // Check if token has expired
        });

        // If user is found and the token is valid
        if (user) {
            // Validate password length or strength if necessary
            if (password.length < 6) {
                return res.status(400).json({
                    message: "Password must be at least 6 characters long",
                    success: false,
                });
            }

        

            // Clear the reset token and expiration time
            user.passwordResetToken = undefined;
            user.passwordResetExpires = undefined;

            // Save the updated user document
            await user.save();

            console.log("Password reset successful. User updated:", user); // Log for debugging

            return res.status(200).json({
                message: "Your password has been reset successfully. You can now log in with your new password.",
                success: true,
            });
        } else {
            // If user is not found or token has expired
            return res.status(400).json({
                message: "Invalid or expired token.",
                success: false,
            });
        }
    } catch (error) {
        console.error("Error resetting password:", error);
        return res.status(500).json({
            message: "Error resetting the password",
            success: false,
            error: error.message,
        });
    }
});



module.exports  =  {
    resetPassword 
}