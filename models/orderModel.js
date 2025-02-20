const mongoose = require('mongoose');

var orderSchema = new mongoose.Schema({
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
      count: {
        type: Number,

      },
      color: {
        type: String,
        required: false,
      }
    }
  ],

  
  paymentIntent: {},
  orderStatus: {
    type: String,
    default: "Not Processed",

    enum: [
      "Not Processed",
      "Processed",
      "Cash On Delivery",
      "Processing",
      "Dispatched",
      "Cancelled",
      "Delivered",
      "pending"  ,
      "Completed"
    ]
    
  },


  orderedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }


}, { timestamps: true });

// Export the model
module.exports = mongoose.model('order', orderSchema);
