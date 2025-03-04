const express = require("express");
const productModel = require("../../models/productModel");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const { cloudinaryUploadImage, cloudinaryDeleteImage } = require('../../utils/cloudUploads');
const fs = require('fs-extra');
const mongoose = require('mongoose');

// Helper function to delete uploaded files
const cleanupFiles = (files) => {
  if (files) {
    files.forEach(file => {
      if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
    });
  }
};

const createProduct = asyncHandler(async (req, res) => {
  try {
    const images = [];
    let uploadedFiles = [];

    try {
      if (req.files?.length) {
        uploadedFiles = [...req.files];
        
        for (const file of req.files) {
          const result = await cloudinaryUploadImage(file.path);
          images.push({
            url: result.url,
            public_id: result.public_id
          });
          fs.unlinkSync(file.path);
        }
      }
    } catch (uploadError) {
      // Cleanup uploaded images if any failed
      await Promise.all(images.map(img => 
        cloudinaryDeleteImage(img.public_id)
      ));
      throw uploadError;
    }

    if (!req.body.title) {
      return res.status(400).json({
        success: false,
        message: "Product title is required"
      });
    }

    const slug = slugify(req.body.title, { lower: true });
    const existingProduct = await productModel.findOne({ slug });
    if (existingProduct) {
      return res.status(409).json({
        success: false,
        message: "Product with this title already exists"
      });
    }

    const newProduct = await productModel.create({
      ...req.body,
      slug,
      images
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: newProduct
    });

  } catch (error) {
    cleanupFiles(req.files);
    console.error("Product creation error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create product"
    });
  }
});

const updateProduct = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID"
      });
    }

    const product = await productModel.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    const updates = { ...req.body };
    if (updates.title && updates.title !== product.title) {
      updates.slug = slugify(updates.title, { lower: true });
      const existingSlug = await productModel.findOne({ slug: updates.slug });
      if (existingSlug && existingSlug._id.toString() !== id) {
        return res.status(409).json({
          success: false,
          message: "Product with this title already exists"
        });
      }
    }

    // Handle image updates
    if (req.files?.length) {
      // Delete old images
      await Promise.all(product.images.map(img => 
        cloudinaryDeleteImage(img.public_id)
      ));
      
      // Upload new images
      const newImages = [];
      for (const file of req.files) {
        const result = await cloudinaryUploadImage(file.path);
        newImages.push({
          url: result.url,
          public_id: result.public_id
        });
        fs.unlinkSync(file.path);
      }
      updates.images = newImages;
    }

    const updatedProduct = await productModel.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct
    });

  } catch (error) {
    cleanupFiles(req.files);
    console.error("Update error:", error);
    
    const statusCode = error.name === 'ValidationError' ? 400 : 500;
    res.status(statusCode).json({
      success: false,
      message: error.message,
      ...(error.errors && { errors: error.errors })
    });
  }
});

const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid product ID"
    });
  }

  const product = await productModel.findByIdAndDelete(id);
  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found"
    });
  }

  // Delete associated images
  await Promise.all(product.images.map(img => 
    cloudinaryDeleteImage(img.public_id)
  ));

  res.json({
    success: true,
    message: "Product deleted successfully"
  });
});

const getaProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid product ID"
    });
  }

  const product = await productModel.findById(id)
    .populate('category', 'name')
    .populate('brand', 'name');

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found"
    });
  }

  res.json({
    success: true,
    data: product
  });
});


const getAllProducts = asyncHandler(async (req, res) => {
  try {
    const { page = 1, limit = 8, category, price } = req.query;
    const filter = {};

    // Category filter
    if (category && category !== '') {
      filter.category = category;
    }

    // Price filter
    if (price && price !== '') {
      if (price.includes('-')) {
        const [min, max] = price.split('-').map(Number);
        if (!isNaN(min)) filter.price = { $gte: min };
        if (!isNaN(max)) filter.price = { ...filter.price, $lte: max };
      } else {
        const numericPrice = Number(price);
        if (!isNaN(numericPrice)) filter.price = numericPrice;
      }
    }

    // Pagination
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const skip = (pageNumber - 1) * limitNumber;

    const [total, products] = await Promise.all([
      productModel.countDocuments(filter),
      productModel.find(filter)
        .skip(skip)
        .limit(limitNumber)
        .sort('-createdAt')
    ]);

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      page: pageNumber,
      pages: Math.ceil(total / limitNumber),
      data: products
    });

  } catch (error) {
    console.error("Fetch products error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching products"
    });
  }
});
module.exports = {
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
  getaProduct,
};