const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
    let token;

    // Check if the token is sent  "Authorization" header as "Bearer"
    if (req?.headers?.authorization?.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];  
    } else {
        return res.status(401).json({
            success: false,
            message: "You are not authenticated. Please login first. Token is required.",
            data: null,
            status: 401,
        });
    }

    try {
        // Verify the JWT token (Access token)
        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEYS_AUTHORIZE);

            // Check if token is valid
            if (!decoded) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid token.",
                    data: null,
                    status: 400,
                });
            }

            // Fetch the user based on the decoded ID from the token
            const user = await userModel.findById(decoded.id);

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "User not found.",
                    data: null,
                    status: 404,
                });
            }

            // Attach the user 
            req.user = user;

            // Proceed 
            next();
        } else {
            return res.status(401).json({
                success: false,
                message: "Token is invalid or missing.",
                data: null,
                status: 401,
            });
        }
    } catch (error) {
        console.log("Error during authentication:", error.message);

        // Handle specific JWT errors (e.g., expired token)
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                success: false,
                message: "Expired token. Please login again.",
                data: null,
                status: 401,
            });
        } else if (error.name === "JsonWebTokenError") {
            return res.status(400).json({
                success: false,
                message: "Invalid token. Please login again.",
                data: null,
                status: 400,
            });
        } else {
            return res.status(500).json({
                success: false,
                message: "Internal server error during authentication.",
                data: null,
                status: 500,
            });
        }
    }
};

module.exports = authMiddleware;
