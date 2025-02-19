const bcrypt = require("bcrypt");
const express = require("express");
const asyncHandler = require("express-async-handler");
const userModel = require("../../models/userModel");
const { body, validationResult } = require("express-validator");


const createUser = asyncHandler(async (req  ,   res ,   next) => {
    // Input validation
    
    await body('email').isEmail().withMessage('Invalid email format').run(req);
    await body('name').notEmpty().withMessage('Name is required').run(req);
    await body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long').run(req);
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: "Validation error",
            statusCode: 400,
            errors: errors.array(),
            success: false
        });
    }

    const { email, name, password } = req.body;

    // Check if user already exists
    const checkIfUserExists = await userModel.findOne({ email: email });
    if (checkIfUserExists) {
        return res.status(400).json({
            message: "User already exists, please login",
            statusCode: 400,
            success: false
        });
    } else {
        // Determine role (only two admins allowed)
        const adminCount = await userModel.countDocuments({ role: "admin" });
        let role = "user";
        if (adminCount < 2) {
            role = "admin";
        }

        // Hash the password
        const saltRounds = parseInt(process.env.SALT_ROUNDS) || 10; // Use env variable or default to 10
        const hashedPassword = await bcrypt.hash(password, saltRounds);
          console.log({
            message:  "hashed  pass",
            data:  hashedPassword
          })
        // Create user
        const createdUser = await userModel.create({
            email,
            name,
            password: hashedPassword,
            role
        });

        if (createdUser) {
            // Omit password from response
            const { name, ...userData } = createdUser.toObject();
            return res.status(201).json({
                message: "User successfully created",
                statusCode: 201,
                data: userData,
                success: true
            });
        } else {
            return res.status(400).json({
                message: "User creation failed",
                statusCode: 400,
                success: false
            });
        }
    }
});

module.exports ={
    createUser
} 