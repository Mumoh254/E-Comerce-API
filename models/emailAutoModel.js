

const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
    userEmail: String,
    userName: String,
    status: { type: String, default: "pending" },
    emailSent: { type: Boolean, default: false } // Track if email was sent
});

module.exports = mongoose.model("Order", OrderSchema);
