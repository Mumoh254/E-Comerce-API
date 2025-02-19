const userModel = require("../../models/userModel");

const   { validateMongoDbId } =  require("../../utils/validateMongoId")

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params; 
    validateMongoDbId(id)
    console.log(`Attempting to delete user with ID: ${id}`);

 
    const deletedUser = await userModel.findByIdAndDelete(id);

    if (deletedUser) {
      console.log(`Successfully deleted user: ${deletedUser}`);

 
      return res.status(200).json({
        message: `User with ID ${id} successfully deleted.`,
        success: true,
        status: 200,
      });
    } else {
   
      return res.status(404).json({
        message: `User with ID ${id} not found.`,
        success: false,
        status: 404,
      });
    }
  } catch (error) {
   
    console.error("Error occurred during user deletion:", error.message);

    return res.status(500).json({
      message: "Error occurred while deleting the user.",
      error: error.message,
      success: false,
      status: 500,
    });
  }
};

module.exports = { deleteUser };
