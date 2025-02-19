import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';


dotenv.config();

// Config Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_API_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_CLOUD_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET_KEY,
});

// Function to upload file to Cloudinary
const cloudinaryUpload = async (fileUploads) => {
  try {
    const result = await cloudinary.uploader.upload(fileUploads, {
      resource_type: "auto",
    });
    
    // Return the URL
    return {
      url: result.secure_url,
    };
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    throw error;
  }
};


module.exports =  { cloudinaryUpload };
