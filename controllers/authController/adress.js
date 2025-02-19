const asyncHandler = require("express-async-handler");
const userModel = require("../../models/userModel");  

// Update User Address
const updateAddress = asyncHandler(async (req, res) => {
    const { userId } = req.user; 
    const { newAddress } = req.body; 


    if (!newAddress || typeof newAddress !== 'string' || newAddress.trim() === '') {
        return res.status(400).json({
            message: "New address is required",
            success: false,
        });
    }

    try {
      
        const updatedUser = await userModel.findByIdAndUpdate(
            userId, 
            { address: newAddress }, 
            { new: true } 
        );

        if (!updatedUser) {
            return res.status(404).json({
                message: "User not found",
                success: false,
            });
        }

        return res.status(200).json({
            message: "Address updated successfully",
            success: true,
            updatedUser, 
        });
    } catch (error) {
        console.error("Error updating address:", error);
        return res.status(500).json({
            message: "Error updating the address",
            success: false,
            error: error.message,
        });
    }
});

module.exports = { updateAddress };
