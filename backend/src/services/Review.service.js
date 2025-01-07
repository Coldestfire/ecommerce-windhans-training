const { ReviewModel } = require('../models');
const ApiError = require("../utils/ApiError");

class ReviewService {
    static async createReview(user, body) {  
        try {
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
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(500, "Failed to create review");
        }
    }
    
    static async getReviews(id = "") {
        try {
            const filter = id ? { productId: id } : {};
            
            const reviews = await ReviewModel.find(filter)
                .populate('user', 'name email')
                .lean();

            return {
                data: reviews,
            };
        } catch (error) {
            console.error("Error in getReviews:", error);
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(500, "Failed to fetch reviews. Please try again.");
        }
    }

    static async deleteReview(userId, reviewId) {
        try {
            const review = await ReviewModel.findById(reviewId);
            
            if (!review) {
                throw new ApiError(404, "Review not found");
            }

            if (review.user.toString() !== userId) {
                throw new ApiError(403, "You can only delete your own reviews");
            }

            await ReviewModel.findByIdAndDelete(reviewId);

            return { message: "Review deleted successfully" };
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(500, "Failed to delete review");
        }
    }

    static async updateReview(userId, reviewId, body) {
        try {
            const review = await ReviewModel.findById(reviewId);
            
            if (!review) {
                throw new ApiError(404, "Review not found");
            }

            if (review.user.toString() !== userId) {
                throw new ApiError(403, "You can only update your own reviews");
            }

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
            throw new ApiError(500, "Failed to update review");
        }
    }
}

module.exports = ReviewService;
