const asyncHandler = require("express-async-handler");
const userModel = require("../../models/userModel");
const coupenModel = require("../../models/userModel");
const cartModel = require("../../models/cartModel");
const productModel = require("../../models/productModel"); 
const { validateMongoDbId } = require("../../utils/validateMongoId");
const mongoose = require("mongoose");

// Add or Update User Cart
const userCart = asyncHandler(async (req, res, next) => {
    const { cart } = req.body;
    const { _id } = req.user; 

    // Validate user ID
    validateMongoDbId(_id);

    try {
        let products = [];

        // Find the user
        const user = await userModel.findById(_id).select({ name: 1, email: 1 });


        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Validate cart
        if (!Array.isArray(cart) || cart.length === 0) {
            return res.status(400).json({ message: "Cart is empty or invalid" });
        }

        // Check  cart already exists for the user
        const alreadyExistCart = await cartModel.findOne({ orderedBy: user._id });
        if (alreadyExistCart) {
            await alreadyExistCart.deleteOne();
        }

        for (let i = 0; i < cart.length; i++) {
            let object = {};
        
            if (!mongoose.Types.ObjectId.isValid(cart[i]._id)) {
                return res.status(400).json({ message: `Invalid Product ID: ${cart[i]._id}` });
            }
        
            object.product = cart[i]._id;
            object.count = cart[i].count;
            object.color = cart[i].color;
        
            let getPrice = await productModel.findById(cart[i]._id).select("price").exec();
            if (getPrice) {
                object.price = getPrice.price;
                products.push(object);
            }
        }

        let cartTotal = products.reduce((total, item) => total + item.price * item.count, 0);

        console.log("Cart Total:", cartTotal);
        console.log("Products:", products);

     
        

        console.log(user)

        let  newCart   =  await cartModel({
            products,
            cartTotal,
            orderedBy: user._id,
            orderedByName: user.name,  
             orderedByEmail: user.email 

        }).save();

        return res.json({
         
            data: newCart,
            message:  "Cart  updated  sucessfully",
            status:  200,
            sucess:  true,

            
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
});



const   getUserCart   =   asyncHandler(  async  (  req  ,  res)=>{
    const   { validateMongoDbId } =  require("../../utils/validateMongoId")
    const {_id}  =  req.user;


    try {

        const cart = await cartModel
        .findOne({ orderedBy: _id })
        .populate("products.product"  ," _id  title  price totalAfterDiscount"); 

        res.json({
            cart:  cart
        })
        
    } catch (error) {
        
    }
})

const emptyCart = asyncHandler(async (req, res) => {
    const { _id } = req.user;

    // Validate MongoDB ID
    validateMongoDbId(_id);

    try {
        // Find the user
        const user = await userModel.findById(_id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Find and remove the cart
        const cart = await cartModel.findOneAndDelete({ orderedBy: user._id });

        if (!cart) {
            return res.status(404).json({ message: "No cart found for this user" });
        }

        res.json({
            message: "Cart emptied successfully",
            status: 200,
            success: true,
            data: cart,
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
});




const applyCoupon = asyncHandler(async (req, res) => {
    const { coupon } = req.body; // Corrected spelling from "coupen" to "coupon"
    const { _id } = req.user;
    validateMongoDbId(_id);

    try {
        // Check if the coupon exists and is valid
        const validCoupon = await coupenModel.findOne({
            name: coupon
        });

        if (!validCoupon) {
            return res.status(400).json({ message: "Invalid or expired coupon" });
        }

        // Get the user's cart
        const user = await userModel.findOne({ _id });
        const cart = await cartModel.findOne({ orderedBy: user._id }).populate("products.product");

        if (!cart) {
            return res.status(400).json({ message: "Cart not found" });
        }

        let { cartTotal } = cart;

        // Calculate discount


        let totalAfterDiscount = (cartTotal - (cartTotal * validCoupon.discount / 100)).toFixed(2);

        // Update the cart with the discount


        const updatedCart = await cartModel.findOneAndUpdate(
            { orderedBy: user._id },  
            { $set: { totalAfterDiscount } },  
            { new: true }
        );

        return res.json({
            message: "Coupon applied successfully",
            discount: validCoupon.discount,
            totalAfterDiscount: updatedCart.totalAfterDiscount, 
            // Use `updatedCart
        });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});


module.exports = {
    userCart,
    getUserCart,
    emptyCart ,
    applyCoupon  
};
