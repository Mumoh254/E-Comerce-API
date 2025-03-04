const cartModel = require("../../models/cartModel");
const userModel = require("../../models/userModel");
const orderModel = require("../../models/orderModel");
const productModel = require("../../models/productModel");
const { validateMongoDbId } = require("../../utils/validateMongoId");
const asyncHandler = require("express-async-handler");
const uniqid = require("uniqid");
const mongoose = require("mongoose");
const sendThankYouEmail = require("../emailController/thankYouMail");

// Create Order
// Enhanced order creation endpoint
const createOrder = asyncHandler(async (req, res) => {
    try {
        const { _id } = req.user;
        const { paymentMethod } = req.body;

        // Validate payment method
        const validMethods = ['mpesa', 'card', 'cash'];
        if (!validMethods.includes(paymentMethod)) {
            return res.status(400).json({ message: "Invalid payment method" });
        }

        // Get user and cart
        const user = await userModel.findById(_id);
        const userCart = await cartModel.findOne({ orderedBy: _id });
        
        if (!userCart || userCart.products.length === 0) {
            return res.status(400).json({ message: "Cart is empty" });
        }

        // Create payment intent
        const paymentIntent = {
            id: uniqid(),
            method: paymentMethod,
            amount: userCart.cartTotal,
            status: paymentMethod === 'cash' ? 'pending' : 'processing',
            created: Date.now(),
            currency: "KSH"
        };

        // Create order
        const newOrder = await orderModel.create({
            products: userCart.products,
            paymentIntent,
            orderedBy: _id,
            orderStatus: "processing"
        });

        // Update stock and clear cart
        await productModel.bulkWrite(userCart.products.map(item => ({
            updateOne: {
                filter: { _id: item.product._id },
                update: { 
                    $inc: { 
                        quantity: -item.count, 
                        sold: +item.count 
                    }
                }
            }
        })));

        await cartModel.findOneAndDelete({ orderedBy: _id });

        res.status(201).json({
            success: true,
            order: newOrder,
            message: "Order created successfully"
        });

    } catch (error) {
        console.error("Order creation error:", error);
        res.status(500).json({
            success: false,
            message: "Error creating order",
            error: error.message
        });
    }
});                    
  

// Get All Orders
const getOrders = asyncHandler(async (req, res) => {
    try {
        const orders = await orderModel.find()
            .populate("orderedBy", "name email")
            .populate("products.product", "title price");

        if (!orders.length) {
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

// Get Order by ID
const getOrderById = asyncHandler(async (req, res) => {
    const { orderId } = req.params;

    // Validate Order ID
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
        return res.status(400).json({ message: "Invalid order ID", success: false });
    }

    try {
        const order = await orderModel.findById(orderId)
            .populate("orderedBy", "name email")
            .populate("products.product", "title price");

        if (!order) {
            return res.status(404).json({ message: "Order not found.", success: false });
        }

        res.status(200).json({ success: true, order });
    } catch (error) {
        res.status(500).json({ message: "Error fetching order", success: false, error: error.message });
    }
});

// Update Order Status
const updateOrderStatus = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const { orderStatus } = req.body;

        // Validate order status
        const validStatuses = ["pending", "processing", "shipped", "completed", "cancelled"];
        if (!validStatuses.includes(orderStatus)) {
            return res.status(400).json({ message: "Invalid order status" });
        }

        const order = await orderModel.findById(id).populate("orderedBy", "email name");

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        if (order.orderStatus === "Completed") {
            return res.status(400).json({ message: "Order is already completed" });
        }

        // Update order status
        order.orderStatus = orderStatus;
        await order.save();

        // Send Thank-You Email when order is completed
        if (orderStatus === "Completed" && order.orderedBy?.email) {
            const emailData = {
                to: order.orderedBy.email,
                subject: "Thank You for Shopping with Majesty Shoe Collection! 🎉",
                html: `
                    <h2>Dear ${order.orderedBy.name || "Valued Customer"},</h2>
                    <p>We appreciate your purchase from <b>Majesty Shoe Collection!</b> 🎉</p>
                    <p>Your order <b>#${order._id}</b> has been successfully completed.</p>
                    <p>We look forward to serving you again soon.</p>
                    <p>Best regards,<br>Majesty Shoe Collection</p>
                `,
            };

            await sendThankYouEmail(emailData);
            console.log(`✅ Thank-you email sent to ${order.orderedBy.email}`);
        }

        return res.json({ message: "Order status updated successfully", order });

    } catch (error) {
        console.error("❌ Error updating order status:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = { createOrder, getOrders, updateOrderStatus, getOrderById };
