const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    review: { type: String }
},
{
timestamps: true
}
);

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;