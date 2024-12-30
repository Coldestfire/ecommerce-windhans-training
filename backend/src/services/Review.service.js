const { ProductModel } = require('../models')
const { CategoryModel } =  require('../models');
const { ReviewModel } = require('../models');
const ApiError = require("../utils/ApiError");
const cloudinary = require ('../config/cloudinary.config');


class ReviewService {

    static async createReview(user, body) {  
        console.log("from ReviewService: ", user)
        const review = await ReviewModel.create({
            user,
            ...body,
        });
        console.log("from querying reviewService: ", review)
        return review;
    }
    
    
    static async getReviews(id="") {
        try {
            let filter = {};

            // Apply filter if category name is provided
            if (id) {
                filter.productId = { $regex: new RegExp("^" + id + "$", "i") }; // Case-insensitive search
            }

            const reviews = await ReviewModel.find(filter);
            const response = {
                data: reviews,
            };
            return response;

        } catch (error) {
            throw new Error("Failed to fetch reviews. Please try again.");
        }
    }
    

    static async getEveryProduct() {
        try {
            // Fetch all products, no user filtering required
            const products = await ProductModel.find().sort({ createdAt: -1 });
    
            // Count the total number of products
            const totalCount = products.length;
    
            const response = {
                data: products,
                total: totalCount,
            };
    
            return response;
        } catch (error) {
            console.error("Database error in getEveryProduct:", error);
            throw new Error("Failed to fetch products. Please try again.");
        }
    }
    

    static async deleteProduct(user, productId) {
        // Check if the user is logged in
        if (!user) {
            throw new ApiError(401, "User must be logged in to delete a product.");
        }
    
        // Find the product by ID and check if it belongs to the logged-in user
        const product = await ProductModel.findById(productId);
        if (!product) {
            throw new ApiError(404, "Product not found.");
        }
    
        await ProductModel.findByIdAndDelete(productId);
    
        return { msg: "Product deleted successfully" };
    }
    
    static async updateById(user,id, body) {

    
        // Find the product by ID and check if it belongs to the logged-in user
        const product = await ProductModel.findById(id);
        if (!product) {
            throw new ApiError(404, 'Product not found');
        }
    

        // If an image is provided, upload it to Cloudinary
        if (body.image) {
            const { secure_url } = await cloudinary.uploader.upload(body.image, {
                folder: 'products',
                use_filename: true,
                unique_filename: false,
            });
            body.image = secure_url;
        }
    
        // Update the product with the provided data
        await ProductModel.findByIdAndUpdate(id, body);
    
        return {
            msg: 'Product updated successfully',
        };
    }
    
    static async getById(id) {
        // Find the product by ID
        const product = await ProductModel.findById(id);
        if (!product) {
            throw new ApiError(400, "Product Not Found in Record");
        }
    
        return {
            product,
        };
    }
}

module.exports = ReviewService;
