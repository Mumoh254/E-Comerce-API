const express = require("express");
const productModel = require("../../models/productModel");
const slugify = require("slugify");
const { httpRequestToRequestData } = require("@sentry/core");

const createProduct = async (req, res, next) => {
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    // Create the new product
    const newProduct = await productModel.create(req.body);
    if (newProduct) {
      return res.status(201).json({
        message: "Product created successfully!",
        data: newProduct,
        success: true,
      });
    } else {
      return res.status(500).json({
        messaage: "Product  creation  failed !",
        sucess: false,
        data: null
      })
    }
  } catch (error) {
    console.error("Error occurred:", error.message);
    return res.status(500).json({
      message: "title  should be  unique  while creating the product.",
      error: error.message,
      success: false,
    });
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params; // or use slug if you prefer slug-based identification
    const updatedProductData = req.body;

    // Check if the product exists
    const product = await productModel.findById(id);
    if (!product) {
      return res.status(404).json({
        message: "Product not found.",
        success: false,
      });
    }

    // Generate slug if title is updated
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }

    // Update the product
    const updatedProduct = await productModel.findByIdAndUpdate(id, req.body, { new: true });
    return res.status(200).json({
      message: "Product updated successfully!",
      data: updatedProduct,
      success: true,
    });
  } catch (error) {
    console.error("Error occurred:", error.message);
    return res.status(500).json({
      message: "An error occurred while updating the product.",
      error: error.message,
      success: false,
    });
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params; // or use slug if you prefer slug-based identification
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

    // Remove excluded fields from the query object (pagination, limit, etc.)
    const excludeFields = ["page", "sort", "limit", "fields"];
    excludeFields.forEach((el) => delete queryObj[el]);

    // Create filtered query for search
    let query = productModel.find(queryObj);

    // Sorting
    if (req?.query?.sort) {
      const sortBy = req.query.sort
        .split(',')
        .map(field => {
          if (field.startsWith('-')) {
            return [field.substring(1), 'desc'];  // For descending order
          }
          return [field, 'asc'];  // For ascending order
        })
        .reduce((acc, [field, order]) => {
          acc[field] = order;
          return acc;
        }, {});

      query = query.sort(sortBy);  // Apply the sort to the MongoDB query
    } else {
      query = query.sort('-createdAt');  // Default sorting by createdAt in descending order
    }

    // Select specific fields (if specified)
    if (req.query.fields) {
      const fields = req.query.fields.split(",");
      query = query.select(fields);
    } else {
      query = query.select("-__v");  // Exclude the __v field by default
    }

    // Paginate if page and limit are provided
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

    // Execute the query and get the results
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
