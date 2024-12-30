const mongoose = require("mongoose")

const Schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    price: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        required: true,
        min: 0
    },
    lowStockThreshold: {
        type: Number,
        default: 10
    },
    images: [ // <-- Changed 'image' to 'images' (array)
        {
            type: String, // Store multiple image URLs
        }
    ],
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
    },
    ratings: [{
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
        rating: { type: Number, min: 1, max: 5 },
        review: { type: String },
        createdAt: { type: Date, default: Date.now }
    }],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    }
}, { timestamps: true })

const model = mongoose.model("Product", Schema)

module.exports = model