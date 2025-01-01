const { ProductModel } = require('../models')
const { CategoryModel } =  require('../models');
const { ReviewModel } = require('../models');
const ApiError = require("../utils/ApiError");
const cloudinary = require ('../config/cloudinary.config');


class ReviewService {

    static async createReview(user, body) {  
        // Check if user has already reviewed this product
        const existingReview = await ReviewModel.findOne({
            user: user,
            productId: body.productId
        });
    
        if (existingReview) {
            throw new ApiError(400, "You have already reviewed this product");
        }
    
        const review = await ReviewModel.create({
            user,
            ...body,
        });
    
        return review;
    }
    
    
    static async getReviews(id = "") {
        console.log("id: ", id)
        try {
            // Apply filter only if id is provided
            const filter = id ? { productId: id } : {};
            
            console.log("filter: ", filter)
            // Query the database with the filter
            const reviews = await ReviewModel.find(filter)
            .populate('user', 'name email');

            console.log("reviews: ", reviews)
    
            // Return the response
            return {
                data: reviews,
            };
    
        } catch (error) {
            throw new Error("Failed to fetch reviews. Please try again.");
        }
    }

    static async deleteReview(userId, reviewId) {
        try {
            // Find the review
            const review = await ReviewModel.findById(reviewId);
            
            if (!review) {
                throw new ApiError(404, "Review not found");
            }

            // Check if the user is the owner of the review
            if (review.user.toString() !== userId) {
                throw new ApiError(403, "You can only delete your own reviews");
            }

            // Delete the review
            await ReviewModel.findByIdAndDelete(reviewId);

            return { message: "Review deleted successfully" };
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new Error("Failed to delete review");
        }
    }

    static async updateReview(userId, reviewId, body) {
        try {
            // Find the review
            const review = await ReviewModel.findById(reviewId);
            
            if (!review) {
                throw new ApiError(404, "Review not found");
            }

            // Check if the user is the owner of the review
            if (review.user.toString() !== userId) {
                throw new ApiError(403, "You can only update your own reviews");
            }

            // Update the review
            const updatedReview = await ReviewModel.findByIdAndUpdate(
                reviewId,
                { 
                    rating: body.rating,
                    review: body.review
                },
                { new: true }
            );

            return updatedReview;
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new Error("Failed to update review");
        }
    }
    
}
module.exports = ReviewService;
