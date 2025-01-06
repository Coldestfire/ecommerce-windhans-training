const { CategoryModel } = require('../models')
const ApiError = require("../utils/ApiError");
const redis = require('../config/redis.config');

class CategoryService {

    static async createCategory(user, body) {
        try {
            const category = await CategoryModel.create({
                ...body,
                user,
            });

            // Invalidate category cache
            await redis.del('categories:all');
            
            return category;
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(500, "Failed to create category");
        }
    }
    

    static async getCategories(category = "") {
        try {
            const cacheKey = category ? `categories:${category}` : 'categories:all';
            
            // Try cache first
            const cached = await redis.get(cacheKey);
            if (cached) {
                console.log('🚀 Cache HIT:', cacheKey);
                return cached;
            }
            console.log('❌ Cache MISS:', cacheKey);

            let filter = {};
            if (category) {
                filter.name = { $regex: new RegExp("^" + category + "$", "i") };
            }

            const categories = await CategoryModel.find(filter).lean();
            const response = {
                data: categories,
            };

            // Cache for 5 minutes
            await redis.set(cacheKey, JSON.stringify(response), { ex: 300 });
            console.log('✅ Cached successfully:', cacheKey);

            return response;
        } catch (error) {
            console.error("Error in getCategories:", error);
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(500, "Failed to fetch categories. Please try again.");
        }
    }
    

    static async deleteCategory(user, categoryId) {
        try {
            if (!user) {
                throw new ApiError(401, "User must be logged in to delete a category.");
            }

            const category = await CategoryModel.findById(categoryId);
            if (!category) {
                throw new ApiError(404, "Category not found.");
            }

            await CategoryModel.findByIdAndDelete(categoryId);

            // Invalidate category caches
            await redis.del(`categories:${category.name}`);
            await redis.del('categories:all');

            return { msg: "Category deleted successfully" };
        } catch (error) {
            console.error("Error in deleteCategory:", error);
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(500, "Failed to delete category. Please try again.");
        }
    }
}

module.exports = CategoryService;
