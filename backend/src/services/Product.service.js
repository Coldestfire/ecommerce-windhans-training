const { ProductModel } = require('../models')
const { CategoryModel } =  require('../models');
const ApiError = require("../utils/ApiError");
const cloudinary = require('../config/cloudinary.config');
const redis = require('../config/redis.config');

const deleteKeysByPattern = async (pattern) => {
    try {
        const keys = await redis.keys(pattern);
        console.log('Found keys to delete:', keys);
        if (keys.length > 0) {
            const pipeline = redis.pipeline();
            keys.forEach(key => pipeline.del(key));
            await pipeline.exec();
            console.log('Successfully deleted keys:', keys);
        }
    } catch (error) {
        console.error('Error deleting keys:', error);
    }
};

class ProductService {
    static async createProduct(user, body) {  
        try {
            const { images } = body;

            if (images && images.length > 0) {
                try {
                    // Upload multiple images to Cloudinary
                    const uploadedImages = await Promise.all(
                        images.map(async (image) => {
                            const { secure_url } = await cloudinary.uploader.upload(image, {
                                folder: 'products',
                                use_filename: true,
                                unique_filename: false,
                            });
                            return secure_url;
                        })
                    );
                    body.images = uploadedImages;
                } catch (error) {
                    console.error("Cloudinary upload error:", error);
                    throw new ApiError(500, "Failed to upload images");
                }
            }

            // Validate required fields
            if (!body.name || !body.price || body.stock === undefined) {
                throw new ApiError(400, "Missing required fields");
            }
            // await redis.del(`products:1::`);
            await deleteKeysByPattern('products:*');

            const product = await ProductModel.create({
                ...body,
                user,
            });



            return product;
        } catch (error) {
            console.error("Error in createProduct:", error);
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(500, "Failed to create product. Please try again.");
        }
    }
    
    
    
    static async getProducts(page = 1, query = "", category = "") {
        try {
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

            return {
                data: products,
                total: totalCount,
                currentPage: validatedPage,
                totalPages: Math.ceil(totalCount / limit),
                hasMore: skip + products.length < totalCount,
            };
        } catch (error) {
            console.error("Error in getProducts:", error);
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(500, "Failed to fetch products. Please try again.");
        }
    }
    

    static async getEveryProduct(page = 1) {
        const limit = 10;
        const skip = (page - 1) * limit;
        
        try {
            const products = await ProductModel.find()
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 })
                .populate({
                    path: "category",
                    select: "name _id"
                })
                .lean();

            const totalCount = await ProductModel.countDocuments();

            return {
                data: products,
                total: totalCount,
                currentPage: page,
                totalPages: Math.ceil(totalCount / limit),
                hasMore: skip + products.length < totalCount,
            };
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

            // Invalidate caches
            await redis.del(`product:${productId}`);
            await deleteKeysByPattern('products:*');
            await deleteKeysByPattern('everyProduct:*');

            const product = await ProductModel.findById(productId);
            if (!product) {
                throw new ApiError(404, "Product not found.");
            }

            console.log("productID: ",productId);
            console.log("product: ",product);

            await ProductModel.findByIdAndDelete(productId);

            

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
            await deleteKeysByPattern('products:*');
            await deleteKeysByPattern('everyProduct:*');

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
        try {
            const product = await ProductModel.findById(id)
                .populate('category')
                .lean();
                
            if (!product) {
                throw new ApiError(400, "Product Not Found in Record");
            }

            return { product };
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
