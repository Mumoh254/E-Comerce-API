const mongoose = require('mongoose'); 

const cartSchema = new mongoose.Schema({
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
      },
      count: {
        type: Number,
        required: true,
        min: 1
      },
      price: {
        type: Number,
        required: true
      },
      color: {
        type: String,
        required: false
      }
    }
  ],
  

  paymentIntent: { type: String },

  orderStatus: {
    type: String,
    default: "Not Processed",
    enum: [
      "Not Processed", "Processed",
      "Cash On Delivery", "Processing",
      "Dispatched", "Cancelled", "Completed"
    ]
  },

  orderedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  cartTotal: {
    type: Number,
    default: 0
  },

  totalAfterDiscount: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

const cartModel = mongoose.model("Cart", cartSchema);
module.exports = cartModel;
