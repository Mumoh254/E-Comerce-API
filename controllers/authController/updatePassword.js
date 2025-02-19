const { validateMongoDbId } = require("../../utils/validateMongoId");
const bcrypt = require("bcrypt");
const user = require("../../models/userModel");

const updatePassword = async (req, res) => {
  const { _id } = req.user;  // Get the logged-in user's ID from the request user object
  const { password } = req.body;  // Get the new password from the request body

  try {
    // Validate the MongoDB ID of the user (just in case)
    validateMongoDbId(_id);

    // Find the user by ID
    const userRecord = await user.findById(_id);

    if (!userRecord) {
      return res.status(404).json({
        message: "User not found",
        success: false,
        data: null,
      });
    }

    // Ensure password is provided in the request body
    if (!password) {
      return res.status(400).json({
        message: "Password is required",
        success: false,
        data: null,
      });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);  // Generate salt for password hashing
    userRecord.password = await bcrypt.hash(password, salt);  // Hash the password

    // Save the updated user record with the new hashed password
    const updatedUser = await userRecord.save();

    // Exclude password field from the response for security reasons
    updatedUser.password = undefined;

    if (updatedUser) {
      return res.status(200).json({
        message: "Password updated successfully!",
        success: true,
        data: updatedUser,
      });
    } else {
      return res.status(403).json({
        message: "Failed to update password",
        success: false,
        data: null,
      });
    }
  } catch (error) {
    console.error("Error updating password:", error.message);
    return res.status(500).json({
      message: "An error occurred while updating the password",
      success: false,
      error: error.message,
    });
  }
};

module.exports = { updatePassword };
