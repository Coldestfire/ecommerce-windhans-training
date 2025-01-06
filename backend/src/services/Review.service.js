const { ProductModel } = require('../models')
const { CategoryModel } =  require('../models');
const { ReviewModel } = require('../models');
const ApiError = require("../utils/ApiError");
const cloudinary = require('../config/cloudinary.config');
const redis = require('../config/redis.config');

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

            // Invalidate review cache for this product
            await redis.del(`reviews:${body.productId}`);
            await redis.del('reviews:all');
        
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
            const cacheKey = id ? `reviews:${id}` : 'reviews:all';
            
            // Try cache first
            const cached = await redis.get(cacheKey);
            if (cached) {
                console.log('🚀 Cache HIT:', cacheKey);
                return cached;
            }
            console.log('❌ Cache MISS:', cacheKey);

            // Apply filter only if id is provided
            const filter = id ? { productId: id } : {};
            
            // Query the database with the filter
            const reviews = await ReviewModel.find(filter)
                .populate('user', 'name email')
                .lean();

            const response = {
                data: reviews,
            };

            // Cache for 5 minutes
            await redis.set(cacheKey, JSON.stringify(response), { ex: 300 });
            console.log('✅ Cached successfully:', cacheKey);

            return response;
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

            // Invalidate review caches
            await redis.del(`reviews:${review.productId}`);
            await redis.del('reviews:all');

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

            // Invalidate review caches
            await redis.del(`reviews:${review.productId}`);
            await redis.del('reviews:all');

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
