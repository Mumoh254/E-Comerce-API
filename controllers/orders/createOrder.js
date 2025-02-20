const cartModel = require("../../models/cartModel");
const userModel = require("../../models/userModel");
const orderModel = require("../../models/orderModel");
const productModel = require("../../models/productModel");
const { validateMongoDbId } = require("../../utils/validateMongoId");
const asyncHandler = require("express-async-handler");
const uniqid = require("uniqid");

const createOrder = asyncHandler(async (req, res) => {
    try {
        const { _id } = req.user; 
        validateMongoDbId(_id);

        // Find the user
        const user = await userModel.findById(_id);

        // Get user's cart
        let userCart = await cartModel.findOne({ orderedBy: user._id });

        if (!userCart) {
            return res.status(400).json({ message: "Cart not found" });
        }

        let finalAmount = userCart.cartTotal;

        // Create a new order
        let newOrder = await new orderModel({
            products: userCart.products,
            paymentIntent: {
                id: uniqid(),
                method: "COD",
                amount: finalAmount,
                status: "pending",
                created: Date.now(),
                currency: "KSH", 
            },
            orderedBy: user._id,
            orderStatus: "pending",
        }).save();

        // Update product stock
        let update = userCart.products.map((item) => {
            return {
                updateOne: {
                    filter: { _id: item.product._id },
                    update: { $inc: { quantity: -item.count, sold: +item.count } },
                },
            };
        });

        const updated = await productModel.bulkWrite(update);

        res.json({
            message: "Order created successfully",
            order: newOrder,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


const   getOrders  =   asyncHandler(  async(  req  ,  res  ,  next)=>{


    try {
        
    } catch (error) {
        
    }
})

module.exports = { createOrder  ,  getOrders };
