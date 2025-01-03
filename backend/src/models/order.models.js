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
					required: false,
				},
				quantity: {
					type: Number,
					required: true,
					min: 1,
				},
				price: {
					type: Number,
					required: true,
					min: 0,
				},
			},
		],
		totalAmount: {
			type: Number,
			required: true,
			min: 0,
		},
		status: {
			type: String,
			enum: ['pending', 'processing', 'completed', 'failed'],
			default: 'pending'
		},
		razorpayOrderId: {
			type: String,
			unique: true,
		},
		razorpayPaymentId: {
			type: String,
			unique: true,
			sparse: true
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