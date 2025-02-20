const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var cartSchema = new mongoose.Schema({
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
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
    type: String

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
    ref: "User",
    
  },

  price: Number,

  cartTotal: Number,
  totalAfterDiscount: Number,
  
});

// Export the model
module.exports = mongoose.model('Cart', cartSchema); 
