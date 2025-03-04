const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
       
        lowercase: true
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
    },
    quantity: {
        type: Number,
        required: true,
    },
    images: {
        type: Array,
        required: true,
    },
    color: {
        type: String,
        default:[]
    },
    brand: {
        type: String,
       
    },
    sold: {
        type: Number,
        default: 0,
    },
    sizes:{
        type: Array,
        default:[]
    }
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);