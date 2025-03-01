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

// Log in the user
const logInUser = async (req, res) => {
    const { email, password } = req.body;
    console.log("Login attempt with email:", email);

    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false,
            });
        }

        const isPasswordCorrect = await user.isPasswordMatched(password);
        if (!isPasswordCorrect) {
            console.log("Invalid credentials: Password mismatch");
            return res.status(401).json({
                message: "Invalid credentials",
                success: false,
            });
        }

        const token = generateToken(user.id);
        const refreshToken = await generateRefreshToken(user.id);

        await userModel.findByIdAndUpdate(user.id, { refreshToken }, { new: true });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 72 * 60 * 60 * 1000,
            secure: process.env.NODE_ENV === 'production',
            expires: new Date(Date.now() + 72 * 60 * 60 * 1000),
            path: "/"
        });

        const { password: _, ...userData } = user._doc;  // Omit password from response
        return res.json({
            message: "Login successful",
            success: true,
            token,
            data: userData,  // Don't return refreshToken
        });

    } catch (error) {
        console.error("Error during login:", error.message);
        return res.status(500).json({
            message: "Error occurred during login",
            success: false,
            error: error.message,
        });
    }
};

// Handle refresh token
const handleRefreshToken = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.status(403).json({
            message: "No refresh token found",
            success: false,
        });
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET_KEYS_AUTHORIZE);
        console.log("Decoded refreshToken:", decoded);

        const user = await userModel.findById(decoded._id);
        if (!user || user.refreshToken !== refreshToken) {
            return res.status(403).json({
                message: "Invalid refresh token",
                success: false,
            });
        }

        const newAccessToken = generateToken(user._id);
        const newRefreshToken = await generateRefreshToken(user._id);

        // Append new refreshToken to the array
        await userModel.findByIdAndUpdate(user._id, {
            $push: { refreshTokens: { token: newRefreshToken, expiresAt: new Date(Date.now() + 72 * 60 * 60 * 1000) } }
        });
        

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 72 * 60 * 60 * 1000, // 3 days
            secure: process.env.NODE_ENV === 'production',
            expires: new Date(Date.now() + 72 * 60 * 60 * 1000),
            path: "/"
        });
        

        return res.json({
            message: "New tokens generated successfully",
            success: true,
            token: newAccessToken,
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

module.exports = { logInUser, handleRefreshToken };
