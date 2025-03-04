const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    products: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
            count: { type: Number, required: true },
        }
    ],
    paymentIntent: {
        id: { type: String, required: true },
        method: { type: String, enum: ["mpesa", "card", "cash"], required: true },
        amount: { type: Number, required: true },
        status: { type: String, enum: ["pending", "processing", "completed"], default: "pending" },
        created: { type: Date, default: Date.now },
        currency: { type: String, default: "KSH" },
    },
    orderedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    orderStatus: { type: String, enum: ["pending", "processing", "shipped", "completed", "cancelled"], default: "processing" },
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
