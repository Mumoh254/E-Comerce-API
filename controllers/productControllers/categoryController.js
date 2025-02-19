const Category = require("../../models/categolModel");
const asyncHandler = require("express-async-handler");

const createCategory = asyncHandler(async (req, res) => {
  try {
    const newCategory = await Category.create(req.body);
    res.json(newCategory);  
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


module.exports  =  {
  createCategory
}
