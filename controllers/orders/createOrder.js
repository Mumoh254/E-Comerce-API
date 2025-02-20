const cartModel = require("../../models/cartModel");
const userModel = require("../../models/userModel");
const orderModel = require("../../models/orderModel");
const productModel = require("../../models/productModel");
const { validateMongoDbId } = require("../../utils/validateMongoId");
const asyncHandler = require("express-async-handler");
const uniqid = require("uniqid");
const mongoose = require("mongoose");


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



const getOrders = asyncHandler(async (req, res) => {
    try {
        // Fetch all orders and populate orderedBy (User details)
        const orders = await orderModel.find()
            .populate({
                path: "orderedBy",
                select: "name email", 
            })
            .populate({
                path: "products.product",
                select: "title price", // title and price  product
            }).exec()

        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: "No orders found." });
        }

        res.json({
            success: true,
            orders,
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching orders", error: error.message });
    }
});









const getOrderById = asyncHandler(async (req, res) => {
    const { orderId } = req.params; // Get order ID from URL params

    console.log("Received Order ID:", orderId); // Debugging

    // Validate order ID
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
        return res.status(400).json({ 
            message: "Invalid order ID",
            success: false,
        });
    }

    try {
        // Find the order by ID and populate user and product details
        const order = await orderModel.findById(orderId)
        .populate("orderedBy", "name email") 
        .populate("products.product", "title price") 
        .populate("orderStatus", "orderStatus"); 
    

        // If order is not found
        if (!order) {
            return res.status(404).json({ 
                message: "Order not found.",
                success: false,
            });
        }

        // Return the order details
        res.status(200).json({
            success: true,
            order,
        });
    } catch (error) {
        console.error("Error fetching order:", error);
        res.status(500).json({ 
            message: "Error fetching order", 
            success: false,
            error: error.message,
        });
    }
});






const updateOrderStatus = asyncHandler(async (req, res) => {

    console.log( req.params)
    const { orderId } = req.params; // Get order ID
    const { newStatus } = req.body; 

    console.log(` order  id  ${orderId}`);
    console.log(` new satatus  ${ newStatus}`)

    validateMongoDbId(orderId); 

    try {
        // Find and update the order
        const updatedOrder = await orderModel.findByIdAndUpdate(
            orderId,
            { orderStatus: newStatus },
            { new: true, runValidators: true }
        ).populate("orderedBy", "name email"); // Populate user info

        if (!updatedOrder) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.status(200).json({
            success: true,
            message: "Order status updated successfully",
            order: updatedOrder
        });
    } catch (error) {
        res.status(500).json({ message: "Error updating order status", error: error.message });
    }
});





module.exports = { createOrder  ,  getOrders  ,  updateOrderStatus  ,  getOrderById  };
