const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

// Ensure upload directories exist
const ensureDirExists = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const uploadDir = path.join(__dirname, '../public/images');
ensureDirExists(uploadDir);

// Multer storage configuration
const multerStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + ".jpeg");
  },
});

// File filter to allow only images
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new Error("Unsupported file format"), false);
  }
};

// Multer upload middleware (max size: 2MB)
const uploadPhoto = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB file size limit
});

// Image resizing function (for products)
const productImageResize = async (req, res, next) => {
  if (!req.files || req.files.length === 0) return next(); // Check if files exist

  const productDir = path.join('public', 'images', 'products');
  ensureDirExists(productDir);

  try {
    await Promise.all(
      req.files.map(async (file) => {
        const outputPath = path.join(productDir, file.filename);
        await sharp(file.path)
          .resize(300, 300)  
          .toFormat('jpeg')
          .jpeg({ quality: 90 })
          .toFile(outputPath);
        
        // Delete original file after resizing (optional)
        fs.unlinkSync(file.path);
      })
    );
    next();
  } catch (error) {
    next(error);
  }
};

// Image resizing function (for blogs)
const blogImageResize = async (req, res, next) => {
  if (!req.files || req.files.length === 0) return next();

  const blogDir = path.join('public', 'images', 'blogs');
  ensureDirExists(blogDir);

  try {
    await Promise.all(
      req.files.map(async (file) => {
        const outputPath = path.join(blogDir, file.filename);
        await sharp(file.path)
          .resize(300, 300)
          .toFormat('jpeg')
          .jpeg({ quality: 90 })
          .toFile(outputPath);

        // Delete original file after resizing (optional)
        fs.unlinkSync(file.path);
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
