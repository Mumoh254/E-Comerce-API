const   userModel  =  require("../../models/userModel")

const   { validateMongoDbId } =  require("../../utils/validateMongoId")

// Update a single user

const updateUser = async (req, res) => {
  try {
      const { id } = req.params; 
      validateMongoDbId(id)

      const updatedData = req.body;  
      
      console.log("Updating user with ID:", id);

      // Find and update the user
      const updatedUser = await userModel.findByIdAndUpdate(id , updatedData, {
          new: true,  
          runValidators: true,  
      });

      if (updatedUser) {
          console.log(`Updated user: ${updatedUser}`);

          return res.json({
              message: `User with ID ${id} successfully updated.`,
              success: true,
              status: 200,
              updatedUser: updatedUser,  // Return the updated user
          });
      } else {
          return res.status(404).json({
              message: `User with ID ${id} not found.`,
              success: false,
              status: 404,
          });
      }
  } catch (error) {
      console.log("Error occurred during user update:", error.message);

      return res.status(500).json({
          message: "Error occurred while updating the user.",
          success: false,
          status: 500,
      });
  }
};

module.exports = { updateUser };
