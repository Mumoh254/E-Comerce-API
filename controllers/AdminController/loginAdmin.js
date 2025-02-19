const { generateRefreshToken } = require("../../config/refreshToken");
const userModel = require("../../models/userModel");
const cookieParser = require("cookie-parser");
const express = require("express");
const app = express();
const { generateToken } = require("../../config/jwtToken");
const jwt = require("jsonwebtoken");
require("dotenv").config();

app.use(cookieParser());
app.use(express.json());

// Log in the admin
const logInAdmin = async (req, res) => {
    const { email, password } = req.body;
    console.log("Login attempt with email:", email);
    try {
        // admin exists ?
        const admin = await userModel.findOne({ email });

        if (admin && (admin.isAdmin || admin.role === 'admin')) {
            // Compare  password
            console.log("Admin found:", admin);
            const isPasswordCorrect = await admin.isPasswordMatched(password);

            console.log("Stored password hash: ", admin.password);
            console.log("Plain password provided: ", password);
            console.log("Is password correct? ", isPasswordCorrect);

            if (isPasswordCorrect) {
                const token = generateToken(admin.id);
                const refreshToken = await generateRefreshToken(admin.id);

                const updatedAdmin = await userModel.findByIdAndUpdate(
                    admin.id,
                    { refreshToken: refreshToken },
                    { new: true }
                );

                res.cookie('refreshToken', refreshToken, {
                    httpOnly: true,
                    maxAge: 72 * 60 * 60 * 1000,
                    secure: process.env.NODE_ENV === 'production',
                    expires: new Date(Date.now() + 72 * 60 * 60 * 1000),
                    path: "/"
                });

                return res.json({
                    message: "Admin login successful",
                    success: true,
                    token,
                    refreshToken,
                    data: updatedAdmin,
                });
            } else {
                console.log("Invalid credentials: Password mismatch");
                return res.status(401).json({
                    message: "Invalid  Admin credentials ... Protected Welt  tallis Cooperation !! ",
                    success: false,
                });
            }
        } else {
            return res.status(404).json({
                message: "Admin not found or user is not an admin",
                success: false,
            });
        }
    } catch (error) {
        console.error("Error during admin login:", error.message);
        return res.status(500).json({
            message: "Error occurred during login",
            success: false,
            error: error.message,
        });
    }
};

// Handle refresh token
const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;
    const refreshToken = cookies.refreshToken;

    if (!refreshToken) {
        return res.status(403).json({
            message: "No refresh token found",
            success: false,
        });
    }

    try {
        console.log("Received refreshToken:", refreshToken);
        
        const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET_KEYS_AUTHORIZE);
        console.log("Decoded refreshToken:", decoded);

        const newAccessToken = generateToken(decoded._id);
        const newRefreshToken = await generateRefreshToken(decoded._id);

        const user = await userModel.findByIdAndUpdate(
            decoded._id,
            { refreshToken: newRefreshToken },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false,
            });
        }

        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            maxAge: 72 * 60 * 60 * 1000,
            secure: process.env.NODE_ENV === 'production',
            expires: new Date(Date.now() + 72 * 60 * 60 * 1000),
            path: "/"
        });

        return res.json({
            message: "New tokens generated successfully",
            success: true,
            token: newAccessToken,
            refreshToken: newRefreshToken,
            data: user,
        });
    } catch (error) {
        console.error("Error refreshing token:", error.message);
        return res.status(500).json({
            message: "Error refreshing the token",
            success: false,
            error: error.message,
        });
    }
};

module.exports = { logInAdmin, handleRefreshToken };
