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
        required: true, // You can add validation here if you need
      },
      color: {
        type: String,
        required: false, // Optional, if color is not always needed
      }
    }
  ],
  paymentIntent: {
    type: String, // You can specify more detailed structure based on your payment system
    required: true, // Assuming it's required
  },
  orderStatus: {
    type: String,
    default: "Not Processed", // Fixed typo here (was "defgault")
    enum: [
      "Not Processed", "Processed",
      "Cash On Delivery", "Processing",
      "Dispatched", "Cancelled", "Completed"
    ]
  },
  orderedBy: {
    type: mongoose.Types.ObjectId,
    ref: "user",
    required: true, // Ensure that an order is linked to a user
  },
  price:  Number,
  cartTotal:  Number,
  totalAfterDiscoubnt:  Number,
});

// Export the model
module.exports = mongoose.model('Cart', cartSchema); // Fixed the model name to 'Cart'
