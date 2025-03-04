const asyncHandler = require("express-async-handler");
const userModel = require("../../models/userModel");

const cartModel = require("../../models/cartModel");
const productModel = require("../../models/productModel");
const { validateMongoDbId } = require("../../utils/validateMongoId");
const mongoose = require("mongoose");
const userCart = asyncHandler(async (req, res) => {
    try {
        const { cart } = req.body;
        const { _id } = req.user;

        if (!Array.isArray(cart)) {
            return res.status(400).json({ success: false, message: "Invalid cart format." });
        }

        const validatedCart = await Promise.all(cart.map(async (item) => {
            const product = await productModel.findById(item._id);
            if (!product) throw new Error(`Product not found: ${item._id}`);

            return {
                product: product._id,
                count: item.count,
                price: product.price
            };
        }));

        const cartData = await cartModel.findOneAndUpdate(
            { orderedBy: _id },
            { $set: { products: validatedCart } }, // Ensure updates happen correctly
            { new: true, upsert: true }
        ).populate("products.product", "_id name price image");

        res.json({ success: true, cart: cartData });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

const getUserCart = asyncHandler(async (req, res) => {
    try {
        const { _id } = req.user;

        const cart = await cartModel
            .findOne({ orderedBy: _id })
            .populate({
                path: "products.product",
                select: "_id name price image"
            });

        if (!cart || cart.products.length === 0) {
            return res.status(404).json({ success: false, message: "Your cart is empty" });
        }

        console.log("Cart data with images:", cart.products);

        return res.status(200).json({ success: true, cart });
    } catch (error) {
        console.error("Error fetching cart:", error);
        return res.status(500).json({ success: false, message: "Internal server error. Please try again later." });
    }
});


// ✅ Empty Cart
const emptyCart = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validateMongoDbId(_id);

    try {
        const user = await userModel.findById(_id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const cart = await cartModel.findOneAndDelete({ orderedBy: user._id });
        if (!cart) {
            return res.status(404).json({ message: "No cart found for this user" });
        }

        res.json({
            message: "Cart emptied successfully",
            status: 200,
            success: true,
        });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});


module.exports = {
    userCart,
    getUserCart,
    emptyCart,
  
};
