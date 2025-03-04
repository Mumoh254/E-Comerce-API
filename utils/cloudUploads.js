const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');
dotenv.config();


// Config Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_API_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_CLOUD_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET_KEY,
});



// Function to upload file to Cloudinary
const cloudinaryUploadImage = async (filePath, folder = "uploads") => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder, 
      resource_type: "auto", // Handle images
      use_filename: true, // Preserve original filename
      unique_filename: false, 
    });
    

    return {
      url: result.secure_url,
      public_id: result.public_id,
    };
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    throw error;
  }
};


module.exports =  { cloudinaryUploadImage };
