const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
    title: {
        type: String,
    
        trim: true
    },
    slug: {
        type: String,
        lowercase: true,
 
    },
    description: {
        type: String,
       
    },
    price: {
        type: Number,
        
    },
    category: {
        type: String,
       
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
      
    },
    ratings: [
        {
            star: Number,
            postedby: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
        }
    ],
    brand: {
        type: String,
    
     
    },
    sold: {
        type: Number,
        default: 0,
        select: false
    }
}, { timestamps: true });

const productModel = mongoose.model("Product", productSchema);
module.exports = productModel;
