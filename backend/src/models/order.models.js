const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		products: [
			{
				product: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "Product",
					required: true,
				},
				quantity: {
					type: Number,
					required: true,
				},
				price: {
					type: Number,
					required: true,
				},
			},
		],
		totalAmount: {
			type: Number,
			required: true,
		},
		status: {
			type: String,
			enum: ['pending', 'processing', 'completed', 'failed'],
			default: 'pending'
		},
		razorpayOrderId: {
			type: String,
			required: true,
		},
		razorpayPaymentId: {
			type: String,
		},
		razorpaySignature: {
			type: String,
			sparse: true
		},
		paymentStatus: {
			type: String,
				enum: ['pending', 'completed', 'failed'],
				default: 'pending'
		}
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);