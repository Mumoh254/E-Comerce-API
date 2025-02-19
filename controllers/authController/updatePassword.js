const { validateMongoDbId } = require("../../utils/validateMongoId");
const bcrypt = require("bcrypt");
const user = require("../../models/userModel");

const updatePassword = async (req, res) => {
  //loggedin  user  id  
  const { _id } = req.user;  
  const { password } = req.body;  

  try {
    // Validate the MongoDB ID of the user 
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

    
    if (!password) {
      return res.status(400).json({
        message: "Password is required",
        success: false,
        data: null,
      });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10); 
    userRecord.password = await bcrypt.hash(password, salt);  

    // Save the updated user record 
    const updatedUser = await userRecord.save();

    // Exclude password field  (  security)
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
