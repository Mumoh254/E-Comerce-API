const multer = require("multer");
const sharp = require("sharp");
const path = require("path");

// Multer storage config
const multerStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../public/images'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + ".jpeg");
  },
});

// Multer file filter to allow only images
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new Error("Unsupported file format"), false);
  }
};

// Multer upload midd
const uploadPhoto = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: { fileSize: 2000000 }, // 2MB file size limit
});

// Image resize function using sharp 
const productImageResize = async (req, res, next) => {
  // If no files are uploaded  next
  if (!req.files) return next();  

  try {
    await Promise.all(
      req.files.map(async (file) => {
        await sharp(file.path)
          .resize(300, 300)  
          .toFormat('jpeg')
          .jpeg({ quality: 90 })  // JPEG quality to 90
          .toFile(path.join('public', 'images', 'products', file.filename)); 
      })
    );
    next();  
  } catch (error) {
    next(error);  
  }
};

// Image resize  using sharp 
const blogImageResize = async (req, res, next) => {
  if (!req.files) return next();  

  try {
    await Promise.all(
      req.files.map(async (file) => {
        await sharp(file.path)
          .resize(300, 300)  // Resize to 300x300
          .toFormat('jpeg')
          .jpeg({ quality: 90 })  // JPEG quality to 90
          .toFile(path.join('public', 'images', 'blogs', file.filename)); 
      })
    );
    next();  
  } catch (error) {
    next(error); 
  }
};

module.exports = {
  uploadPhoto,
  productImageResize,
  blogImageResize
};
