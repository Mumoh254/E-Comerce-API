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
        // Check if the user exists
        const user = await userModel.findOne({ email });

        if (user) {
            
            // Compare the password
            console.log("User found:", user);
            const isPasswordCorrect = await user.isPasswordMatched(password);
            console.log("Is password correct?", isPasswordCorrect);

            console.log("Stored password hash: ", user.password);
            console.log("Plain password provided: ", password);
            console.log("Is password correct? ", isPasswordCorrect);

            if (isPasswordCorrect) {
                const token = generateToken(user.id);
                const refreshToken = await generateRefreshToken(user.id);

                const updatedUser = await userModel.findByIdAndUpdate(
                    user.id,
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
                    message: "Login successful",
                    success: true,
                    token,
                    refreshToken,
                    data: updatedUser,
                });
            } else {
                console.log("Invalid credentials: Password mismatch");
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
            { refreshToken: refreshToken },
            { new: true } ````
        );

        


        if (!user) 
            {
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

    } catch (error)
     {
        console.error("Error refreshing token:", error.message);
        return res.status(500).json({
            message: "Error refreshing the token",
            success: false,
            error: error.message,
        });
    }
};


module.exports = { logInUser, handleRefreshToken }; 