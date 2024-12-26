const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
  amount: { type: Number, required: true },
  paymentMethod: { type: String, enum: ["credit_card", "paypal", "stripe"], required: true },
  paymentStatus: { type: String, enum: ["pending", "completed", "failed"], default: "pending" },
}, {
  timestamps: true
});

module.exports = mongoose.model("Payment", paymentSchema);
