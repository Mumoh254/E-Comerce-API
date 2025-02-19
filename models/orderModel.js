const mongoose = require('mongoose'); 


var orderSchema = new mongoose.Schema({
  products: [
    {
      product: {
        type: mongoose.Types.ObjectId,
        ref: "product",
      },
      count: {
        type: Number,
        required: true,
      },
      color: {
        type: String,
        required: false,
      }
    }
  ],
  paymentIntent: {
    type: String, 
    required: true,
  },
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
    type: mongoose.Types.ObjectId,
    ref: "user",
    required: true,
  }
}  ,  {timestamps:  true});

// Export the model
module.exports = mongoose.model('order', orderSchema);
