const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
    title: {
        type: String,
        required: [true, "Name of this product is required"],
        trim: true
    },
    slug: {
        type: String,
        lowercase: true,
        required: true
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true,
        ref: "category"
    },
    quantity: {
        type: Number,
      
    },

    images: {
        type: Array,
    },
    color: {
        type: String,
        required: true
    },
    ratings: [
        {
            star: Number,
            postedby: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
        }
    ],
    brand: {
        type: String,
        required:  true
     
    },
    sold: {
        type: Number,
        default: 0,
        select: false
    }
}, { timestamps: true });

const productModel = mongoose.model("Product", productSchema);
module.exports = productModel;
