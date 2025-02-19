const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var cartSchema = new mongoose.Schema({
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
  },
  price:  Number,
  cartTotal:  Number,
  totalAfterDiscoubnt:  Number,
});

// Export the model
module.exports = mongoose.model('Cart', cartSchema); 
