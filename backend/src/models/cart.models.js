const mongoose = require('mongoose');

// Define Cart Schema
const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the User model
      required: true,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product', // Reference to the Product model
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1, // Ensures quantity is at least 1
        },
        price: {
          type: Number,
          required: true, // Stores price at the time the item is added
        },
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
      default: 0, // Total price for all items in the cart
    },
    status: {
      type: String,
      enum: ['pending', 'completed'],
      default: 'pending',
    },
  },
  { timestamps: true } // Adds createdAt and updatedAt timestamps
);

// Export Cart Model
const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
