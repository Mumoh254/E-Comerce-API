const userModel = require("../../models/userModel");

const   { validateMongoDbId } =  require("../../utils/validateMongoId")
// Block a user
const blockUser = async (req, res) => {
    const { id } = req.params;
    console.log("Blocking user with ID:", id);

    try {
       
        const updatedUser = await userModel.findByIdAndUpdate(
            id,
            { isLocked: true },
            { new: true }
        );

      
        if (updatedUser) {
            console.log("Blocked user:", updatedUser);
            return res.status(200).json({
                message: "User successfully blocked",
                success: true,
                status: 200,
                data: updatedUser
            });
        } else {
            return res.status(404).json({
                message: "User not found",
                success: false,
                status: 404
            });
        }
    } catch (error) {
        console.log("Error blocking user:", error.message);
        return res.status(500).json({
            message: "Error blocking the user",
            success: false,
            status: 500,
            error: error.message
        });
    }
};

// Unblock a user
const unBlockUser = async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id)
    console.log("Unblocking user with ID:", id);

    try {
      
        const updatedUser = await userModel.findByIdAndUpdate(
            id,
            { isLocked: false },
            { new: true }
        );

       
        if (updatedUser) {
            console.log("Unblocked user:", updatedUser);
            return res.status(200).json({
                message: "User successfully unblocked",
                success: true,
                status: 200,
                data: updatedUser
            });
        } else {
            return res.status(404).json({
                message: "User not found",
                success: false,
                status: 404
            });
        }
    } catch (error) {
        console.log("Error unblocking user:", error.message);
        return res.status(500).json({
            message: "Error unblocking the user",
            success: false,
            status: 500,
            error: error.message
        });
    }
};

module.exports = {
    unBlockUser,
    blockUser
};
