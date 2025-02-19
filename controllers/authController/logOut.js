const userModel = require("../../models/userModel");

const logOut = async (req, res) => {
    const cookie = req.cookies; // Get cookies from the request

    if (!cookie?.refreshToken) {
        return res.json({
            message: "You are not logged in",
            success: false,
        });
    }

    try {
        // Find the user by the refreshToken
        const user = await userModel.findOne({ refreshToken: cookie.refreshToken });

        if (!user) {
            // Clear the refresh token cookie if user not found
            return res.clearCookie("refreshToken", {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production", // Set secure flag only in production (use HTTPS)
                path: "/",
            }).json({
                message: "Logged out successfully",
                success: true,
            });
        }

        // If the user exists   REFRESH  TOKENS  IS   NULL   
        await userModel.findByIdAndUpdate(user._id, {
            refreshToken: null, 

        });

        // Clear the refresh token cookie
        return res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            path: "/",
        }).json({
            message: "You  Logged out successfully !!",
            success: true,
            data:  null

        });

    } catch (error) 
    {

        console.error("Error logging out:", error.message);

        return res.status(500).json({
            message: "An   Error Ocurred  While logging out",
            success: false,
            error: error.message,
        });
    }
};

module.exports = 
{
     logOut
};
