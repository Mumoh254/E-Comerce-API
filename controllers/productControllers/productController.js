const express = require("express");
const productModel = require("../../models/productModel");
const slugify = require("slugify");
const { httpRequestToRequestData } = require("@sentry/core");
// const { cloudinaryUploadImage } = require('../utils/cloudinary');
const fs = require('fs-extra');

const   createProduct = async (req, res, next) => {
  try {
    const images = [];
    
    // Upload images to Cloudinary
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await cloudinaryUploadImage(file.path, 'products');
        images.push(result);
      }
    }

    // Create product with image URLs
    const productData = {
      ...req.body,
      images
    };

    if (productData.title) {
      productData.slug = slugify(productData.title);
    }

    const newProduct = await productModel.create(productData);
    
    return res.status(201).json({
      message: "Product created successfully!",
      data: newProduct,
      success: true,
    });
  } catch (error) {
    // Cleanup uploaded files if error occurs
    if (req.files) {
      for (const file of req.files) {
        await fs.unlink(file.path).catch(() => {});
      }
    }
    
    console.error("Error occurred:", error.message);
    return res.status(500).json({
      message: error.message.includes('E11000') 
        ? "Product title must be unique" 
        : "Error creating product",
      error: error.message,
      success: false,
    });
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };
    const newImages = [];

    // Handle new image uploads
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await cloudinaryUploadImage(file.path, 'products');
        newImages.push(result);
      }
      updates.$push = { images: { $each: newImages } };
    }

    if (updates.title) {
      updates.slug = slugify(updates.title);
    }

    const updatedProduct = await productModel.findByIdAndUpdate(
      id,
      updates,
      { new: true }
    );

    return res.status(200).json({
      message: "Product updated successfully!",
      data: updatedProduct,
      success: true,
    });
  } catch (error) {
    // Cleanup uploaded files if error occurs
    if (req.files) {
      for (const file of req.files) {
        await fs.unlink(file.path).catch(() => {});
      }
    }
    
    console.error("Error occurred:", error.message);
    return res.status(500).json({
      message: "Error updating product",
      error: error.message,
      success: false,
    });
  }
};
const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params; 
    // Check if the product exists
    const product = await productModel.findById(id);
    if (!product) {
      return res.status(404).json({
        message: "Product not found.",
        success: false,
      });
    }


    // Delete the product
    await productModel.findByIdAndDelete(id);
    return res.status(200).json({
      message: "Product deleted successfully!",
      success: true,
    });


  } catch (error) {
    console.error("Error occurred:", error.message);
    return res.status(500).json({
      message: "An error occurred while deleting the product.",
      error: error.message,
      success: false,
    });
  }
};

const getaProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const findProduct = await productModel.findById(id);
    if (findProduct) {
      return res.status(200).json({
        message: "Product found",
        data: findProduct,
        success: true,
      });
    } else {
      return res.status(404).json({
        message: "Product not found",
        success: false,
        data: null,
      });
    }
  } catch (error) {
    console.error("Error occurred:", error.message);
    return res.status(500).json({
      message: "An error occurred while fetching the product.",
      error: error.message,
      success: false,
    });
  }
};



const getAllProducts = async (req, res) => {
  try {
    const queryObj = { ...req.query };

    // Remove excluded field
    const excludeFields = ["page", "sort", "limit", "fields"];
    excludeFields.forEach((el) => delete queryObj[el]);

    // Create filtered query for search
    let query = productModel.find(queryObj);

    // Sorting   data 
    if (req?.query?.sort) {
      const sortBy = req.query.sort
        .split(',')
        .map(field => {
          if (field.startsWith('-')) {
              // For descending order
            return [field.substring(1), 'desc']; 
          }
          // For ascending order
          return [field, 'asc'];  
        })
        .reduce((acc, [field, order]) => {
          acc[field] = order;
          return acc;
        }, {});

      query = query.sort(sortBy); 
    } else {
      query = query.sort('-createdAt');  
    }

    // Select specific fields 
    if (req.query.fields) {
      const fields = req.query.fields.split(",");
      query = query.select(fields);
    } else {
      query = query.select("-__v");  // Exclude the __v field by default
    }

    // Paginate if page and limit are provided
    //pagination
    if (req?.query?.page && req?.query?.limit) {
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 10;
      const skip = (page - 1) * limit;
      query = query.skip(skip).limit(limit);

      const productCount = await productModel.countDocuments();
      if (skip >= productCount) {
        return res.json({
          message: "This page does not exist",
          data: null
        });
      }
    }

    // Query  exec
    const products = await query;

    if (products.length > 0) {
      return res.status(200).json({
        success: true,
        data: products,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "No products found.",
      });
    }

  } catch (error) {
    console.error("Error occurred during product filtering:", error.message);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching products.",
      error: error.message,
    });
  }
};



module.exports = {
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
  getaProduct,
};
