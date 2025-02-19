const asyncHandler = require("express-async-handler");
const userModel = require("../../models/userModel");
const Cart = require("../../models/cartModel");
const productModel = require("../../models/productModel"); 
const { validateMongoDbId } = require("../../utils/validateMongoDbId");

// Add or Update User Cart
const userCart = asyncHandler(async (req, res) => {
    const { cart } = req.body;
    const { _id } = req.user; 
    validateMongoDbId(_id); 


    try {

        let products = [];
        let cartTotal = 0;

        // Check if the user already has a cart
        const alreadyExistCart = await Cart.findOne({ orderedBy: _id });
        if (alreadyExistCart) {
            await alreadyExistCart.remove();
        }

       
        for (let i = 0; i < cart.length; i++) {
            let object = {};
            object.product = cart[i]._id;
            object.count = cart[i].count;
            object.color = cart[i].color;

            // Fetch the product price
            let getPrice = await productModel.findById(cart[i]._id).select("price").exec();
            object.price = getPrice.price;

            products.push(object);
            cartTotal += object.price * object.count;
        }

        // Create a new cart
        const newCart = await new Cart({
            orderedBy: _id,
            orderedByName: req.user.name,
            orderedByPhoneNumber: req.user.orderedByPhoneNumber,
            products: products,
            totalPrice: cartTotal,
        }).save();

        res.status(200).json({
            data: newCart,
            success: true,
            message: "Cart updated successfully",
        });
    } catch (error) {
        throw new Error(error.message);
    }
});

// Get User Cart
const getUserCart = asyncHandler(async (req, res) => {
    const { _id } = req.user; 
    validateMongoDbId(_id); 
    try {
        const cart = await Cart.findOne({ orderedBy: _id });
        if (cart) {
            res.status(200).json({
                data: cart,
                success: true,
            });
        } else {
            res.status(404).json({
                message: "Cart not found",
                success: false,
            });
        }
    } catch (error) {
        throw new Error(error.message);
    }
});


module.exports = {
    userCart,
    getUserCart,
};