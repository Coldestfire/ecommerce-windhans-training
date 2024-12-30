const { ProductModel } = require('../models')
const { CategoryModel } =  require('../models');
const ApiError = require("../utils/ApiError");
const cloudinary = require ('../config/cloudinary.config');


class ProductService {

    static async createProduct(user, body) {  
        const { image } = body;

        if (image) {
            const { secure_url } = await cloudinary.uploader.upload(image, {
                folder: 'products',
                use_filename: true,
                unique_filename: false,
            });
            body.image = secure_url;
        }
    
        const product = await ProductModel.create({
            ...body,
            user,
        });

        return product;
    }
    
    
    static async getProducts(page = 1, query = "", category = "") {
        const validatedPage = Math.max(1, page); 
        const limit = 10; 
        const skip = (validatedPage - 1) * limit;
    
        // Construct the initial filter object (no user constraint)
        const filter = {};
    
        // If query is provided, filter by product name
        if (query) {
            filter.name = { $regex: query, $options: "i" };
        }
    
        console.log("category provided: ", category);
    
        // Handle category by name (if provided)
        if (category) {
            try {
                const categoryDoc = await CategoryModel.findOne({ name: category });
                console.log("categoryDoc: ", categoryDoc);
                if (!categoryDoc) {
                    throw new Error("Category not found");
                }
                filter.category = categoryDoc._id; // Use category ID in the filter
            } catch (error) {
                console.error("Error finding category:", error);
                throw new Error("Invalid category provided.");
            }
        }
    
        try {
            // Fetch products and populate the category name
            const products = await ProductModel.find(filter)
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 })
                .populate("category", "name"); // Populate category name only
    
            // Count total matching documents
            const totalCount = await ProductModel.countDocuments(filter);
    
            const response = {
                data: products,
                total: totalCount,
                hasMore: skip + products.length < totalCount,
            };
    
            return response;
        } catch (error) {
            console.error("Database error in getProducts:", error);
            throw new Error("Failed to fetch products. Please try again.");
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

module.exports = ProductService;
