const express = require("express");
const { createProduct, updateProduct, deleteProduct, getAllProducts, getaProduct } = require("../controllers/productControllers/productController");
console.log(createProduct);  
const router = express.Router();

const authMiddleware = require("../middleWares/authMiddleware");
const { isAdmin } = require("../middleWares/isAdmin");
const { uploadPhoto } = require("../middleWares/uploadImages");

// Product routes
router.post("/create", authMiddleware, isAdmin, createProduct);
router.put("/update/:id", authMiddleware, isAdmin, updateProduct);
router.get("/find/:id", authMiddleware, getaProduct);
router.delete("/delete/:id", authMiddleware, isAdmin, deleteProduct);
router.get("/fetch", getAllProducts);

// Corrected upload route
router.put("/upload/:id", authMiddleware, isAdmin, uploadPhoto.array('images', 10));

module.exports = router;
