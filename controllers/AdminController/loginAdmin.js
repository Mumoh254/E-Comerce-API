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

// 🚀 **Admin Login Function**
const logInAdmin = async (req, res) => {
    const { email, password } = req.body;
    console.log("Admin login attempt with email:", email);

    try {
        // 🔍 Check if the user exists
        const user = await userModel.findOne({ email });
        console.log({
            message:  "user  found",
            data: user
        })

        if (!user) {
            return res.status(404).json({
                message: "Admin not found",
                success: false,
            });
        }

        // 🛑 Debugging: Check retrieved user details
        console.log("Retrieved user:", user);

        // 🛑 Ensure the user is an admin
        if (!user.role || user.role !== "admin") {
            return res.status(403).json({
                message: "Access denied: Not an admin",
                success: false,
            });
        }

        // 🔑 Verify password
        const isPasswordCorrect = await user.isPasswordMatched(password);

        // Debugging: Check if password matches
        console.log("Password Match Status:", isPasswordCorrect);

        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: "Invalid credentials",
                success: false,
            });
        }

        // 🏷 Generate Tokens
        const token = generateToken(user); // ✅ Ensure correct user object
        const refreshToken = await generateRefreshToken(user._id);

        // 🔄 Update user with refreshToken
        await userModel.findByIdAndUpdate(user._id, { refreshToken }, { new: true });

        // 🍪 Set refresh token in cookie
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            maxAge: 72 * 60 * 60 * 1000, // 3 days
            secure: process.env.NODE_ENV === "production",
            expires: new Date(Date.now() + 72 * 60 * 60 * 1000),
            path: "/"
        });

        // ✨ Send response (omit password)
        const { password: _, ...adminData } = user._doc;
        return res.json({
            message: "Admin login successful",
            success: true,
            token,
            data: adminData
        
        });

    } catch (error) {
        console.error("Error during admin login:", error.message);
        return res.status(500).json({
            message: "Error occurred during admin login",
            success: false,
            error: error.message,
        });
    }
};

module.exports = { logInAdmin };
