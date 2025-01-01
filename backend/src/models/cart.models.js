const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true },
  }],
  total: { type: Number, required: true },
  status: { type: String, required: true },
  isPurchased: { type: Boolean, default: false }, 
}, {
  timestamps: true
});

module.exports = mongoose.model("Cart", cartSchema);
