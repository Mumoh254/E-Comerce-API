const { generateRefreshToken } = require("../../config/refreshToken");
const userModel = require("../../models/userModel");
const bcrypt = require("bcrypt");
const express = require("express");
const app = express();
const { generateToken } = require("../../config/jwtToken");
const jwt = require("jsonwebtoken");
require("dotenv").config();

app.use(express.json()); 

// Log in the user
const logIn = async (req, res) => {
    const { email, password } = req.body;

    console.log("Login attempt with email:", email);
    console.log("Request body:", req.body);

    try {
        // Check if the user exists
        const user = await userModel.findOne({ email });
        console.log({
            message: 'User found',
            data: user,
        });

        if (user) {
            // Compare the password
            console.log("Input password:", password);
            console.log("Stored password:", user.password);

            const isPasswordCorrect = await bcrypt.compare(password, user.password);

            console.log("Is password correct? ", isPasswordCorrect);

            if (isPasswordCorrect) {
                
                // Generate access and refresh tokens
                const token = generateToken(user);
                const refreshToken = await generateRefreshToken(user._id);
        
                //  Update user with refreshToken
                await userModel.findByIdAndUpdate(user._id, { refreshToken }, { new: true });
        
                //  refresh token in cookie
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
                    data: adminData,
                });

                // Save the refresh token to the database
                const updatedUser = await userModel.findByIdAndUpdate(
                    user.id,
                    { refreshToken: refreshToken },
                    { new: true }
                );

                return res.json({
                    message: "Login successful",
                    success: true,
                    token, // Access token
                    refreshToken, // Refresh token sent in response
                    data: updatedUser,
                });
            } else {
                console.log("Invalid credentials");
                return res.status(401).json({
                    message: "Invalid credentials",
                    success: false,
                });
            }
        } else {
            return res.status(404).json({
                message: "User not found",
                success: false,
            });
        }
    } catch (error) {
        console.error("Error during login:", error.message);
        return res.status(500).json({
            message: "Error occurred during login",
            success: false,
            error: error.message,
        });
    }
};

module.exports = { logIn };