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
    image:{
        type: String
    },
    category: {
        type: String,
        required: true
    },
    stars:{
        type: Number,
        default: 0
    },
    
}, { timestamps: true })

const model = mongoose.model("Product", Schema)

module.exports = model