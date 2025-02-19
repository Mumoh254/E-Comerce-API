const userModel = require("../../models/userModel");

const   { validateMongoDbId } =  require("../../utils/validateMongoId")
// Get all users
const getUsers = async (req, res) => {
    try {
        const users = await userModel.find();
        return res.json({
            data: users,
            success: true,
            message: "Success fetching users.",
            status: 200,
            totalUsers: users.length,
        });
    } catch (error) {
        console.log("Error occurred while fetching users:", error.message);
        return res.status(500).json({
            success: false,
            message: "Error occurred while fetching users.",
            status: 500,
            data: null,
        });
    }
};

// Get a single user
const getUser = async (req, res) => {
    try {
        const { id } = req.params; 
        console.log("Fetching user with ID:", id);

        // Use `findById` 
        const user = await userModel.findById(id).lean();

        if (user) {
            return res.json({
                data: user,
                message: "Success fetching user.",
                status: 200,
                success: true,
            });
        } else {
            return res.status(404).json({
                success: false,
                message: "User not found.",
                status: 404,
                data: null,
            });
        }
    } catch (error) {
        console.log("Error occurred while fetching user:", error.message);
        return res.status(500).json({
            success: false,
            message: "Error occurred while fetching user.",
            status: 500,
            data: null,
        });
    }
};

module.exports = { getUsers, getUser };
