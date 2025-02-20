const mongoose = require('mongoose');

// Define the Coupon Schema
const couponSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            uppercase: true, 
            trim: true,
        },
        discount: {
            type: Number,
            required: true,
            min: 1,
            max: 100, 
        },
        expiry: {
            type: Date,
            required: true,
        },
    },
    { timestamps: true }
);


module.exports = mongoose.model('Coupon', couponSchema);
