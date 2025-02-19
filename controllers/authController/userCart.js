const asyncHandler = require("express-async-handler");
const userModel = require("../../models/userModel");
const cartModel = require("../../models/cartModel");
const productModel = require("../../models/productModel"); 
const { validateMongoDbId } = require("../../utils/validateMongoId");
const   mongoose  =  require("mongoose")

// Add or Update User Cart
const userCart = asyncHandler(async (req, res, next) => {
    const { cart } = req.body;
    const { _id } = req.user; 

    // Validate user ID
    validateMongoDbId(_id);

    try {
        let products = [];

        // Find the user
        const user = await userModel.findById(_id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if a cart already exists for the user
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

        let   cartTotal  =  0;
        for (let  i  =  0 ;  i  < products.length;  i++){
            cartTotal  =  cartTotal + products[i].price * products[i].count;

            console.log(cartTotal);
            console.log(products)
        }
     
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

module.exports = {
    userCart,
};
