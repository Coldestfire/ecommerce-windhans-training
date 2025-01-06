const { ProductModel } = require('../models')
const { CategoryModel } =  require('../models');
const ApiError = require("../utils/ApiError");
const cloudinary = require('../config/cloudinary.config');
const redis = require('../config/redis.config');

class ProductService {
    static async createProduct(user, body) {  
        const { images } = body; // Accept multiple images
    
        if (images && images.length > 0) {
            // Upload multiple images to Cloudinary
            const uploadedImages = await Promise.all(
                images.map(async (image) => {
                    const { secure_url } = await cloudinary.uploader.upload(image, {
                        folder: 'products',
                        use_filename: true,
                        unique_filename: false,
                    });
                    return secure_url; // Return the secure URL
                })
            );
            body.images = uploadedImages; // Replace 'images' with uploaded URLs
        }
    
        const product = await ProductModel.create({
            ...body,
            user,
        });
    
        return product;
    }
    
    
    
    static async getProducts(page = 1, query = "", category = "") {
        const cacheKey = `products:${page}:${query}:${category}`;
        
        try {
            // Try cache first
            const cached = await redis.get(cacheKey);
            if (cached) {
                console.log('🚀 Cache HIT:', cacheKey);
                return cached;
            }
            console.log('❌ Cache MISS:', cacheKey);

            const validatedPage = Math.max(1, page);
            const limit = 10;
            const skip = (validatedPage - 1) * limit;
            
            const filter = {};
            if (query) {
                filter.name = { $regex: query, $options: "i" };
            }
            
            if (category) {
                const categoryDoc = await CategoryModel.findOne({ name: category });
                if (!categoryDoc) {
                    throw new ApiError(404, "Category not found");
                }
                filter.category = categoryDoc._id;
            }

            const products = await ProductModel.find(filter)
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 })
                .populate({
                    path: "category",
                    select: "name _id"
                })
                .lean();

            const totalCount = await ProductModel.countDocuments(filter);

            const response = {
                data: products,
                total: totalCount,
                currentPage: validatedPage,
                totalPages: Math.ceil(totalCount / limit),
                hasMore: skip + products.length < totalCount,
            };

            // Cache for 5 minutes
            await redis.set(cacheKey, response, { ex: 300 });
            console.log('✅ Cached successfully:', cacheKey);

            return response;
        } catch (error) {
            console.error("Error in getProducts:", error);
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(500, "Failed to fetch products. Please try again.");
        }
    }
    

    static async getEveryProduct(page = 1) {
        const cacheKey = `everyProduct:${page}`;
        
        try {
            // Try cache first
            const cached = await redis.get(cacheKey);
            if (cached) {
                console.log('🚀 Cache HIT:', cacheKey);
                return cached;
            }
            console.log('❌ Cache MISS:', cacheKey);

            const limit = 8;
            const skip = (page - 1) * limit;

            // Fetch paginated products
            const products = await ProductModel.find()
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate({
                    path: "category",
                    select: "name _id"
                })
                .lean();

            // Get total count for pagination
            const totalCount = await ProductModel.countDocuments();

            const response = {
                data: products,
                total: totalCount,
                currentPage: page,
                totalPages: Math.ceil(totalCount / limit),
                hasMore: skip + products.length < totalCount,
            };

            // Cache for 5 minutes
            await redis.set(cacheKey, JSON.stringify(response), { ex: 300 });
            console.log('✅ Cached successfully:', cacheKey);

            return response;
        } catch (error) {
            console.error("Error in getEveryProduct:", error);
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(500, "Failed to fetch products. Please try again.");
        }
    }
    
    

    static async deleteProduct(user, productId) {
        try {
            if (!user) {
                throw new ApiError(401, "User must be logged in to delete a product.");
            }

            const product = await ProductModel.findById(productId);
            if (!product) {
                throw new ApiError(404, "Product not found.");
            }

            await ProductModel.findByIdAndDelete(productId);

            // Invalidate caches
            await redis.del(`product:${productId}`);
            await redis.del(new RegExp('products:*'));
            await redis.del(new RegExp('everyProduct:*'));

            return { msg: "Product deleted successfully" };
        } catch (error) {
            console.error("Error in deleteProduct:", error);
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(500, "Failed to delete product. Please try again.");
        }
    }
    
    static async updateById(user, id, body) {
        try {
            const product = await ProductModel.findById(id);
            if (!product) {
                throw new ApiError(404, 'Product not found');
            }

            if (body.image) {
                const { secure_url } = await cloudinary.uploader.upload(body.image, {
                    folder: 'products',
                    use_filename: true,
                    unique_filename: false,
                });
                body.image = secure_url;
            }

            await ProductModel.findByIdAndUpdate(id, body);

            // Invalidate caches
            await redis.del(`product:${id}`);
            await redis.del(new RegExp('products:*'));
            await redis.del(new RegExp('everyProduct:*'));

            return {
                msg: 'Product updated successfully',
            };
        } catch (error) {
            console.error("Error in updateById:", error);
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(500, "Failed to update product. Please try again.");
        }
    }
    
    static async getById(id) {
        const cacheKey = `product:${id}`;
        
        try {
            // Try cache first
            const cached = await redis.get(cacheKey);
            if (cached) {
                console.log('🚀 Cache HIT:', cacheKey);
                return cached;
            }
            console.log('❌ Cache MISS:', cacheKey);

            const product = await ProductModel.findById(id).populate('category').lean();
            if (!product) {
                throw new ApiError(400, "Product Not Found in Record");
            }

            const response = { product };
            
            // Cache for 10 minutes
            await redis.set(cacheKey, response, { ex: 600 });
            console.log('✅ Cached successfully:', cacheKey);

            return response;
        } catch (error) {
            console.error("Error in getById:", error);
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(500, "Failed to fetch product. Please try again.");
        }
    }
    
    }


module.exports = ProductService;
