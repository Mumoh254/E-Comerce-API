const asyncHandler = require("express-async-handler");
const { cloudinaryUploadImage } = require("../../utils/cloudinary"); // Ensure this utility is available
const { productImageResize } = require("../../models/productModel"); // Assuming this is the correct model path
const { validateMongoDbId } = require("../../utils/validateMongoId"); // Make sure you have a valid Mongo ID validation
const   fs  =  require('fs')
const uploadImages = asyncHandler(async (req, res) => {
  console.log(req.files); // Logs the uploaded files

  const { id } = req.params; // Get product ID from params
  validateMongoDbId(id); // Validate the MongoDB ID

  try {
    const uploader = (path) => cloudinaryUploadImage(path, "images"); // Cloudinary upload function
    const urls = []; // Array to store the image URLs

    const files = req.files; // Get uploaded files
    for (const file of files) {
      const { path } = file;
      const newPath = await uploader(path); // Upload image to Cloudinary
      urls.push(newPath); 
      fs.unlinkSync(path)// Add the uploaded image URL to the array
    }

    // Update product with the new image URLs
    const findProduct = await productImageResize.findByIdAndUpdate(
      id,
      { images: urls }, // Assign the uploaded image URLs to the product's 'images' field
      { new: true } // Return the updated product
    );

    if (!findProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ findProduct }); // Send the updated product in the response
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = {
  uploadImages
};
