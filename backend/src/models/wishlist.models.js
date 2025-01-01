const mongoose = require('mongoose');

// Define Wishlist Schema
const wishlistSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user', // Reference to the User model
      required: true,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product', // Reference to the Product model
          required: true,
        },
        addedAt: {
          type: Date,
          default: Date.now, // Timestamp when the product was added to the wishlist
        },
      },
    ],
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

// Export Wishlist Model
const Wishlist = mongoose.model('Wishlist', wishlistSchema);

module.exports = Wishlist;
