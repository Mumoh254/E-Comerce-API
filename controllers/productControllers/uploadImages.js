const asyncHandler = require("express-async-handler");
const { cloudinaryUploadImage } = require("../../utils/cloudinary"); 
const { productImageResize } = require("../../models/productModel");
const { validateMongoDbId } = require("../../utils/validateMongoId"); 
const   fs  =  require('fs')
const uploadImages = asyncHandler(async (req, res) => {
  console.log(req.files); 

  const { id } = req.params; 
  validateMongoDbId(id); 

  try {

     // Cloudinary upload function
    const uploader = (path) => cloudinaryUploadImage(path, "images");
    const urls = [];

    const files = req.files; 
    for (const file of files) {
      const { path } = file;
      const newPath = await uploader(path); 
      urls.push(newPath); 
      fs.unlinkSync(path)
    }

    // Update product with the new image URLs
    const findProduct = await productImageResize.findByIdAndUpdate(
      id,
      { images: urls },
      { new: true } 
    );

    if (!findProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ findProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = {
  uploadImages
};
